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
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AdminUserController extends Controller
{
    /**
     * List all registered website users with their full orders and CRM client status.
     */
    public function index(Request $request): Response
    {
        $search = $request->query('search');
        $statusFilter = $request->query('status'); // all, crm_client, new_user, with_orders

        $query = User::where('role', 'client')
            ->withCount('orders')
            ->with([
                'orders' => function ($q) {
                    $q->orderBy('id', 'desc')->with('item.category');
                },
                'reviews'
            ]);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        if ($statusFilter === 'with_orders') {
            $query->has('orders');
        }

        $users = $query->orderBy('id', 'desc')->paginate(20)->withQueryString();

        // Get matching clients from CRM by email
        $clientRecords = Client::whereIn('email', $users->pluck('email'))
            ->get()
            ->keyBy('email');

        // Enhance users data with is_client flag, client profile, and total spent
        $users->getCollection()->transform(function ($u) use ($clientRecords) {
            $matchedClient = $clientRecords->get($u->email);
            $u->is_client = $matchedClient !== null || $u->orders_count > 0;
            $u->client_profile = $matchedClient;
            $u->total_spent = $u->orders->where('status', 'paid')->sum('amount');
            return $u;
        });

        // If filtering by CRM status after collection transform
        if ($statusFilter === 'crm_client') {
            $users->setCollection($users->getCollection()->filter(fn($u) => $u->is_client)->values());
        } elseif ($statusFilter === 'new_user') {
            $users->setCollection($users->getCollection()->filter(fn($u) => !$u->is_client)->values());
        }

        $services = Item::where('status', 'published')->get(['id', 'name', 'price']);

        $stats = [
            'total_users' => User::where('role', 'client')->count(),
            'client_users' => User::where('role', 'client')->where(function($q) {
                $q->has('orders')->orWhereIn('email', Client::pluck('email'));
            })->count(),
            'users_with_orders' => User::where('role', 'client')->has('orders')->count(),
            'total_orders' => Order::count(),
        ];

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'services' => $services,
            'stats' => $stats,
            'filters' => [
                'search' => $search ?? '',
                'status' => $statusFilter ?? 'all',
            ],
        ]);
    }

    /**
     * Create a new website customer / user account.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'phone' => ['nullable', 'string', 'max:50'],
            'password' => ['required', 'string', 'min:8'],
            'make_client' => ['nullable', 'boolean'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'role' => 'client',
            'password' => Hash::make($validated['password']),
        ]);

        if (!empty($validated['make_client'])) {
            Client::firstOrCreate(
                ['email' => $user->email],
                [
                    'name' => $user->name,
                    'phone' => $user->phone,
                    'contact_person' => $user->name,
                    'status' => 'active',
                ]
            );
        }

        return back()->with('success', "User {$user->name} created successfully.");
    }

    /**
     * Create an order directly for a registered user, which automatically makes them a CRM Client!
     */
    public function storeOrder(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'item_id' => ['required', 'exists:items,id'],
            'project_name' => ['nullable', 'string', 'max:180'],
            'amount' => ['required', 'numeric', 'min:0'],
            'status' => ['required', 'in:pending,paid,processing,completed,cancelled,failed,refunded'],
            'progress' => ['nullable', 'integer', 'min:0', 'max:100'],
            'payment_method' => ['nullable', 'string', 'max:50'],
            'transaction_id' => ['nullable', 'string', 'max:150'],
            'delivery_date' => ['nullable', 'date'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        // 1. Automatically make or link this user as a CRM Client
        $client = Client::firstOrCreate(
            ['email' => $user->email],
            [
                'name' => $user->name,
                'phone' => $user->phone,
                'contact_person' => $user->name,
                'status' => 'active',
                'testimonial' => null,
            ]
        );

        $txnId = !empty($validated['transaction_id']) 
            ? $validated['transaction_id'] 
            : 'INV-' . strtoupper(Str::random(8));

        // 2. Create the Order linked to both User & Client
        $order = Order::create([
            'user_id' => $user->id,
            'client_id' => $client->id,
            'item_id' => $validated['item_id'],
            'project_name' => $validated['project_name'] ?? null,
            'amount' => $validated['amount'],
            'currency' => 'BDT',
            'status' => $validated['status'],
            'progress' => $validated['progress'] ?? ($validated['status'] === 'completed' ? 100 : 0),
            'payment_method' => $validated['payment_method'] ?? 'bKash/Nagad',
            'transaction_id' => $txnId,
            'delivery_date' => $validated['delivery_date'] ?? null,
            'notes' => $validated['notes'] ?? null,
        ]);

        // 3. Log initial payment if marked as paid
        if ($validated['status'] === 'paid') {
            ClientPayment::create([
                'client_id' => $client->id,
                'order_id' => $order->id,
                'amount' => $validated['amount'],
                'currency' => 'BDT',
                'payment_method' => $order->payment_method,
                'transaction_id' => $order->transaction_id,
                'notes' => 'Settled on order creation from User Management',
                'payment_date' => now()->toDateString(),
            ]);
        }

        return back()->with('success', "Order #{$order->id} created successfully! {$user->name} is now an active Client in your CRM.");
    }

    /**
     * Manually convert/register a website user to CRM Client without immediate order.
     */
    public function makeClient(User $user): RedirectResponse
    {
        $client = Client::firstOrCreate(
            ['email' => $user->email],
            [
                'name' => $user->name,
                'phone' => $user->phone,
                'contact_person' => $user->name,
                'status' => 'active',
            ]
        );

        // Update any unlinked past orders from this user to this client
        Order::where('user_id', $user->id)
            ->whereNull('client_id')
            ->update(['client_id' => $client->id]);

        return back()->with('success', "{$user->name} successfully added to CRM Clients.");
    }

    /**
     * Update user details.
     */
    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'phone' => ['nullable', 'string', 'max:50'],
            'role' => ['required', 'in:admin,client'],
            'password' => ['nullable', 'string', 'min:8'],
        ]);

        if (empty($validated['password'])) {
            unset($validated['password']);
        } else {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);

        // Also sync client name & phone if client exists
        Client::where('email', $user->email)->update([
            'name' => $user->name,
            'phone' => $user->phone,
            'contact_person' => $user->name,
        ]);

        return back()->with('success', "User {$user->name} updated successfully.");
    }

    /**
     * Delete a user.
     */
    public function destroy(Request $request, User $user): RedirectResponse
    {
        if ($request->user()->id === $user->id) {
            return back()->with('error', 'You cannot delete your own account while logged in.');
        }

        $userName = $user->name;
        $user->delete();

        return back()->with('success', "User {$userName} deleted successfully.");
    }
}
