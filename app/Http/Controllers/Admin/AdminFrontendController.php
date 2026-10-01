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
            'hero_headline_bn' => SiteSetting::get('hero_headline_bn', 'আমরা তৈরি করি বিশ্বমানের মোবাইল অ্যাপস, ওয়েবসাইট ও এন্টারপ্রাইজ সফটওয়্যার'),
            'hero_subheadline' => SiteSetting::get('hero_subheadline', 'Empowering ambitious businesses with high-impact digital solutions, custom software architecture, and modern mobile experiences.'),
            'hero_subheadline_bn' => SiteSetting::get('hero_subheadline_bn', 'আধুনিক প্রযুক্তি, কাস্টম সফটওয়্যার আর্কিটেকচার এবং স্মার্ট মোবাইল অ্যাপসের মাধ্যমে আপনার ব্যবসার ডিজিটাল রূপান্তর নিশ্চিত করুন।'),
            'hero_badge' => SiteSetting::get('hero_badge', 'PREMIUM IT SOLUTIONS, APPS & WEB ENGINEERING'),
            'hero_badge_bn' => SiteSetting::get('hero_badge_bn', 'প্রিমিয়াম আইটি সলিউশন, অ্যাপস ও ওয়েব ইঞ্জিনিয়ারিং'),
            'hero_image_1' => SiteSetting::get('hero_image_1', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&auto=format&fit=crop&q=80'),
            'hero_image_2' => SiteSetting::get('hero_image_2', 'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=800&auto=format&fit=crop&q=80'),
            'hero_image_1_tag' => SiteSetting::get('hero_image_1_tag', 'Enterprise Cloud & Web Apps'),
            'hero_image_1_tag_bn' => SiteSetting::get('hero_image_1_tag_bn', 'এন্টারপ্রাইজ ক্লাউড ও ওয়েব অ্যাপস'),
            'hero_image_2_tag' => SiteSetting::get('hero_image_2_tag', 'Mobile & High Scale Systems'),
            'hero_image_2_tag_bn' => SiteSetting::get('hero_image_2_tag_bn', 'মোবাইল ও হাই-স্কেল সিস্টেম'),
        ];

        return Inertia::render('Admin/Frontend/HeroBanner', [
            'settings' => $heroSettings,
        ]);
    }

    public function updateHero(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'hero_headline' => 'nullable|string|max:255',
            'hero_headline_bn' => 'nullable|string|max:255',
            'hero_subheadline' => 'nullable|string|max:1000',
            'hero_subheadline_bn' => 'nullable|string|max:1000',
            'hero_badge' => 'nullable|string|max:150',
            'hero_badge_bn' => 'nullable|string|max:150',
            'hero_image_1' => 'nullable|string|max:2000',
            'hero_image_1_file' => 'nullable|image|max:8192',
            'hero_image_2' => 'nullable|string|max:2000',
            'hero_image_2_file' => 'nullable|image|max:8192',
            'hero_image_1_tag' => 'nullable|string|max:100',
            'hero_image_1_tag_bn' => 'nullable|string|max:100',
            'hero_image_2_tag' => 'nullable|string|max:100',
            'hero_image_2_tag_bn' => 'nullable|string|max:100',
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
            'hero_stat1_label_bn' => SiteSetting::get('hero_stat1_label_bn', 'সফল প্রজেক্ট ডেলিভারি'),
            'hero_stat2_value' => SiteSetting::get('hero_stat2_value', '99.9%'),
            'hero_stat2_label' => SiteSetting::get('hero_stat2_label', 'Uptime Guarantee'),
            'hero_stat2_label_bn' => SiteSetting::get('hero_stat2_label_bn', 'আপটাইম গ্যারান্টি'),
            'hero_stat3_value' => SiteSetting::get('hero_stat3_value', '5.0 ★'),
            'hero_stat3_label' => SiteSetting::get('hero_stat3_label', 'Client Rating'),
            'hero_stat3_label_bn' => SiteSetting::get('hero_stat3_label_bn', 'ক্লায়েন্ট রেটিং'),
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
            'hero_stat1_label_bn' => 'nullable|string|max:100',
            'hero_stat2_value' => 'nullable|string|max:50',
            'hero_stat2_label' => 'nullable|string|max:100',
            'hero_stat2_label_bn' => 'nullable|string|max:100',
            'hero_stat3_value' => 'nullable|string|max:50',
            'hero_stat3_label' => 'nullable|string|max:100',
            'hero_stat3_label_bn' => 'nullable|string|max:100',
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
