<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use App\Services\SmsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminSettingController extends Controller
{
    public function index(): Response
    {
        $settings = [
            // General / Brand
            'site_name' => SiteSetting::get('site_name', 'IT SOLUTIONS'),
            'site_tagline' => SiteSetting::get('site_tagline', 'Enterprise Software & Digital Engineering'),
            'site_logo' => SiteSetting::get('site_logo', ''),
            'site_favicon' => SiteSetting::get('site_favicon', ''),
            'contact_email' => SiteSetting::get('contact_email', 'contact@itsolutions.com'),
            'contact_phone' => SiteSetting::get('contact_phone', '+880 1800-000000'),
            'whatsapp_number' => SiteSetting::get('whatsapp_number', '+880 1800-000000'),
            'company_address' => SiteSetting::get('company_address', 'Dhaka, Bangladesh &bull; Tech District Suite 500'),
            'currency_symbol' => SiteSetting::get('currency_symbol', '৳'),
            'currency_code' => SiteSetting::get('currency_code', 'BDT'),

            // SMS Gateway
            'sms_enabled' => SiteSetting::get('sms_enabled', '0'),
            'sms_provider' => SiteSetting::get('sms_provider', 'greenweb'),
            'sms_api_key' => SiteSetting::get('sms_api_key', ''),
            'sms_api_secret' => SiteSetting::get('sms_api_secret', ''),
            'sms_sender_id' => SiteSetting::get('sms_sender_id', 'ITSOLUTIONS'),
            'sms_api_url' => SiteSetting::get('sms_api_url', ''),
            'sms_notify_order' => SiteSetting::get('sms_notify_order', '1'),
            'sms_notify_payment' => SiteSetting::get('sms_notify_payment', '1'),
            'sms_notify_progress' => SiteSetting::get('sms_notify_progress', '1'),

            // Payment Gateways (bKash, EPS, SSLCommerz, Manual)
            'payment_default_gateway' => SiteSetting::get('payment_default_gateway', 'bkash'),
            
            // bKash PGW
            'bkash_enabled' => SiteSetting::get('bkash_enabled', '1'),
            'bkash_mode' => SiteSetting::get('bkash_mode', 'sandbox'),
            'bkash_app_key' => SiteSetting::get('bkash_app_key', ''),
            'bkash_app_secret' => SiteSetting::get('bkash_app_secret', ''),
            'bkash_username' => SiteSetting::get('bkash_username', ''),
            'bkash_password' => SiteSetting::get('bkash_password', ''),
            'bkash_base_url' => SiteSetting::get('bkash_base_url', 'https://tokenized.sandbox.bka.sh/v1.2.0-beta'),

            // EPS (Easy Payment System)
            'eps_enabled' => SiteSetting::get('eps_enabled', '0'),
            'eps_mode' => SiteSetting::get('eps_mode', 'sandbox'),
            'eps_merchant_id' => SiteSetting::get('eps_merchant_id', ''),
            'eps_store_id' => SiteSetting::get('eps_store_id', ''),
            'eps_hash_key' => SiteSetting::get('eps_hash_key', ''),
            'eps_secret_key' => SiteSetting::get('eps_secret_key', ''),
            'eps_api_url' => SiteSetting::get('eps_api_url', 'https://sandbox.eps.com.bd'),

            // SSLCommerz
            'sslcommerz_enabled' => SiteSetting::get('sslcommerz_enabled', '0'),
            'sslcommerz_mode' => SiteSetting::get('sslcommerz_mode', 'sandbox'),
            'sslcommerz_store_id' => SiteSetting::get('sslcommerz_store_id', ''),
            'sslcommerz_store_passwd' => SiteSetting::get('sslcommerz_store_passwd', ''),
            'sslcommerz_api_url' => SiteSetting::get('sslcommerz_api_url', 'https://sandbox.sslcommerz.com'),

            // Manual / Offline Accounts
            'manual_bkash_number' => SiteSetting::get('manual_bkash_number', ''),
            'manual_nagad_number' => SiteSetting::get('manual_nagad_number', ''),
            'manual_rocket_number' => SiteSetting::get('manual_rocket_number', ''),
            'manual_bank_details' => SiteSetting::get('manual_bank_details', ''),
        ];

        return Inertia::render('Admin/Settings/Index', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            // General / Brand
            'site_name' => 'nullable|string|max:150',
            'site_tagline' => 'nullable|string|max:255',
            'site_logo' => 'nullable|string|max:2000',
            'site_logo_file' => 'nullable|image|max:4096',
            'site_favicon' => 'nullable|string|max:2000',
            'site_favicon_file' => 'nullable|image|max:2048',
            'contact_email' => 'nullable|email|max:150',
            'contact_phone' => 'nullable|string|max:100',
            'whatsapp_number' => 'nullable|string|max:100',
            'company_address' => 'nullable|string|max:255',
            'currency_symbol' => 'nullable|string|max:10',
            'currency_code' => 'nullable|string|max:10',

            // SMS Gateway
            'sms_enabled' => 'nullable|string|in:0,1',
            'sms_provider' => 'nullable|string|max:50',
            'sms_api_key' => 'nullable|string|max:255',
            'sms_api_secret' => 'nullable|string|max:255',
            'sms_sender_id' => 'nullable|string|max:100',
            'sms_api_url' => 'nullable|string|max:500',
            'sms_notify_order' => 'nullable|string|in:0,1',
            'sms_notify_payment' => 'nullable|string|in:0,1',
            'sms_notify_progress' => 'nullable|string|in:0,1',

            // Payment Gateways
            'payment_default_gateway' => 'nullable|string|max:50',

            // bKash
            'bkash_enabled' => 'nullable|string|in:0,1',
            'bkash_mode' => 'nullable|string|in:sandbox,live',
            'bkash_app_key' => 'nullable|string|max:255',
            'bkash_app_secret' => 'nullable|string|max:255',
            'bkash_username' => 'nullable|string|max:150',
            'bkash_password' => 'nullable|string|max:255',
            'bkash_base_url' => 'nullable|string|max:500',

            // EPS
            'eps_enabled' => 'nullable|string|in:0,1',
            'eps_mode' => 'nullable|string|in:sandbox,live',
            'eps_merchant_id' => 'nullable|string|max:150',
            'eps_store_id' => 'nullable|string|max:150',
            'eps_hash_key' => 'nullable|string|max:255',
            'eps_secret_key' => 'nullable|string|max:255',
            'eps_api_url' => 'nullable|string|max:500',

            // SSLCommerz
            'sslcommerz_enabled' => 'nullable|string|in:0,1',
            'sslcommerz_mode' => 'nullable|string|in:sandbox,live',
            'sslcommerz_store_id' => 'nullable|string|max:150',
            'sslcommerz_store_passwd' => 'nullable|string|max:255',
            'sslcommerz_api_url' => 'nullable|string|max:500',

            // Manual
            'manual_bkash_number' => 'nullable|string|max:150',
            'manual_nagad_number' => 'nullable|string|max:150',
            'manual_rocket_number' => 'nullable|string|max:150',
            'manual_bank_details' => 'nullable|string|max:1000',
        ]);

        if ($request->hasFile('site_logo_file')) {
            $path = $request->file('site_logo_file')->store('settings', 'public');
            $validated['site_logo'] = '/storage/' . $path;
        }

        if ($request->hasFile('site_favicon_file')) {
            $path = $request->file('site_favicon_file')->store('settings', 'public');
            $validated['site_favicon'] = '/storage/' . $path;
        }

        unset(
            $validated['site_logo_file'], 
            $validated['site_favicon_file']
        );

        foreach ($validated as $key => $value) {
            SiteSetting::set($key, $value);
        }

        return back()->with('success', 'Settings updated successfully.');
    }

    public function testSms(Request $request): RedirectResponse
    {
        $request->validate([
            'test_phone' => 'required|string|max:30',
            'test_message' => 'required|string|max:200',
        ]);

        $result = SmsService::send($request->test_phone, $request->test_message);

        if ($result['success']) {
            return back()->with('success', $result['message']);
        }

        return back()->with('error', $result['message']);
    }
}
