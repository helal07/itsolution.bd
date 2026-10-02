<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\Item;
use App\Models\Order;
use App\Models\Quote;
use App\Models\SiteSetting;
use App\Models\User;
use App\Services\MailConfigService;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminQuoteController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->query('status');
        $search = $request->query('search');
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');
        $viewType = $request->query('view_type'); // 'work_orders' or null

        $query = Quote::with('item');

        if ($viewType === 'work_orders') {
            $query->where(function ($q) {
                $q->where('is_work_order', true)
                  ->orWhere('status', 'signed');
            });
        } elseif ($status && $status !== 'all') {
            $query->where('status', $status);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('company_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('quote_number', 'like', "%{$search}%")
                  ->orWhere('work_order_number', 'like', "%{$search}%")
                  ->orWhere('project_title', 'like', "%{$search}%");
            });
        }

        if ($startDate) {
            $query->whereDate('created_at', '>=', $startDate);
        }

        if ($endDate) {
            $query->whereDate('created_at', '<=', $endDate);
        }

        $quotes = $query->orderBy('created_at', 'desc')->paginate(20)->withQueryString();

        $items = Item::select('id', 'name', 'price')->orderBy('name')->get();

        // Metrics for summary cards
        $metrics = [
            'total_quotes' => Quote::count(),
            'work_orders_count' => Quote::where('is_work_order', true)->orWhere('status', 'signed')->count(),
            'pending_count' => Quote::whereIn('status', ['new', 'contacted', 'sent'])->count(),
            'won_count' => Quote::whereIn('status', ['won', 'signed'])->count(),
            'pipeline_value' => (float) Quote::sum('total_amount') ?: (float) Quote::sum('estimated_budget'),
        ];

        return Inertia::render('Admin/Quotes/Index', [
            'quotes' => $quotes,
            'items' => $items,
            'metrics' => $metrics,
            'currentStatus' => $status ?? 'all',
            'viewType' => $viewType ?? 'all',
            'search' => $search ?? '',
            'startDate' => $startDate ?? '',
            'endDate' => $endDate ?? '',
            'companyDetails' => [
                'name' => SiteSetting::get('site_name', config('app.name', 'IT Solution')),
                'logo' => SiteSetting::get('site_logo'),
                'email' => SiteSetting::get('contact_email', 'contact@itsolution.bd'),
                'phone' => SiteSetting::get('contact_phone', '+880 1800-000000'),
                'address' => SiteSetting::get('company_address', 'Level 8, Software Technology Park, Dhaka, Bangladesh'),
            ],
        ]);
    }

    public function create(): Response
    {
        $items = Item::select('id', 'name', 'price')->orderBy('name')->get();

        return Inertia::render('Admin/Quotes/Create', [
            'items' => $items,
            'companyDetails' => [
                'name' => SiteSetting::get('site_name', config('app.name', 'IT Solution')),
                'logo' => SiteSetting::get('site_logo'),
                'email' => SiteSetting::get('contact_email', 'contact@itsolution.bd'),
                'phone' => SiteSetting::get('contact_phone', '+880 1800-000000'),
                'address' => SiteSetting::get('company_address', 'Level 8, Software Technology Park, Dhaka, Bangladesh'),
            ],
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
            'project_title' => ['nullable', 'string', 'max:255'],
            'valid_until' => ['nullable', 'date'],
            'message' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
            'currency' => ['nullable', 'string', 'max:10'],
            'subtotal' => ['nullable', 'numeric', 'min:0'],
            'discount' => ['nullable', 'numeric', 'min:0'],
            'tax' => ['nullable', 'numeric', 'min:0'],
            'total_amount' => ['nullable', 'numeric', 'min:0'],
            'estimated_budget' => ['nullable', 'numeric', 'min:0'],
            'phases' => ['nullable', 'array'],
            'payment_terms' => ['nullable', 'array'],
            'terms_conditions' => ['nullable', 'string'],
            'status' => ['nullable', 'string'],
        ]);

        if (empty($validated['status'])) {
            $validated['status'] = 'new';
        }

        // Auto calculate subtotal from phases if phases exist and subtotal is empty
        if (!empty($validated['phases']) && empty($validated['subtotal'])) {
            $sub = 0;
            foreach ($validated['phases'] as $phase) {
                $sub += (float) ($phase['cost'] ?? 0);
            }
            $validated['subtotal'] = $sub;
        }

        $discount = (float) ($validated['discount'] ?? 0);
        $tax = (float) ($validated['tax'] ?? 0);
        $subtotal = (float) ($validated['subtotal'] ?? ($validated['estimated_budget'] ?? 0));

        if (empty($validated['total_amount'])) {
            $validated['total_amount'] = max(0, $subtotal - $discount + $tax);
        }

        if (empty($validated['estimated_budget'])) {
            $validated['estimated_budget'] = $validated['total_amount'];
        }

        $maxRetries = 3;
        $quote = null;
        for ($attempt = 1; $attempt <= $maxRetries; $attempt++) {
            try {
                $quote = Quote::create($validated);
                break;
            } catch (UniqueConstraintViolationException $e) {
                if ($attempt >= $maxRetries) {
                    throw $e;
                }
                unset($validated['quote_number']);
            }
        }

        return redirect()->route('admin.quotes.index')->with('success', "Quotation #{$quote->quote_number} generated successfully.");
    }

    public function update(Request $request, Quote $quote): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:150'],
            'company_name' => ['nullable', 'string', 'max:191'],
            'email' => ['sometimes', 'required', 'email', 'max:191'],
            'phone' => ['nullable', 'string', 'max:30'],
            'item_id' => ['nullable', 'exists:items,id'],
            'project_title' => ['nullable', 'string', 'max:255'],
            'valid_until' => ['nullable', 'date'],
            'message' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
            'currency' => ['nullable', 'string', 'max:10'],
            'subtotal' => ['nullable', 'numeric', 'min:0'],
            'discount' => ['nullable', 'numeric', 'min:0'],
            'tax' => ['nullable', 'numeric', 'min:0'],
            'total_amount' => ['nullable', 'numeric', 'min:0'],
            'estimated_budget' => ['nullable', 'numeric', 'min:0'],
            'phases' => ['nullable', 'array'],
            'payment_terms' => ['nullable', 'array'],
            'terms_conditions' => ['nullable', 'string'],
            'status' => ['nullable', 'string'],
            'is_work_order' => ['nullable', 'boolean'],
        ]);

        if (isset($validated['subtotal']) || isset($validated['discount']) || isset($validated['tax'])) {
            $subtotal = (float) ($validated['subtotal'] ?? $quote->subtotal);
            $discount = (float) ($validated['discount'] ?? $quote->discount);
            $tax = (float) ($validated['tax'] ?? $quote->tax);
            $validated['total_amount'] = max(0, $subtotal - $discount + $tax);
            $validated['estimated_budget'] = $validated['total_amount'];
        }

        $quote->update($validated);

        return back()->with('success', 'Quotation details updated successfully.');
    }

    /**
     * Dispatch Quotation proposal email to client via SMTP.
     */
    public function sendEmail(Request $request, Quote $quote): RedirectResponse
    {
        $result = MailConfigService::sendQuoteProposal($quote);

        if ($result['success']) {
            if ($quote->status === 'new') {
                try {
                    $quote->update(['status' => 'sent']);
                } catch (\Throwable $e) {
                    try {
                        $quote->update(['status' => 'contacted']);
                    } catch (\Throwable $ex) {
                        // ignore status update error so email success message is still delivered
                    }
                }
            }
            return back()->with('success', $result['message']);
        }

        return back()->with('error', $result['message']);
    }

    /**
     * Apply Company Authorized Signature/Seal.
     */
    public function signCompany(Request $request, Quote $quote): RedirectResponse
    {
        $validated = $request->validate([
            'company_signer_name' => ['required', 'string', 'max:150'],
            'company_signature' => ['nullable', 'string'],
        ]);

        $quote->update([
            'company_signer_name' => $validated['company_signer_name'],
            'company_signature' => $validated['company_signature'] ?? null,
            'company_signed_at' => now(),
        ]);

        return back()->with('success', 'Company seal & authorized signature applied to the document.');
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

        // 2. Find or create Client User Account
        $newUserCreated = false;
        $plainPassword = null;
        $user = null;

        if (!empty($quote->email)) {
            $user = User::where('email', $quote->email)->first();
        }
        if (!$user && !empty($quote->phone)) {
            $user = User::where('phone', $quote->phone)->first();
        }

        if (!$user) {
            // Generate temporary password
            $plainPassword = 'ITS@' . rand(100000, 999999);
            $user = User::create([
                'name' => $quote->name ?: ($quote->company_name ?: 'Client User'),
                'email' => $quote->email ?: ('client_' . time() . '@itsolution.bd'),
                'phone' => $quote->phone,
                'password' => \Illuminate\Support\Facades\Hash::make($plainPassword),
                'role' => 'client',
            ]);
            $newUserCreated = true;

            // Spatie role assignment if role exists
            if (class_exists(\Spatie\Permission\Models\Role::class) && \Spatie\Permission\Models\Role::where('name', 'Client')->exists()) {
                $user->assignRole('Client');
            }
        }

        // 3. Create Order
        $amount = (float) ($quote->total_amount ?: ($quote->estimated_budget ?: ($quote->item ? $quote->item->price : 5000)));
        $orderNotes = 'Converted from Quotation #' . ($quote->quote_number ?: $quote->id);
        if ($quote->is_work_order) {
            $orderNotes .= "\nOfficial Work Order #" . ($quote->work_order_number ?: $quote->id);
            if ($quote->client_signer_name) {
                $orderNotes .= " (Signed by " . $quote->client_signer_name . " on " . ($quote->client_signed_at ? $quote->client_signed_at->format('d M, Y') : 'N/A') . ")";
            }
        }

        if ($newUserCreated && $plainPassword) {
            $orderNotes .= "\n[System] Auto-generated client account:\nEmail: " . $user->email . "\nTemp Password: " . $plainPassword;
        }

        $order = Order::create([
            'client_id' => $client->id,
            'user_id' => $user->id,
            'item_id' => $quote->item_id,
            'project_name' => $quote->project_title ?: ($quote->item ? $quote->item->name : 'Project for ' . $client->name),
            'amount' => $amount,
            'currency' => $quote->currency ?: 'BDT',
            'status' => 'pending',
            'progress' => 0,
            'payment_method' => 'bKash',
            'transaction_id' => 'INV-' . strtoupper(substr(uniqid(), -6)),
            'added_by' => $request->user()->name ?? 'Admin',
            'notes' => $orderNotes,
        ]);

        // 4. Create Initial OrderRequirements for each Phase
        if (!empty($quote->phases) && is_array($quote->phases)) {
            foreach ($quote->phases as $idx => $phase) {
                \App\Models\OrderRequirement::create([
                    'order_id' => $order->id,
                    'client_id' => $client->id,
                    'user_id' => $user->id,
                    'title' => ($idx + 1) . '. ' . ($phase['name'] ?? 'Phase Milestone'),
                    'description' => ($phase['description'] ?? '') . "\nRequired Time: " . ($phase['duration'] ?? 'N/A') . " | Phase Cost: ৳" . number_format($phase['cost'] ?? 0, 2),
                    'status' => 'submitted',
                ]);
            }
        } elseif (!empty($quote->message)) {
            \App\Models\OrderRequirement::create([
                'order_id' => $order->id,
                'client_id' => $client->id,
                'user_id' => $user->id,
                'title' => 'Initial Quotation Scope & Details',
                'description' => $quote->message,
                'status' => 'submitted',
            ]);
        }

        // 5. Mark Quote Won & Work Order converted
        $quote->update([
            'status' => 'won',
            'is_work_order' => true,
        ]);

        $successMsg = 'Quotation converted to Order #' . $order->id . ' successfully!';
        if ($newUserCreated && $plainPassword) {
            $successMsg .= ' Client account created (Email: ' . $user->email . ' | Password: ' . $plainPassword . ').';

            // Send notification email via SMTP Gateway
            $emailResult = MailConfigService::sendClientAccountNotification($user, $plainPassword, $order);
            if ($emailResult['success']) {
                $successMsg .= ' [Email: Sent to client successfully]';
            }
        }

        return redirect()->route('admin.orders.index')->with('success', $successMsg);
    }

    public function destroy(Quote $quote): RedirectResponse
    {
        $quote->delete();

        return back()->with('success', 'Quotation deleted successfully.');
    }
}
