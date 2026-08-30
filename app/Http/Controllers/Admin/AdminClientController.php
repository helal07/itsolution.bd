<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\AdminClientRequest;
use App\Models\Client;
use App\Models\ClientPayment;
use App\Models\Item;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AdminClientController extends Controller
{
    public function index(): Response
    {
        $clients = Client::withCount('portfolios')
            ->with(['orders.item', 'payments'])
            ->orderBy('sort_order', 'asc')
            ->orderBy('id', 'desc')
            ->paginate(15);

        $services = Item::where('status', 'published')->get(['id', 'name']);
        $users = User::all(['id', 'name', 'email']);

        return Inertia::render('Admin/Clients/Index', [
            'clients' => $clients,
            'services' => $services,
            'users' => $users,
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

    public function storeOrder(Request $request, Client $client): RedirectResponse
    {
        $validated = $request->validate([
            'item_id' => ['required', 'exists:items,id'],
            'amount' => ['required', 'numeric', 'min:1'],
            'status' => ['required', 'in:pending,paid'],
            'payment_method' => ['required', 'string'],
        ]);

        $defaultUser = User::first();

        $order = Order::create([
            'user_id' => $defaultUser ? $defaultUser->id : 1,
            'client_id' => $client->id,
            'item_id' => $validated['item_id'],
            'amount' => $validated['amount'],
            'currency' => 'BDT',
            'status' => $validated['status'],
            'payment_method' => $validated['payment_method'],
            'transaction_id' => 'INV-' . strtoupper(uniqid()),
        ]);

        // If marked paid on creation, also log the initial payment
        if ($validated['status'] === 'paid') {
            ClientPayment::create([
                'client_id' => $client->id,
                'order_id' => $order->id,
                'amount' => $validated['amount'],
                'currency' => 'BDT',
                'payment_method' => $validated['payment_method'],
                'transaction_id' => $order->transaction_id,
                'notes' => 'Settled upon order creation',
                'payment_date' => now()->toDateString(),
            ]);
        }

        return back()->with('success', 'Customer invoice created successfully.');
    }

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

        // If linked to specific order, or auto-settle oldest pending order
        if (!empty($validated['order_id'])) {
            Order::where('id', $validated['order_id'])->update(['status' => 'paid']);
        } else {
            $pendingOrder = Order::where('client_id', $client->id)->where('status', 'pending')->first();
            if ($pendingOrder) {
                $pendingOrder->update(['status' => 'paid']);
            }
        }

        return back()->with('success', 'Customer payment recorded successfully.');
    }
}
