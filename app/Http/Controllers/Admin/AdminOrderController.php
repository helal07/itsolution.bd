<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\ClientPayment;
use App\Models\Employee;
use App\Models\Item;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AdminOrderController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->query('status');
        $paymentStatus = $request->query('payment_status');
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');

        $query = Order::with([
            'user', 
            'client', 
            'item.category', 
            'payments' => fn($q) => $q->with('approver')->orderBy('id', 'desc'), 
            'requirements.attachments', 
            'tasks.assignee', 
            'quote'
        ]);

        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }

        if ($paymentStatus && $paymentStatus !== 'all') {
            $query->where('payment_status', $paymentStatus);
        }

        if ($startDate) {
            $query->whereDate('created_at', '>=', $startDate);
        }

        if ($endDate) {
            $query->whereDate('created_at', '<=', $endDate);
        }

        $orders = $query->orderBy('created_at', 'desc')->paginate(20)->withQueryString();

        // Calculate aggregated financial stats for the order list
        $statsBaseQuery = Order::query();
        if ($startDate) {
            $statsBaseQuery->whereDate('created_at', '>=', $startDate);
        }
        if ($endDate) {
            $statsBaseQuery->whereDate('created_at', '<=', $endDate);
        }

        $totalInvoiced = (float) (clone $statsBaseQuery)->sum('amount');
        $totalDiscount = (float) (clone $statsBaseQuery)->sum('discount');
        $totalPaid = (float) (clone $statsBaseQuery)->sum('paid_amount');
        $totalNet = max(0, $totalInvoiced - $totalDiscount);
        $totalDue = max(0, $totalNet - $totalPaid);
        $totalCount = (clone $statsBaseQuery)->count();
        $paidCount = (clone $statsBaseQuery)->where('payment_status', 'paid')->count();
        $partialCount = (clone $statsBaseQuery)->where('payment_status', 'partial')->count();
        $dueCount = (clone $statsBaseQuery)->where('payment_status', 'due')->count();
        $pendingVerificationCount = ClientPayment::where('status', 'pending')->count();

        $orderStats = [
            'total_invoiced' => $totalInvoiced,
            'total_discount' => $totalDiscount,
            'total_net' => $totalNet,
            'total_paid' => $totalPaid,
            'total_due' => $totalDue,
            'total_count' => $totalCount,
            'paid_count' => $paidCount,
            'partial_count' => $partialCount,
            'due_count' => $dueCount,
            'pending_verification_count' => $pendingVerificationCount,
        ];

        $clients = Client::select('id', 'name', 'phone', 'email', 'contact_person', 'logo')
            ->orderBy('name')
            ->get();

        $users = User::select('id', 'name', 'email', 'phone')
            ->orderBy('name')
            ->get();

        $items = Item::select('id', 'name', 'price')
            ->orderBy('name')
            ->get();

        $employees = Employee::select('id', 'name', 'email', 'phone', 'designation', 'department')
            ->where(function ($q) {
                $q->where('status', 'active')->orWhereNull('status');
            })
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
            'currentStatus' => $status ?? 'all',
            'currentPaymentStatus' => $paymentStatus ?? 'all',
            'startDate' => $startDate ?? '',
            'endDate' => $endDate ?? '',
            'orderStats' => $orderStats,
            'clients' => $clients,
            'users' => $users,
            'items' => $items,
            'employees' => $employees,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'client_id' => ['nullable', 'exists:clients,id'],
            'user_id' => ['nullable', 'exists:users,id'],
            'item_id' => ['required', 'exists:items,id'],
            'project_name' => ['nullable', 'string', 'max:180'],
            'amount' => ['required', 'numeric', 'min:0'],
            'discount' => ['nullable', 'numeric', 'min:0'],
            'paid_amount' => ['nullable', 'numeric', 'min:0'],
            'status' => ['required', 'in:pending,paid,processing,completed,cancelled,failed,refunded'],
            'progress' => ['nullable', 'integer', 'min:0', 'max:100'],
            'payment_method' => ['nullable', 'string', 'max:50'],
            'transaction_id' => ['nullable', 'string', 'max:150', 'unique:orders,transaction_id'],
            'delivery_date' => ['nullable', 'date'],
            'due_date' => ['nullable', 'date'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        if (empty($validated['transaction_id'])) {
            $validated['transaction_id'] = 'INV-' . strtoupper(Str::random(8));
        }

        // If client_id provided but user_id missing, try matching client's email with user or fallback to first admin
        if (empty($validated['user_id'])) {
            if (!empty($validated['client_id'])) {
                $client = Client::find($validated['client_id']);
                if ($client && $client->email) {
                    $matchedUser = User::where('email', $client->email)->first();
                    if ($matchedUser) {
                        $validated['user_id'] = $matchedUser->id;
                    }
                }
            }

            if (empty($validated['user_id'])) {
                $defaultUser = User::first();
                $validated['user_id'] = $defaultUser ? $defaultUser->id : 1;
            }
        }

        // If user_id provided but client_id missing, automatically register this user as a CRM Client
        if (empty($validated['client_id']) && !empty($validated['user_id'])) {
            $orderUser = User::find($validated['user_id']);
            if ($orderUser) {
                $client = Client::firstOrCreate(
                    ['email' => $orderUser->email],
                    [
                        'name' => $orderUser->name,
                        'phone' => $orderUser->phone,
                        'contact_person' => $orderUser->name,
                        'status' => 'active',
                    ]
                );
                $validated['client_id'] = $client->id;
            }
        }

        // If project_name missing, default to service name
        if (empty($validated['project_name'])) {
            $item = Item::find($validated['item_id']);
            $validated['project_name'] = $item ? $item->name : 'Custom Project';
        }

        $validated['added_by'] = $request->user() ? $request->user()->name : 'Admin';
        $validated['currency'] = 'BDT';

        if (!isset($validated['progress'])) {
            if ($validated['status'] === 'completed') $validated['progress'] = 100;
            elseif ($validated['status'] === 'processing') $validated['progress'] = 50;
            elseif ($validated['status'] === 'paid') $validated['progress'] = 25;
            else $validated['progress'] = 0;
        }

        // Financial & Billing calculations
        $amount = (float) $validated['amount'];
        $discount = (float) ($validated['discount'] ?? 0);
        $paidAmount = (float) ($validated['paid_amount'] ?? 0);
        $net = max(0, $amount - $discount);

        if ($validated['status'] === 'paid' && $paidAmount <= 0) {
            $paidAmount = $net;
        }

        if ($paidAmount >= $net && $net > 0) {
            $paymentStatus = 'paid';
            $paidAmount = $net;
        } elseif ($paidAmount > 0) {
            $paymentStatus = 'partial';
        } else {
            $paymentStatus = 'due';
        }

        $validated['amount'] = $amount;
        $validated['discount'] = $discount;
        $validated['paid_amount'] = $paidAmount;
        $validated['payment_status'] = $paymentStatus;

        $order = Order::create($validated);

        // If advance or full payment received, record in client payments ledger
        if ($paidAmount > 0 && !empty($order->client_id)) {
            ClientPayment::create([
                'client_id' => $order->client_id,
                'order_id' => $order->id,
                'amount' => $paidAmount,
                'currency' => 'BDT',
                'payment_method' => $validated['payment_method'] ?? 'bKash',
                'transaction_id' => $order->transaction_id,
                'notes' => $paymentStatus === 'paid' ? 'Full settlement on order creation' : 'Advance payment on order creation',
                'payment_date' => now()->toDateString(),
            ]);
        }

        return back()->with('success', 'Order created successfully with billing recorded.');
    }

    public function update(Request $request, Order $order): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['sometimes', 'in:pending,paid,processing,completed,cancelled,failed,refunded'],
            'progress' => ['sometimes', 'integer', 'min:0', 'max:100'],
            'project_name' => ['sometimes', 'nullable', 'string', 'max:180'],
            'amount' => ['sometimes', 'numeric', 'min:0'],
            'discount' => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'payment_method' => ['sometimes', 'nullable', 'string'],
            'delivery_date' => ['sometimes', 'nullable', 'date'],
            'due_date' => ['sometimes', 'nullable', 'date'],
            'notes' => ['sometimes', 'nullable', 'string'],
        ]);

        // Auto-adjust progress based on status if progress not explicitly sent
        if (isset($validated['status']) && !isset($validated['progress'])) {
            if ($validated['status'] === 'completed') $validated['progress'] = 100;
            elseif ($validated['status'] === 'processing' && $order->progress < 50) $validated['progress'] = 50;
            elseif ($validated['status'] === 'paid' && $order->progress < 25) $validated['progress'] = 25;
            elseif ($validated['status'] === 'pending' && $order->progress > 25) $validated['progress'] = 0;
        }

        // Auto-adjust status based on progress if status not explicitly sent
        if (isset($validated['progress']) && !isset($validated['status'])) {
            if ($validated['progress'] == 100) $validated['status'] = 'completed';
            elseif ($validated['progress'] >= 50 && $order->status === 'pending') $validated['status'] = 'processing';
        }

        $order->update($validated);

        // Sync payment status based on current amount/discount/paid_amount
        $order->refresh();
        $order->syncPaymentStatus();

        return back()->with('success', 'Order updated successfully.');
    }

    /**
     * Record a payment (due collection or installment) for this order.
     */
    public function recordPayment(Request $request, Order $order): RedirectResponse
    {
        $validated = $request->validate([
            'amount' => ['required', 'numeric', 'min:1'],
            'payment_method' => ['required', 'string', 'max:50'],
            'transaction_id' => ['nullable', 'string', 'max:150'],
            'payment_date' => ['required', 'date'],
            'notes' => ['nullable', 'string', 'max:500'],
        ]);

        $collectedAmount = (float) $validated['amount'];
        $order->paid_amount = (float) $order->paid_amount + $collectedAmount;
        $order->save();
        $order->syncPaymentStatus();

        // Always log payment into client_payments ledger as approved
        ClientPayment::create([
            'client_id' => $order->client_id ?? null,
            'order_id' => $order->id,
            'amount' => $collectedAmount,
            'currency' => 'BDT',
            'payment_method' => $validated['payment_method'],
            'status' => 'approved',
            'payment_type' => 'manual',
            'approved_at' => now(),
            'approved_by' => $request->user()->id,
            'transaction_id' => $validated['transaction_id'] ?? ('PAY-' . strtoupper(Str::random(8))),
            'notes' => $validated['notes'] ?? ('Payment of ৳' . number_format($collectedAmount) . ' collected by Admin for Order #' . ($order->transaction_id ?? $order->id)),
            'payment_date' => $validated['payment_date'],
        ]);

        $statusMsg = $order->due_amount > 0 
            ? ' Remaining due: ৳' . number_format($order->due_amount) . '.'
            : ' Order is now FULLY PAID & SETTLED!';

        return back()->with('success', 'Payment of ৳' . number_format($collectedAmount) . ' recorded successfully.' . $statusMsg);
    }

    /**
     * Admin approves a client's pending manual payment.
     * Credits the amount to the order and synchronizes payment status.
     */
    public function approvePayment(Request $request, ClientPayment $clientPayment): RedirectResponse
    {
        if ($clientPayment->status === 'approved') {
            return back()->with('info', 'This payment has already been approved.');
        }

        $clientPayment->update([
            'status' => 'approved',
            'approved_at' => now(),
            'approved_by' => $request->user()->id,
            'rejection_reason' => null,
        ]);

        $order = $clientPayment->order;
        if ($order) {
            $order->paid_amount = (float) ($order->paid_amount ?? 0) + (float) $clientPayment->amount;
            $order->payment_method = $clientPayment->payment_method;
            if (empty($order->transaction_id)) {
                $order->transaction_id = $clientPayment->transaction_id;
            }
            $order->save();
            $order->syncPaymentStatus();

            if ($order->due_amount <= 0 && $order->status === 'pending') {
                $order->status = 'paid';
                $order->save();
            }
        }

        return back()->with('success', 'Payment submission of ৳' . number_format($clientPayment->amount, 2) . ' (TrxID: ' . $clientPayment->transaction_id . ') approved and credited successfully.');
    }

    /**
     * Admin rejects a client's pending manual payment.
     */
    public function rejectPayment(Request $request, ClientPayment $clientPayment): RedirectResponse
    {
        $validated = $request->validate([
            'reason' => ['nullable', 'string', 'max:500'],
        ]);

        // If previously approved, reverse the credited amount
        if ($clientPayment->status === 'approved') {
            $order = $clientPayment->order;
            if ($order) {
                $order->paid_amount = max(0, (float) ($order->paid_amount ?? 0) - (float) $clientPayment->amount);
                $order->save();
                $order->syncPaymentStatus();
            }
        }

        $clientPayment->update([
            'status' => 'rejected',
            'rejection_reason' => $validated['reason'] ?? 'Payment verification rejected by administrator.',
        ]);

        return back()->with('warning', 'Payment submission of ৳' . number_format($clientPayment->amount, 2) . ' (TrxID: ' . $clientPayment->transaction_id . ') has been rejected.');
    }

    public function destroy(Order $order): RedirectResponse
    {
        // Clean up linked payments if any
        ClientPayment::where('order_id', $order->id)->delete();
        $order->delete();
        return back()->with('success', 'Order deleted successfully.');
    }
}
