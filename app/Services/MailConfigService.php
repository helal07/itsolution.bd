<?php

namespace App\Services;

use App\Mail\ClientAccountCreatedMail;
use App\Models\Order;
use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class MailConfigService
{
    /**
     * Dynamically inject SMTP configurations stored in SiteSetting into Laravel Mailer.
     */
    public static function applySettings(array $overrides = []): bool
    {
        $enabled = $overrides['mail_enabled'] ?? SiteSetting::get('mail_enabled', '0');
        if ($enabled !== '1') {
            return false;
        }

        $host = !empty($overrides['mail_host']) ? $overrides['mail_host'] : SiteSetting::get('mail_host');
        if (empty($host)) {
            return false;
        }

        $port = (int) (!empty($overrides['mail_port']) ? $overrides['mail_port'] : SiteSetting::get('mail_port', 587));
        $username = !empty($overrides['mail_username']) ? $overrides['mail_username'] : SiteSetting::get('mail_username');
        $password = !empty($overrides['mail_password']) ? $overrides['mail_password'] : SiteSetting::get('mail_password');
        $encryption = !empty($overrides['mail_encryption']) ? $overrides['mail_encryption'] : SiteSetting::get('mail_encryption', 'tls'); // tls, ssl, none
        $fromAddress = !empty($overrides['mail_from_address']) ? $overrides['mail_from_address'] : SiteSetting::get('mail_from_address', SiteSetting::get('contact_email', 'noreply@itsolution.bd'));
        $fromName = !empty($overrides['mail_from_name']) ? $overrides['mail_from_name'] : SiteSetting::get('mail_from_name', SiteSetting::get('site_name', config('app.name', 'IT Solution')));

        Config::set('mail.default', 'smtp');
        Config::set('mail.mailers.smtp.transport', 'smtp');
        Config::set('mail.mailers.smtp.host', $host);
        Config::set('mail.mailers.smtp.port', $port);
        Config::set('mail.mailers.smtp.username', $username);
        Config::set('mail.mailers.smtp.password', $password);
        Config::set('mail.mailers.smtp.scheme', $encryption === 'ssl' ? 'smtps' : null);
        Config::set('mail.mailers.smtp.encryption', $encryption === 'none' ? null : $encryption);
        Config::set('mail.from.address', $fromAddress);
        Config::set('mail.from.name', $fromName);

        Mail::purge('smtp');

        return true;
    }

    /**
     * Send account credentials & work order details to client.
     */
    public static function sendClientAccountNotification(User $user, string $plainPassword, ?Order $order = null): array
    {
        $configured = self::applySettings();
        if (!$configured) {
            return [
                'success' => false,
                'message' => 'SMTP Email Gateway is currently disabled or not fully configured in Settings.',
            ];
        }

        if (empty($user->email)) {
            return [
                'success' => false,
                'message' => 'Client user does not have a valid email address.',
            ];
        }

        try {
            Mail::to($user->email)->send(new ClientAccountCreatedMail($user, $plainPassword, $order));

            return [
                'success' => true,
                'message' => "Account details emailed to {$user->email} successfully.",
            ];
        } catch (\Throwable $e) {
            Log::error('SMTP Client Notification Error: ' . $e->getMessage(), [
                'user_id' => $user->id,
                'email' => $user->email,
            ]);

            return [
                'success' => false,
                'message' => 'Failed to send email: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Test SMTP configuration by sending a verification ping email.
     */
    public static function sendTestEmail(string $recipientEmail, array $overrides = []): array
    {
        $configured = self::applySettings($overrides);
        if (!$configured) {
            return [
                'success' => false,
                'message' => 'Please provide a valid Mail Host, Port, and Username first.',
            ];
        }

        try {
            $siteName = SiteSetting::get('site_name', config('app.name', 'IT Solution'));
            Mail::raw("This is a test email sent from {$siteName} to verify that your SMTP Email Gateway configuration is active and working properly.", function ($message) use ($recipientEmail, $siteName) {
                $message->to($recipientEmail)
                        ->subject("SMTP Gateway Connection Test - {$siteName}");
            });

            return [
                'success' => true,
                'message' => "Test email delivered successfully to {$recipientEmail}!",
            ];
        } catch (\Throwable $e) {
            Log::error('SMTP Test Email Error: ' . $e->getMessage());

            return [
                'success' => false,
                'message' => 'SMTP Connection Error: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Send official Quotation & Work Order Proposal to client email.
     */
    public static function sendQuoteProposal(\App\Models\Quote $quote): array
    {
        $configured = self::applySettings();
        if (!$configured) {
            return [
                'success' => false,
                'message' => 'SMTP Email Gateway is currently disabled or not configured in Settings.',
            ];
        }

        if (empty($quote->email)) {
            return [
                'success' => false,
                'message' => 'Quotation does not have a valid recipient email address.',
            ];
        }

        try {
            Mail::to($quote->email)->send(new \App\Mail\QuoteProposalMail($quote));

            return [
                'success' => true,
                'message' => "Quotation proposal #{$quote->quote_number} emailed to {$quote->email} successfully.",
            ];
        } catch (\Throwable $e) {
            Log::error('SMTP Quote Proposal Email Error: ' . $e->getMessage(), [
                'quote_id' => $quote->id,
                'email' => $quote->email,
            ]);

            return [
                'success' => false,
                'message' => 'Failed to send proposal email: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Send client directive / requirement / attachment notification to assigned team members and admin.
     */
    public static function sendClientDirectiveNotification(
        Order $order,
        \App\Models\OrderRequirement $requirement,
        ?\App\Models\OrderAttachment $attachment = null,
        ?User $uploader = null,
        string $type = 'New Requirement / Directive'
    ): array {
        $configured = self::applySettings();
        if (!$configured) {
            return [
                'success' => false,
                'message' => 'SMTP gateway is not enabled.',
            ];
        }

        // Collect all assigned employee emails
        $assignedEmployees = \App\Models\Employee::whereHas('tasks', function ($q) use ($order) {
            $q->where('order_id', $order->id);
        })->orWhereHas('taskSteps', function ($q) use ($order) {
            $q->whereHas('task', fn($tq) => $tq->where('order_id', $order->id));
        })->whereNotNull('email')->get();

        $recipients = $assignedEmployees->pluck('email')->filter()->unique()->toArray();

        // Also add admin/contact email
        $contactEmail = SiteSetting::get('contact_email');
        if ($contactEmail && filter_var($contactEmail, FILTER_VALIDATE_EMAIL)) {
            $recipients[] = $contactEmail;
        }

        // Fallback to admin user if no recipients
        if (empty($recipients)) {
            $adminUser = User::where('role', 'admin')->first();
            if ($adminUser && $adminUser->email) {
                $recipients[] = $adminUser->email;
            }
        }

        $recipients = array_unique(array_filter($recipients));
        if (empty($recipients)) {
            return [
                'success' => false,
                'message' => 'No active recipient found for notification.',
            ];
        }

        try {
            Mail::to($recipients)->send(new \App\Mail\ClientDirectiveNotificationMail(
                order: $order,
                requirement: $requirement,
                attachment: $attachment,
                uploader: $uploader,
                type: $type
            ));

            return [
                'success' => true,
                'message' => 'Notification dispatched to team members.',
                'recipients' => $recipients,
            ];
        } catch (\Throwable $e) {
            Log::error('SMTP Client Directive Notification Error: ' . $e->getMessage(), [
                'order_id' => $order->id,
                'requirement_id' => $requirement->id,
            ]);

            return [
                'success' => false,
                'message' => 'Failed to send notification: ' . $e->getMessage(),
            ];
        }
    }
}
