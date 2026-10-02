<?php

namespace App\Services;

use App\Models\Client;
use App\Models\Order;
use App\Models\OrderRequirement;
use App\Models\Quote;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class QuoteOrderConversionService
{
    /**
     * Convert an approved or digitally signed Quote into an official Order.
     * Automatically creates CRM Client, Portal User (with secure temp password),
     * and dispatches a credential email to the client.
     */
    public static function convert(Quote $quote, string $addedBy = 'System'): array
    {
        // 1. Check if Order already exists for this Quote
        $existingOrder = Order::where('quote_id', $quote->id)
            ->orWhere(function ($q) use ($quote) {
                $q->where('notes', 'like', '%Quotation #' . ($quote->quote_number ?: $quote->id) . '%');
            })
            ->first();

        if ($existingOrder) {
            // Ensure quote_id is linked if it wasn't before
            if (!$existingOrder->quote_id) {
                $existingOrder->update(['quote_id' => $quote->id]);
            }
            if ($quote->status !== 'won' && $quote->status !== 'signed') {
                $quote->update(['status' => 'won', 'is_work_order' => true]);
            }

            return [
                'order' => $existingOrder,
                'user' => $existingOrder->user,
                'client' => $existingOrder->client,
                'newUserCreated' => false,
                'plainPassword' => null,
                'emailSent' => false,
                'isExisting' => true,
            ];
        }

        // 2. Find or Create CRM Client record
        $client = null;
        if (!empty($quote->email)) {
            $client = Client::where('email', $quote->email)->first();
        }
        if (!$client && !empty($quote->phone)) {
            $client = Client::where('phone', $quote->phone)->first();
        }

        if (!$client) {
            $client = Client::create([
                'name' => $quote->company_name ?: ($quote->name ?: 'Client Organization'),
                'contact_person' => $quote->name,
                'email' => $quote->email,
                'phone' => $quote->phone,
                'status' => 'active',
                'source' => 'quotation_work_order',
                'notes' => 'Auto-converted from Quotation #' . ($quote->quote_number ?: $quote->id),
            ]);
        }

        // 3. Find or Create Client Portal User
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
            $plainPassword = 'ITS@' . rand(100000, 999999);
            $user = User::create([
                'name' => $quote->name ?: ($quote->company_name ?: 'Client User'),
                'email' => $quote->email ?: ('client_' . time() . '@itsolution.bd'),
                'phone' => $quote->phone,
                'password' => Hash::make($plainPassword),
                'role' => 'client',
            ]);
            $newUserCreated = true;

            if (class_exists(\Spatie\Permission\Models\Role::class) && \Spatie\Permission\Models\Role::where('name', 'Client')->exists()) {
                $user->assignRole('Client');
            }
        }

        // 4. Create the official Order
        $amount = (float) ($quote->total_amount ?: ($quote->estimated_budget ?: ($quote->item ? $quote->item->price : 5000)));
        $orderNotes = 'Converted from Quotation #' . ($quote->quote_number ?: $quote->id);
        if ($quote->is_work_order) {
            $orderNotes .= "\nOfficial Work Order #" . ($quote->work_order_number ?: $quote->id);
            if ($quote->client_signer_name) {
                $signedDate = $quote->client_signed_at ? $quote->client_signed_at->format('d M, Y') : now()->format('d M, Y');
                $orderNotes .= " (Signed by " . $quote->client_signer_name . " on " . $signedDate . ")";
            }
        }

        if ($newUserCreated && $plainPassword) {
            $orderNotes .= "\n[System] Auto-generated client portal credentials:\nEmail: " . $user->email . "\nTemp Password: " . $plainPassword;
        }

        $order = Order::create([
            'client_id' => $client->id,
            'user_id' => $user->id,
            'quote_id' => $quote->id,
            'item_id' => $quote->item_id,
            'project_name' => $quote->project_title ?: ($quote->item ? $quote->item->name : 'Project for ' . $client->name),
            'amount' => $amount,
            'discount' => (float) ($quote->discount ?? 0),
            'currency' => $quote->currency ?: 'BDT',
            'status' => 'pending',
            'progress' => 0,
            'payment_method' => 'bKash',
            'transaction_id' => 'INV-' . strtoupper(substr(uniqid(), -6)),
            'added_by' => $addedBy,
            'notes' => $orderNotes,
        ]);

        // 5. Create Initial OrderRequirements for each Phase
        if (!empty($quote->phases) && is_array($quote->phases)) {
            foreach ($quote->phases as $idx => $phase) {
                OrderRequirement::create([
                    'order_id' => $order->id,
                    'client_id' => $client->id,
                    'user_id' => $user->id,
                    'title' => ($idx + 1) . '. ' . ($phase['name'] ?? 'Phase Milestone'),
                    'description' => ($phase['description'] ?? '') . "\nRequired Time: " . ($phase['duration'] ?? 'N/A') . " | Phase Cost: ৳" . number_format($phase['cost'] ?? 0, 2),
                    'status' => 'submitted',
                ]);
            }
        } elseif (!empty($quote->message)) {
            OrderRequirement::create([
                'order_id' => $order->id,
                'client_id' => $client->id,
                'user_id' => $user->id,
                'title' => 'Initial Quotation Scope & Details',
                'description' => $quote->message,
                'status' => 'submitted',
            ]);
        }

        // 6. Update Quote status to won & is_work_order
        $quote->update([
            'status' => 'won',
            'is_work_order' => true,
        ]);

        // 7. Send notification email with credentials if user was newly created
        $emailSent = false;
        if ($newUserCreated && $plainPassword) {
            $emailResult = MailConfigService::sendClientAccountNotification($user, $plainPassword, $order);
            $emailSent = $emailResult['success'] ?? false;
        }

        return [
            'order' => $order,
            'user' => $user,
            'client' => $client,
            'newUserCreated' => $newUserCreated,
            'plainPassword' => $plainPassword,
            'emailSent' => $emailSent,
            'isExisting' => false,
        ];
    }
}
