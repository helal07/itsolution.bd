<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminFrontendController extends Controller
{
    /**
     * Hero Banner Management
     */
    public function hero(): Response
    {
        $heroSettings = [
            'hero_headline' => SiteSetting::get('hero_headline', 'We Build World-Class Apps, Websites & Enterprise Software'),
            'hero_subheadline' => SiteSetting::get('hero_subheadline', 'Empowering ambitious businesses with high-impact digital solutions, custom software architecture, and modern mobile experiences.'),
            'hero_badge' => SiteSetting::get('hero_badge', 'PREMIUM IT SOLUTIONS, APPS & WEB ENGINEERING'),
            'hero_image_1' => SiteSetting::get('hero_image_1', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&auto=format&fit=crop&q=80'),
            'hero_image_2' => SiteSetting::get('hero_image_2', 'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=800&auto=format&fit=crop&q=80'),
            'hero_image_1_tag' => SiteSetting::get('hero_image_1_tag', 'Enterprise Cloud & Web Apps'),
            'hero_image_2_tag' => SiteSetting::get('hero_image_2_tag', 'Mobile & High Scale Systems'),
        ];

        return Inertia::render('Admin/Frontend/HeroBanner', [
            'settings' => $heroSettings,
        ]);
    }

    public function updateHero(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'hero_headline' => 'nullable|string|max:255',
            'hero_subheadline' => 'nullable|string|max:1000',
            'hero_badge' => 'nullable|string|max:150',
            'hero_image_1' => 'nullable|string|max:2000',
            'hero_image_1_file' => 'nullable|image|max:8192',
            'hero_image_2' => 'nullable|string|max:2000',
            'hero_image_2_file' => 'nullable|image|max:8192',
            'hero_image_1_tag' => 'nullable|string|max:100',
            'hero_image_2_tag' => 'nullable|string|max:100',
        ]);

        if ($request->hasFile('hero_image_1_file')) {
            $path = $request->file('hero_image_1_file')->store('settings', 'public');
            $validated['hero_image_1'] = '/storage/' . $path;
        }

        if ($request->hasFile('hero_image_2_file')) {
            $path = $request->file('hero_image_2_file')->store('settings', 'public');
            $validated['hero_image_2'] = '/storage/' . $path;
        }

        unset($validated['hero_image_1_file'], $validated['hero_image_2_file']);

        foreach ($validated as $key => $value) {
            SiteSetting::set($key, $value);
        }

        return back()->with('success', 'Home Hero Banner updated successfully.');
    }

    /**
     * Trust Matrix / Metrics Management
     */
    public function metrics(): Response
    {
        $metricsSettings = [
            'hero_stat1_value' => SiteSetting::get('hero_stat1_value', '100+'),
            'hero_stat1_label' => SiteSetting::get('hero_stat1_label', 'Projects Delivered'),
            'hero_stat2_value' => SiteSetting::get('hero_stat2_value', '99.9%'),
            'hero_stat2_label' => SiteSetting::get('hero_stat2_label', 'Uptime Guarantee'),
            'hero_stat3_value' => SiteSetting::get('hero_stat3_value', '5.0 ★'),
            'hero_stat3_label' => SiteSetting::get('hero_stat3_label', 'Client Rating'),
        ];

        return Inertia::render('Admin/Frontend/TrustMatrix', [
            'settings' => $metricsSettings,
        ]);
    }

    public function updateMetrics(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'hero_stat1_value' => 'nullable|string|max:50',
            'hero_stat1_label' => 'nullable|string|max:100',
            'hero_stat2_value' => 'nullable|string|max:50',
            'hero_stat2_label' => 'nullable|string|max:100',
            'hero_stat3_value' => 'nullable|string|max:50',
            'hero_stat3_label' => 'nullable|string|max:100',
        ]);

        foreach ($validated as $key => $value) {
            SiteSetting::set($key, $value);
        }

        return back()->with('success', 'Trust Matrix & Live Stats updated successfully.');
    }

    /**
     * Social Links Management
     */
    public function social(): Response
    {
        $socialSettings = [
            'facebook_url' => SiteSetting::get('facebook_url', 'https://facebook.com'),
            'linkedin_url' => SiteSetting::get('linkedin_url', 'https://linkedin.com'),
            'github_url' => SiteSetting::get('github_url', 'https://github.com'),
            'youtube_url' => SiteSetting::get('youtube_url', 'https://youtube.com'),
        ];

        return Inertia::render('Admin/Frontend/SocialLinks', [
            'settings' => $socialSettings,
        ]);
    }

    public function updateSocial(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'facebook_url' => 'nullable|string|max:255',
            'linkedin_url' => 'nullable|string|max:255',
            'github_url' => 'nullable|string|max:255',
            'youtube_url' => 'nullable|string|max:255',
        ]);

        foreach ($validated as $key => $value) {
            SiteSetting::set($key, $value);
        }

        return back()->with('success', 'Social Links & Channels updated successfully.');
    }
}
