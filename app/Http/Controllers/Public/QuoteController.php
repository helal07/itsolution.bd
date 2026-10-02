<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreQuoteRequest;
use App\Models\Category;
use App\Models\Item;
use App\Models\Quote;
use App\Models\SiteSetting;
use App\Services\QuoteOrderConversionService;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class QuoteController extends Controller
{
    /**
     * Show the dedicated Get a Quote page (/get-a-quote)
     */
    public function create(Request $request): Response
    {
        $selectedItemId = $request->query('item_id');

        $categories = Category::with(['publishedItems' => function ($q) {
            $q->select('id', 'category_id', 'name', 'slug', 'price');
        }])->orderBy('sort_order', 'asc')->get();

        return Inertia::render('Public/Quote', [
            'categories' => $categories,
            'selectedItemId' => $selectedItemId ? (int) $selectedItemId : null,
        ]);
    }

    /**
     * Handle quote submission from public inquiry form
     */
    public function store(StoreQuoteRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $validated['status'] = 'new';
        $validated['total_amount'] = $validated['estimated_budget'] ?? 0;

        $maxRetries = 3;
        for ($attempt = 1; $attempt <= $maxRetries; $attempt++) {
            try {
                Quote::create($validated);
                break;
            } catch (UniqueConstraintViolationException $e) {
                if ($attempt >= $maxRetries) {
                    throw $e;
                }
                unset($validated['quote_number']);
            }
        }

        return back()->with('success', 'Your quote request has been received! Our team will reach out to you within 24 business hours.');
    }

    /**
     * Public interactive view of the quotation & proposal
     */
    public function showPublic(string $token): Response
    {
        $quote = Quote::with('item')
            ->where('public_token', $token)
            ->firstOrFail();

        return Inertia::render('Public/QuoteView', [
            'quote' => $quote,
            'companyDetails' => [
                'name' => SiteSetting::get('site_name', config('app.name', 'IT Solution')),
                'logo' => SiteSetting::get('site_logo'),
                'email' => SiteSetting::get('contact_email', 'contact@itsolution.bd'),
                'phone' => SiteSetting::get('contact_phone', '+880 1800-000000'),
                'address' => SiteSetting::get('company_address', 'Dhaka, Bangladesh'),
            ],
        ]);
    }

    /**
     * Handle digital signature by client, converting quotation into an executed Work Order.
     */
    public function sign(Request $request, string $token): RedirectResponse
    {
        $quote = Quote::where('public_token', $token)->firstOrFail();

        $validated = $request->validate([
            'signer_name' => ['required', 'string', 'max:150'],
            'signature' => ['required', 'string'], // base64 canvas image data URL
            'terms_accepted' => ['required', 'accepted'],
        ]);

        $year = date('Y');
        $workOrderNumber = $quote->work_order_number ?: ('WO-' . $year . '-' . str_pad($quote->id, 4, '0', STR_PAD_LEFT));

        $updateData = [
            'client_signature' => $validated['signature'],
            'client_signer_name' => $validated['signer_name'],
            'client_signer_ip' => $request->ip(),
            'client_signed_at' => now(),
            'is_work_order' => true,
            'work_order_number' => $workOrderNumber,
            'status' => 'signed',
            // If company signature wasn't manually stamped yet, apply company authorized seal
            'company_signer_name' => $quote->company_signer_name ?: (SiteSetting::get('site_name', 'IT Solution') . ' Authorized Management'),
            'company_signed_at' => $quote->company_signer_at ?: now(),
        ];

        try {
            $quote->update($updateData);
        } catch (\Throwable $e) {
            $updateData['status'] = 'won';
            $quote->update($updateData);
        }

        // Automatic Pipeline: Convert Signed Quote to Order, CRM Client & Portal User
        $conversion = QuoteOrderConversionService::convert($quote, 'Client Signatory: ' . $validated['signer_name']);

        $msg = 'Work Order signed and accepted successfully! Both parties now hold a mutually binding digital contract.';
        if (!empty($conversion['newUserCreated'])) {
            $msg .= " A client portal account was created and your access credentials have been sent to {$quote->email}.";
        }

        return back()->with('success', $msg)->with('conversion', [
            'order_id' => $conversion['order']->id ?? null,
            'email' => $quote->email,
            'user_created' => $conversion['newUserCreated'] ?? false,
        ]);
    }
}
