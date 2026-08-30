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

            // Hero Banner
            'hero_headline' => SiteSetting::get('hero_headline', 'We Build World-Class Apps, Websites & Enterprise Software'),
            'hero_subheadline' => SiteSetting::get('hero_subheadline', 'Empowering ambitious businesses with high-impact digital solutions, custom software architecture, and modern mobile experiences.'),
            'hero_badge' => SiteSetting::get('hero_badge', 'PREMIUM IT SOLUTIONS, APPS & WEB ENGINEERING'),
            'hero_image_1' => SiteSetting::get('hero_image_1', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&auto=format&fit=crop&q=80'),
            'hero_image_2' => SiteSetting::get('hero_image_2', 'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=800&auto=format&fit=crop&q=80'),
            'hero_image_1_tag' => SiteSetting::get('hero_image_1_tag', 'Enterprise Cloud & Web Apps'),
            'hero_image_2_tag' => SiteSetting::get('hero_image_2_tag', 'Mobile & High Scale Systems'),
            
            // Metrics & Stats
            'hero_stat1_value' => SiteSetting::get('hero_stat1_value', '100+'),
            'hero_stat1_label' => SiteSetting::get('hero_stat1_label', 'Projects Delivered'),
            'hero_stat2_value' => SiteSetting::get('hero_stat2_value', '99.9%'),
            'hero_stat2_label' => SiteSetting::get('hero_stat2_label', 'Uptime Guarantee'),
            'hero_stat3_value' => SiteSetting::get('hero_stat3_value', '5.0 ★'),
            'hero_stat3_label' => SiteSetting::get('hero_stat3_label', 'Client Rating'),

            // Social
            'facebook_url' => SiteSetting::get('facebook_url', 'https://facebook.com'),
            'linkedin_url' => SiteSetting::get('linkedin_url', 'https://linkedin.com'),
            'github_url' => SiteSetting::get('github_url', 'https://github.com'),
            'youtube_url' => SiteSetting::get('youtube_url', 'https://youtube.com'),
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

            // Hero
            'hero_headline' => 'nullable|string|max:255',
            'hero_subheadline' => 'nullable|string|max:1000',
            'hero_badge' => 'nullable|string|max:150',
            'hero_image_1' => 'nullable|string|max:2000',
            'hero_image_1_file' => 'nullable|image|max:8192',
            'hero_image_2' => 'nullable|string|max:2000',
            'hero_image_2_file' => 'nullable|image|max:8192',
            'hero_image_1_tag' => 'nullable|string|max:100',
            'hero_image_2_tag' => 'nullable|string|max:100',

            // Stats
            'hero_stat1_value' => 'nullable|string|max:50',
            'hero_stat1_label' => 'nullable|string|max:100',
            'hero_stat2_value' => 'nullable|string|max:50',
            'hero_stat2_label' => 'nullable|string|max:100',
            'hero_stat3_value' => 'nullable|string|max:50',
            'hero_stat3_label' => 'nullable|string|max:100',

            // Social
            'facebook_url' => 'nullable|string|max:255',
            'linkedin_url' => 'nullable|string|max:255',
            'github_url' => 'nullable|string|max:255',
            'youtube_url' => 'nullable|string|max:255',
        ]);

        if ($request->hasFile('site_logo_file')) {
            $path = $request->file('site_logo_file')->store('settings', 'public');
            $validated['site_logo'] = '/storage/' . $path;
        }

        if ($request->hasFile('site_favicon_file')) {
            $path = $request->file('site_favicon_file')->store('settings', 'public');
            $validated['site_favicon'] = '/storage/' . $path;
        }

        if ($request->hasFile('hero_image_1_file')) {
            $path = $request->file('hero_image_1_file')->store('settings', 'public');
            $validated['hero_image_1'] = '/storage/' . $path;
        }

        if ($request->hasFile('hero_image_2_file')) {
            $path = $request->file('hero_image_2_file')->store('settings', 'public');
            $validated['hero_image_2'] = '/storage/' . $path;
        }

        unset(
            $validated['site_logo_file'], 
            $validated['site_favicon_file'],
            $validated['hero_image_1_file'],
            $validated['hero_image_2_file']
        );

        foreach ($validated as $key => $value) {
            SiteSetting::set($key, $value);
        }

        return back()->with('success', 'Site settings updated successfully.');
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
