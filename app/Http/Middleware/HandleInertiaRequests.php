<?php

namespace App\Http\Middleware;

use App\Models\Category;
use App\Models\ChatQuestion;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'siteSettings' => function () {
                return SiteSetting::allCached();
            },
            'chatQuestions' => function () {
                return ChatQuestion::allActiveCached();
            },
            'menuCategories' => function () {
                return Cache::remember('global_menu_categories', 3600, function () {
                    return Category::with(['publishedItems' => function ($q) {
                        $q->select('id', 'category_id', 'name', 'slug', 'short_description', 'price', 'is_featured');
                    }])->orderBy('sort_order', 'asc')->get();
                });
            },
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ];
    }
}
