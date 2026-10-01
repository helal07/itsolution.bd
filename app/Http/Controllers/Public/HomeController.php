<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Item;
use App\Models\Portfolio;
use App\Models\Review;
use App\Models\SiteSetting;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(): Response
    {
        // Cache featured items for 1 hour
        $featuredItems = Cache::remember('home_featured_items', 3600, function () {
            return Item::with('category')
                ->where('status', 'published')
                ->where('is_featured', true)
                ->take(6)
                ->get();
        });

        // Cache category list for 1 hour
        $categories = Cache::remember('home_categories', 3600, function () {
            return Category::withCount(['publishedItems as items_count'])
                ->orderBy('sort_order', 'asc')
                ->get();
        });

        // Cache featured portfolio showcase for 1 hour
        $featuredPortfolios = Cache::remember('home_featured_portfolios', 3600, function () {
            return Portfolio::with(['item', 'client'])
                ->where('is_featured', true)
                ->take(4)
                ->get();
        });

        // Hero settings are served from memory cache
        $hero = [
            'headline' => SiteSetting::get('hero_headline', 'We Build World-Class Apps, Websites & Enterprise Software'),
            'headline_bn' => SiteSetting::get('hero_headline_bn', 'আমরা তৈরি করি বিশ্বমানের মোবাইল অ্যাপস, ওয়েবসাইট ও এন্টারপ্রাইজ সফটওয়্যার'),
            'subheadline' => SiteSetting::get('hero_subheadline', 'Empowering ambitious businesses with high-impact digital solutions, custom software architecture, and modern mobile experiences.'),
            'subheadline_bn' => SiteSetting::get('hero_subheadline_bn', 'আধুনিক প্রযুক্তি, কাস্টম সফটওয়্যার আর্কিটেকচার এবং স্মার্ট মোবাইল অ্যাপসের মাধ্যমে আপনার ব্যবসার ডিজিটাল রূপান্তর নিশ্চিত করুন।'),
            'badge' => SiteSetting::get('hero_badge', 'PREMIUM IT SOLUTIONS, APPS & WEB ENGINEERING'),
            'badge_bn' => SiteSetting::get('hero_badge_bn', 'প্রিমিয়াম আইটি সলিউশন, অ্যাপস ও ওয়েব ইঞ্জিনিয়ারিং'),
            'image_1' => SiteSetting::get('hero_image_1', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&auto=format&fit=crop&q=80'),
            'image_2' => SiteSetting::get('hero_image_2', 'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=800&auto=format&fit=crop&q=80'),
            'image_1_tag' => SiteSetting::get('hero_image_1_tag', 'Enterprise Cloud & Web Apps'),
            'image_1_tag_bn' => SiteSetting::get('hero_image_1_tag_bn', 'এন্টারপ্রাইজ ক্লাউড ও ওয়েব অ্যাপস'),
            'image_2_tag' => SiteSetting::get('hero_image_2_tag', 'Mobile & High Scale Systems'),
            'image_2_tag_bn' => SiteSetting::get('hero_image_2_tag_bn', 'মোবাইল ও হাই-স্কেল সিস্টেম'),
            'stat1_value' => SiteSetting::get('hero_stat1_value', '100+'),
            'stat1_label' => SiteSetting::get('hero_stat1_label', 'Projects Delivered'),
            'stat1_label_bn' => SiteSetting::get('hero_stat1_label_bn', 'সফল প্রজেক্ট ডেলিভারি'),
            'stat2_value' => SiteSetting::get('hero_stat2_value', '99.9%'),
            'stat2_label' => SiteSetting::get('hero_stat2_label', 'Uptime Guarantee'),
            'stat2_label_bn' => SiteSetting::get('hero_stat2_label_bn', 'আপটাইম গ্যারান্টি'),
            'stat3_value' => SiteSetting::get('hero_stat3_value', '5.0 ★'),
            'stat3_label' => SiteSetting::get('hero_stat3_label', 'Client Rating'),
            'stat3_label_bn' => SiteSetting::get('hero_stat3_label_bn', 'ক্লায়েন্ট রেটিং'),
        ];

        // Cache customer reviews for 30 minutes
        $reviews = Cache::remember('home_approved_reviews', 1800, function () {
            return Review::with('user')
                ->where('is_approved', true)
                ->latest()
                ->take(6)
                ->get();
        });

        return Inertia::render('Public/Home', [
            'hero' => $hero,
            'featuredItems' => $featuredItems,
            'categories' => $categories,
            'featuredPortfolios' => $featuredPortfolios,
            'reviews' => $reviews,
        ]);
    }
}
