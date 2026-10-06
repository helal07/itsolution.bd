<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use App\Models\Client;
use App\Models\ClientPayment;
use App\Models\Item;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    /**
     * Show Checkout Page for an item
     */
    public function checkout(Item $item): Response|RedirectResponse
    {
        if (! $item->is_purchasable || $item->status !== 'published') {
            return redirect()->route('home')->with('error', 'This item is not currently available for direct purchase. Please request a quote.');
        }

        $item->load('category');

        return Inertia::render('Public/Checkout', [
            'item' => $item,
        ]);
    }

    /**
     * Store new order with server-verified price
     */
    public function store(StoreOrderRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $item = Item::findOrFail($validated['item_id']);

        if (! $item->is_purchasable || $item->status !== 'published') {
            return back()->with('error', 'Item is not available for purchase.');
        }

        // Server-recomputed amount — never trust client input
        $amount = $item->price ?? 0.00;
        $transactionId = 'TXN-' . strtoupper(Str::random(10));
        $user = $request->user();

        // Ensure user is registered as a CRM Client
        $client = Client::firstOrCreate(
            ['email' => $user->email],
            [
                'name' => $user->name,
                'phone' => $user->phone,
                'contact_person' => $user->name,
                'status' => 'active',
            ]
        );

        $order = Order::create([
            'user_id' => $user->id,
            'client_id' => $client->id,
            'item_id' => $item->id,
            'amount' => $amount,
            'currency' => 'BDT',
            'status' => 'paid',
            'payment_method' => $validated['payment_method'],
            'transaction_id' => $transactionId,
        ]);

        return redirect()->route('profile.edit')->with('success', "Order #{$order->id} placed successfully! Transaction ID: {$transactionId}");
    }

    /**
     * Customer submits manual payment proof (TrxID) for pending invoice.
     * Requires Admin approval before balance is deducted.
     */
    public function payPending(Request $request, Order $order): RedirectResponse
    {
        $user = $request->user();

        $isAuthorized = ($order->user_id === $user->id) 
            || ($order->client && strtolower($order->client->email) === strtolower($user->email));

        if (! $isAuthorized) {
            abort(403, 'Unauthorized access to this order.');
        }

        $validated = $request->validate([
            'amount' => ['required', 'numeric', 'min:1'],
            'payment_method' => ['required', 'string', 'max:50'],
            'transaction_id' => ['required', 'string', 'max:150'],
            'sender_number' => ['nullable', 'string', 'max:50'],
            'notes' => ['nullable', 'string', 'max:500'],
        ], [
            'transaction_id.required' => 'Please provide the Transaction ID (TrxID) from your payment receipt.',
        ]);

        $amount = (float) $validated['amount'];

        // Ensure order has a valid client_id linked
        if (empty($order->client_id)) {
            $client = Client::firstOrCreate(
                ['email' => $user->email],
                [
                    'name' => $user->name,
                    'phone' => $user->phone,
                    'contact_person' => $user->name,
                    'status' => 'active',
                ]
            );
            $order->client_id = $client->id;
            $order->save();
        }

        $txn = trim($validated['transaction_id']);

        // Check if there is already an existing pending submission with this exact TrxID
        $existing = ClientPayment::where('order_id', $order->id)
            ->where('transaction_id', $txn)
            ->where('status', 'pending')
            ->first();

        if ($existing) {
            return redirect()->route('profile.edit', ['tab' => 'payment'])
                ->with('error', "A payment verification with TrxID '{$txn}' is already pending admin review.");
        }

        // Record as PENDING verification in client_payments ledger
        ClientPayment::create([
            'client_id' => $order->client_id,
            'order_id' => $order->id,
            'amount' => $amount,
            'currency' => $order->currency ?? 'BDT',
            'payment_method' => $validated['payment_method'],
            'status' => 'pending',
            'payment_type' => 'manual',
            'transaction_id' => $txn,
            'sender_number' => !empty($validated['sender_number']) ? trim($validated['sender_number']) : null,
            'notes' => $validated['notes'] ?? ('Manual payment verification submission for Invoice #' . $order->id),
            'payment_date' => now()->toDateString(),
        ]);

        $msg = "পেমেন্ট তথ্য (৳" . number_format($amount, 2) . " BDT, TrxID: {$txn}) সফলভাবে জমা হয়েছে! অ্যাডমিন ভেরিফাই এবং অ্যাপ্রুভ করার সাথে সাথে আপনার ইনভয়েস ব্যালেন্স আপডেট হবে।";

        return redirect()->route('profile.edit', ['tab' => 'payment'])->with('success', $msg);
    }

    /**
     * Initiate automated bKash Merchant Payment Gateway checkout
     */
    public function initiateBkash(Request $request, Order $order, \App\Services\BkashPGWService $bkashService)
    {
        $user = $request->user();

        $isAuthorized = ($order->user_id === $user->id) 
            || ($order->client && strtolower($order->client->email) === strtolower($user->email));

        if (! $isAuthorized) {
            abort(403, 'Unauthorized access to this order.');
        }

        if (! $bkashService->isConfigured()) {
            return redirect()->route('profile.edit', ['tab' => 'payment'])
                ->with('error', 'bKash Merchant Gateway credentials have not been configured yet in Admin Settings. Please use Manual bKash/Nagad/Bank payment with TrxID.');
        }

        $validated = $request->validate([
            'amount' => ['required', 'numeric', 'min:1'],
        ]);

        $amount = (float) $validated['amount'];
        $callbackUrl = route('payment.bkash.callback', ['order' => $order->id]);
        $invoiceNumber = 'INV-' . $order->id . '-' . time();
        $payerRef = $user->phone ?? ($order->client->phone ?? 'Client' . $order->id);

        $result = $bkashService->createPayment($amount, $invoiceNumber, $callbackUrl, $payerRef);

        if (! $result['success']) {
            return redirect()->route('profile.edit', ['tab' => 'payment'])
                ->with('error', 'bKash Gateway Error: ' . ($result['message'] ?? 'Could not initiate payment session.'));
        }

        // Store payment session details
        session([
            'bkash_payment_order_id' => $order->id,
            'bkash_payment_id' => $result['paymentID'],
            'bkash_payment_amount' => $amount,
        ]);

        // When redirecting externally via Inertia, use Inertia::location
        return Inertia::location($result['bkashURL']);
    }

    /**
     * Handle bKash Gateway Callback
     */
    public function bkashCallback(Request $request, \App\Services\BkashPGWService $bkashService): RedirectResponse
    {
        $paymentId = $request->query('paymentID') ?? session('bkash_payment_id');
        $status = strtolower($request->query('status', ''));
        $orderId = $request->query('order') ?? session('bkash_payment_order_id');

        if ($status !== 'success' || empty($paymentId)) {
            $msg = $status === 'cancel' 
                ? 'bKash payment was cancelled by user.' 
                : 'bKash payment failed or was aborted.';
            return redirect()->route('profile.edit', ['tab' => 'payment'])->with('error', $msg);
        }

        $order = Order::find($orderId);
        if (! $order) {
            return redirect()->route('profile.edit', ['tab' => 'payment'])->with('error', 'Order not found for payment callback.');
        }

        $execResult = $bkashService->executePayment($paymentId);

        if (! $execResult['success']) {
            return redirect()->route('profile.edit', ['tab' => 'payment'])
                ->with('error', 'bKash Execution Error: ' . ($execResult['message'] ?? 'Verification failed with bKash server.'));
        }

        $paidAmount = (float) ($execResult['amount'] ?? session('bkash_payment_amount', 0));
        $trxId = $execResult['trxID'] ?? $paymentId;
        $msisdn = $execResult['customerMsisdn'] ?? null;

        // Ensure order has a valid client_id linked
        if (empty($order->client_id) && $order->user) {
            $client = Client::firstOrCreate(
                ['email' => $order->user->email],
                [
                    'name' => $order->user->name,
                    'phone' => $order->user->phone,
                    'contact_person' => $order->user->name,
                    'status' => 'active',
                ]
            );
            $order->client_id = $client->id;
        }

        // Automated Gateway payment is instantly APPROVED
        ClientPayment::create([
            'client_id' => $order->client_id,
            'order_id' => $order->id,
            'amount' => $paidAmount,
            'currency' => 'BDT',
            'payment_method' => 'bKash Gateway',
            'status' => 'approved',
            'payment_type' => 'gateway',
            'transaction_id' => $trxId,
            'sender_number' => $msisdn,
            'notes' => 'Automated payment via bKash Merchant Gateway (Payment ID: ' . $paymentId . ')',
            'approved_at' => now(),
            'payment_date' => now()->toDateString(),
        ]);

        // Auto credit order amount and sync status
        $order->paid_amount = (float) ($order->paid_amount ?? 0) + $paidAmount;
        $order->payment_method = 'bKash';
        if (empty($order->transaction_id)) {
            $order->transaction_id = $trxId;
        }
        $order->save();
        $order->syncPaymentStatus();

        if ($order->due_amount <= 0 && $order->status === 'pending') {
            $order->status = 'paid';
            $order->save();
        }

        // Clear session keys
        session()->forget(['bkash_payment_order_id', 'bkash_payment_id', 'bkash_payment_amount']);

        $successMsg = "bKash পেমেন্ট সফল হয়েছে! ৳" . number_format($paidAmount, 2) . " BDT আপনার ইনভয়েসে যোগ করা হয়েছে। (TrxID: {$trxId})";

        return redirect()->route('profile.edit', ['tab' => 'payment'])->with('success', $successMsg);
    }

    /**
     * Client Dashboard & Order History redirects to unified Profile Hub
     */
    public function dashboard(Request $request): RedirectResponse
    {
        return redirect()->route('profile.edit');
    }
}
