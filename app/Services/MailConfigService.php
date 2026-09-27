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
}
