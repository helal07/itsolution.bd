<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\AdminClientRequest;
use App\Models\Client;
use App\Models\ClientPayment;
use App\Models\Item;
use App\Models\Order;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AdminClientController extends Controller
{
    public function index(Request $request): Response
    {
        $clients = Client::withCount('portfolios')
            ->with(['orders.item', 'orders.payments', 'payments'])
            ->orderBy('sort_order', 'asc')
            ->orderBy('id', 'desc')
            ->paginate(50);

        $services = Item::where('status', 'published')->get(['id', 'name', 'price']);
        $users = User::all(['id', 'name', 'email']);

        // --- Billing Report Stats (month/date filterable) ---
        $reportMonth = $request->input('report_month'); // e.g. "2026-08"
        $reportFrom = $request->input('report_from');    // e.g. "2026-08-01"
        $reportTo = $request->input('report_to');        // e.g. "2026-08-31"

        // Build date range from either month picker or custom date range
        $rangeStart = null;
        $rangeEnd = null;
        $rangeLabel = 'All Time';

        if ($reportMonth) {
            $rangeStart = Carbon::parse($reportMonth . '-01')->startOfMonth();
            $rangeEnd = $rangeStart->copy()->endOfMonth();
            $rangeLabel = $rangeStart->format('F Y');
        } elseif ($reportFrom && $reportTo) {
            $rangeStart = Carbon::parse($reportFrom)->startOfDay();
            $rangeEnd = Carbon::parse($reportTo)->endOfDay();
            $rangeLabel = $rangeStart->format('M d') . ' – ' . $rangeEnd->format('M d, Y');
        }

        // Global aggregated billing stats
        $ordersQuery = Order::query();
        $paymentsQuery = ClientPayment::query();

        if ($rangeStart && $rangeEnd) {
            $ordersQuery->whereBetween('created_at', [$rangeStart, $rangeEnd]);
            $paymentsQuery->whereBetween('payment_date', [$rangeStart->toDateString(), $rangeEnd->toDateString()]);
        }

        $totalInvoiced = (float) $ordersQuery->sum('amount');
        $totalDiscount = (float) (clone $ordersQuery)->sum('discount');
        $totalCollected = (float) $paymentsQuery->sum('amount');
        $totalNet = $totalInvoiced - $totalDiscount;
        $totalDue = max(0, $totalNet - $totalCollected);

        // Counts
        $totalOrders = (clone $ordersQuery)->count();
        $paidOrders = (clone $ordersQuery)->where('payment_status', 'paid')->count();
        $partialOrders = (clone $ordersQuery)->where('payment_status', 'partial')->count();
        $dueOrders = (clone $ordersQuery)->where('payment_status', 'due')->count();

        // Due clients count (clients that have orders with due > 0)
        $dueClientIds = Order::where('payment_status', '!=', 'paid')
            ->whereNotNull('client_id')
            ->pluck('client_id')
            ->unique()
            ->count();

        $billingStats = [
            'total_invoiced' => $totalInvoiced,
            'total_discount' => $totalDiscount,
            'total_net' => $totalNet,
            'total_collected' => $totalCollected,
            'total_due' => $totalDue,
            'total_orders' => $totalOrders,
            'paid_orders' => $paidOrders,
            'partial_orders' => $partialOrders,
            'due_orders' => $dueOrders,
            'due_clients' => $dueClientIds,
            'range_label' => $rangeLabel,
        ];

        return Inertia::render('Admin/Clients/Index', [
            'clients' => $clients,
            'services' => $services,
            'users' => $users,
            'billingStats' => $billingStats,
            'filters' => [
                'report_month' => $reportMonth ?? '',
                'report_from' => $reportFrom ?? '',
                'report_to' => $reportTo ?? '',
            ],
        ]);
    }

    public function store(AdminClientRequest $request): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('logo_file')) {
            $path = $request->file('logo_file')->store('clients', 'public');
            $data['logo'] = '/storage/' . $path;
        } elseif (empty($data['logo'])) {
            $data['logo'] = 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=300&auto=format&fit=crop&q=80';
        }

        unset($data['logo_file']);

        Client::create($data);

        return back()->with('success', 'Customer / Client added successfully.');
    }

    public function update(AdminClientRequest $request, Client $client): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('logo_file')) {
            if ($client->logo && str_starts_with($client->logo, '/storage/clients/')) {
                $oldPath = str_replace('/storage/', '', $client->logo);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('logo_file')->store('clients', 'public');
            $data['logo'] = '/storage/' . $path;
        }

        unset($data['logo_file']);

        $client->update($data);

        return back()->with('success', 'Customer / Client updated successfully.');
    }

    public function destroy(Client $client): RedirectResponse
    {
        if ($client->logo && str_starts_with($client->logo, '/storage/clients/')) {
            $oldPath = str_replace('/storage/', '', $client->logo);
            Storage::disk('public')->delete($oldPath);
        }

        $client->delete();

        return back()->with('success', 'Customer / Client deleted successfully.');
    }

    /**
     * Create an order/invoice for a client — with partial payment (advance) support.
     */
    public function storeOrder(Request $request, Client $client): RedirectResponse
    {
        $validated = $request->validate([
            'item_id' => ['required', 'exists:items,id'],
            'amount' => ['required', 'numeric', 'min:1'],
            'paid_amount' => ['nullable', 'numeric', 'min:0'],
            'discount' => ['nullable', 'numeric', 'min:0'],
            'status' => ['required', 'in:pending,paid,processing,completed'],
            'payment_method' => ['required', 'string'],
            'due_date' => ['nullable', 'date'],
            'notes' => ['nullable', 'string', 'max:500'],
        ]);

        $defaultUser = User::first();
        $amount = (float) $validated['amount'];
        $discount = (float) ($validated['discount'] ?? 0);
        $paidAmount = (float) ($validated['paid_amount'] ?? 0);
        $net = max(0, $amount - $discount);

        // Determine payment status
        if ($paidAmount <= 0) {
            $paymentStatus = 'due';
        } elseif ($paidAmount >= $net) {
            $paymentStatus = 'paid';
            $paidAmount = $net; // cap at net
        } else {
            $paymentStatus = 'partial';
        }

        $item = Item::find($validated['item_id']);

        $order = Order::create([
            'user_id' => $defaultUser ? $defaultUser->id : 1,
            'client_id' => $client->id,
            'item_id' => $validated['item_id'],
            'project_name' => $item ? $item->name : 'Custom Project',
            'amount' => $amount,
            'paid_amount' => $paidAmount,
            'discount' => $discount,
            'currency' => 'BDT',
            'status' => $validated['status'],
            'payment_status' => $paymentStatus,
            'payment_method' => $validated['payment_method'],
            'transaction_id' => 'INV-' . strtoupper(uniqid()),
            'due_date' => $validated['due_date'] ?? null,
            'notes' => $validated['notes'] ?? null,
        ]);

        // If advance payment received, record in client_payments ledger
        if ($paidAmount > 0) {
            ClientPayment::create([
                'client_id' => $client->id,
                'order_id' => $order->id,
                'amount' => $paidAmount,
                'currency' => 'BDT',
                'payment_method' => $validated['payment_method'],
                'transaction_id' => $order->transaction_id,
                'notes' => $paymentStatus === 'paid' ? 'Full payment on invoice creation' : 'Advance payment on invoice creation',
                'payment_date' => now()->toDateString(),
            ]);
        }

        return back()->with('success', 'Invoice created successfully.' . ($paymentStatus === 'partial' ? ' Advance ৳' . number_format($paidAmount) . ' recorded, ৳' . number_format($net - $paidAmount) . ' due.' : ''));
    }

    /**
     * Record a payment (collect due / partial installment) against a client.
     */
    public function storePayment(Request $request, Client $client): RedirectResponse
    {
        $validated = $request->validate([
            'amount' => ['required', 'numeric', 'min:1'],
            'payment_method' => ['required', 'string'],
            'transaction_id' => ['nullable', 'string', 'max:150'],
            'notes' => ['nullable', 'string', 'max:500'],
            'payment_date' => ['required', 'date'],
            'order_id' => ['nullable', 'exists:orders,id'],
        ]);

        $payment = ClientPayment::create([
            'client_id' => $client->id,
            'order_id' => $validated['order_id'] ?? null,
            'amount' => $validated['amount'],
            'currency' => 'BDT',
            'payment_method' => $validated['payment_method'],
            'transaction_id' => $validated['transaction_id'] ?? ('PAY-' . strtoupper(uniqid())),
            'notes' => $validated['notes'] ?? null,
            'payment_date' => $validated['payment_date'],
        ]);

        // Update the linked order's paid_amount and payment_status
        if (!empty($validated['order_id'])) {
            $order = Order::find($validated['order_id']);
            if ($order) {
                $order->paid_amount = (float) $order->paid_amount + (float) $validated['amount'];
                $order->save();
                $order->syncPaymentStatus();
            }
        } else {
            // Auto-distribute payment to oldest due/partial orders
            $remainingPayment = (float) $validated['amount'];
            $pendingOrders = Order::where('client_id', $client->id)
                ->whereIn('payment_status', ['due', 'partial'])
                ->orderBy('created_at', 'asc')
                ->get();

            foreach ($pendingOrders as $order) {
                if ($remainingPayment <= 0) break;

                $due = $order->due_amount;
                if ($due <= 0) continue;

                $applyAmount = min($remainingPayment, $due);
                $order->paid_amount = (float) $order->paid_amount + $applyAmount;
                $order->save();
                $order->syncPaymentStatus();
                $remainingPayment -= $applyAmount;
            }
        }

        return back()->with('success', 'Payment of ৳' . number_format($validated['amount']) . ' recorded successfully.');
    }
}
