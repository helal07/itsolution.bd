<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\ClientPayment;
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
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');

        $query = Order::with(['user', 'client', 'item.category', 'payments']);

        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }

        if ($startDate) {
            $query->whereDate('created_at', '>=', $startDate);
        }

        if ($endDate) {
            $query->whereDate('created_at', '<=', $endDate);
        }

        $orders = $query->orderBy('created_at', 'desc')->paginate(20)->withQueryString();

        $clients = Client::select('id', 'name', 'phone', 'email', 'contact_person', 'logo')
            ->orderBy('name')
            ->get();

        $users = User::select('id', 'name', 'email', 'phone')
            ->orderBy('name')
            ->get();

        $items = Item::select('id', 'name')
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
            'currentStatus' => $status ?? 'all',
            'startDate' => $startDate ?? '',
            'endDate' => $endDate ?? '',
            'clients' => $clients,
            'users' => $users,
            'items' => $items,
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
            'status' => ['required', 'in:pending,paid,processing,completed,cancelled,failed,refunded'],
            'progress' => ['nullable', 'integer', 'min:0', 'max:100'],
            'payment_method' => ['nullable', 'string', 'max:50'],
            'transaction_id' => ['nullable', 'string', 'max:150', 'unique:orders,transaction_id'],
            'delivery_date' => ['nullable', 'date'],
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

        $order = Order::create($validated);

        // If order marked as paid immediately and has client_id, record in client payments ledger
        if ($validated['status'] === 'paid' && !empty($validated['client_id'])) {
            ClientPayment::create([
                'client_id' => $validated['client_id'],
                'order_id' => $order->id,
                'amount' => $validated['amount'],
                'currency' => 'BDT',
                'payment_method' => $validated['payment_method'] ?? 'bKash',
                'transaction_id' => $order->transaction_id,
                'notes' => 'Settled on invoice creation',
                'payment_date' => now()->toDateString(),
            ]);
        }

        return back()->with('success', 'Order and project created successfully.');
    }

    public function update(Request $request, Order $order): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['sometimes', 'in:pending,paid,processing,completed,cancelled,failed,refunded'],
            'progress' => ['sometimes', 'integer', 'min:0', 'max:100'],
            'project_name' => ['sometimes', 'nullable', 'string', 'max:180'],
            'amount' => ['sometimes', 'numeric', 'min:0'],
            'payment_method' => ['sometimes', 'nullable', 'string'],
            'delivery_date' => ['sometimes', 'nullable', 'date'],
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

        // If status changed to paid and order has client_id, record payment if not already logged
        if (isset($validated['status']) && $validated['status'] === 'paid' && $order->client_id) {
            $hasPayment = ClientPayment::where('order_id', $order->id)->exists();
            if (!$hasPayment) {
                ClientPayment::create([
                    'client_id' => $order->client_id,
                    'order_id' => $order->id,
                    'amount' => $order->amount,
                    'currency' => 'BDT',
                    'payment_method' => $order->payment_method ?? 'bKash',
                    'transaction_id' => $order->transaction_id,
                    'notes' => 'Marked as paid by admin',
                    'payment_date' => now()->toDateString(),
                ]);
            }
        }

        return back()->with('success', 'Order updated successfully.');
    }

    public function destroy(Order $order): RedirectResponse
    {
        // Clean up linked payments if any
        ClientPayment::where('order_id', $order->id)->delete();
        $order->delete();
        return back()->with('success', 'Order deleted successfully.');
    }
}
