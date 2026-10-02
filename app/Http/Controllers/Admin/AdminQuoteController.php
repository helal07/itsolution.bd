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
use App\Services\QuoteOrderConversionService;
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

        $query = Quote::with(['item', 'order']);

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
        $result = QuoteOrderConversionService::convert($quote, $request->user()->name ?? 'Admin');
        $order = $result['order'];

        $successMsg = 'Quotation converted to Order #' . $order->id . ' successfully!';
        if ($result['newUserCreated'] && $result['plainPassword']) {
            $successMsg .= ' Client account created (Email: ' . $result['user']->email . ' | Password: ' . $result['plainPassword'] . ').';
            if ($result['emailSent']) {
                $successMsg .= ' [Credentials emailed to client]';
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
