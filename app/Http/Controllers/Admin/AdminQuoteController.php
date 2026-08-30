<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\Item;
use App\Models\Order;
use App\Models\Quote;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminQuoteController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->query('status');
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');

        $query = Quote::with('item');

        if ($status && in_array($status, ['new', 'contacted', 'won', 'lost'])) {
            $query->where('status', $status);
        }

        if ($startDate) {
            $query->whereDate('created_at', '>=', $startDate);
        }

        if ($endDate) {
            $query->whereDate('created_at', '<=', $endDate);
        }

        $quotes = $query->orderBy('created_at', 'desc')->paginate(20)->withQueryString();

        $items = Item::select('id', 'name')->orderBy('name')->get();

        return Inertia::render('Admin/Quotes/Index', [
            'quotes' => $quotes,
            'items' => $items,
            'currentStatus' => $status ?? 'all',
            'startDate' => $startDate ?? '',
            'endDate' => $endDate ?? '',
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:150'],
            'company_name' => ['nullable', 'string', 'max:191'],
            'email' => ['required', 'email', 'max:191'],
            'phone' => ['nullable', 'string', 'max:30'],
            'item_id' => ['nullable', 'exists:items,id'],
            'message' => ['nullable', 'string'],
            'estimated_budget' => ['nullable', 'numeric', 'min:0'],
            'notes' => ['nullable', 'string'],
            'status' => ['nullable', 'in:new,contacted,won,lost'],
        ]);

        if (empty($validated['status'])) {
            $validated['status'] = 'new';
        }

        Quote::create($validated);

        return back()->with('success', 'Quotation request added successfully.');
    }

    public function update(Request $request, Quote $quote): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:150'],
            'company_name' => ['nullable', 'string', 'max:191'],
            'email' => ['sometimes', 'required', 'email', 'max:191'],
            'phone' => ['nullable', 'string', 'max:30'],
            'item_id' => ['nullable', 'exists:items,id'],
            'message' => ['nullable', 'string'],
            'estimated_budget' => ['nullable', 'numeric', 'min:0'],
            'notes' => ['nullable', 'string'],
            'status' => ['sometimes', 'required', 'in:new,contacted,won,lost'],
        ]);

        $quote->update($validated);

        return back()->with('success', 'Quotation updated successfully.');
    }

    public function convert(Request $request, Quote $quote): RedirectResponse
    {
        // 1. Find or create Client
        $client = null;
        if (!empty($quote->phone)) {
            $client = Client::where('phone', $quote->phone)->first();
        }
        if (!$client && !empty($quote->email)) {
            $client = Client::where('email', $quote->email)->first();
        }

        if (!$client) {
            $client = Client::create([
                'name' => $quote->company_name ?: $quote->name,
                'contact_person' => $quote->name,
                'email' => $quote->email,
                'phone' => $quote->phone,
                'rating' => 5,
                'is_active' => true,
            ]);
        }

        // 2. Create Order
        $amount = $quote->estimated_budget ?: ($quote->item ? $quote->item->price : 5000);
        $order = Order::create([
            'client_id' => $client->id,
            'user_id' => User::where('email', $quote->email)->value('id') ?? $request->user()->id,
            'item_id' => $quote->item_id,
            'project_name' => $quote->item ? $quote->item->name : 'Project for ' . $client->name,
            'amount' => $amount,
            'currency' => 'BDT',
            'status' => 'pending',
            'progress' => 0,
            'payment_method' => 'bKash',
            'transaction_id' => 'INV-' . strtoupper(substr(uniqid(), -6)),
            'added_by' => $request->user()->name ?? 'Admin',
            'notes' => 'Converted from Quotation #' . $quote->id . ($quote->message ? "\n\nInitial Inquiry: " . $quote->message : ''),
        ]);

        // 3. Mark Quote Won
        $quote->update(['status' => 'won']);

        return redirect()->route('admin.orders.index')->with('success', 'Quotation successfully converted to Order #' . $order->id);
    }

    public function destroy(Quote $quote): RedirectResponse
    {
        $quote->delete();

        return back()->with('success', 'Quotation deleted successfully.');
    }
}
