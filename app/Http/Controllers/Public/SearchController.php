<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Models\Portfolio;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SearchController extends Controller
{
    /**
     * Typeahead query endpoint for live header search
     */
    public function typeahead(Request $request): JsonResponse
    {
        $q = trim((string) $request->query('q', ''));

        if (strlen($q) < 2) {
            return response()->json([
                'items' => [],
                'portfolios' => [],
            ]);
        }

        $items = Item::with('category')
            ->where('status', 'published')
            ->where(function ($query) use ($q) {
                $query->where('name', 'LIKE', "%{$q}%")
                      ->orWhere('short_description', 'LIKE', "%{$q}%");
            })
            ->take(4)
            ->get(['id', 'category_id', 'name', 'slug', 'short_description', 'thumbnail', 'price']);

        $portfolios = Portfolio::where('title', 'LIKE', "%{$q}%")
            ->orWhere('description', 'LIKE', "%{$q}%")
            ->take(4)
            ->get(['id', 'title', 'slug', 'cover_image', 'type']);

        return response()->json([
            'items' => $items,
            'portfolios' => $portfolios,
        ]);
    }

    /**
     * Dedicated Search Results Page (/search?q=...)
     */
    public function results(Request $request): Response
    {
        $q = trim((string) $request->query('q', ''));

        $items = [];
        $portfolios = [];

        if (strlen($q) >= 2) {
            $items = Item::with('category')
                ->where('status', 'published')
                ->where(function ($query) use ($q) {
                    $query->where('name', 'LIKE', "%{$q}%")
                          ->orWhere('short_description', 'LIKE', "%{$q}%")
                          ->orWhere('description', 'LIKE', "%{$q}%");
                })
                ->get();

            $portfolios = Portfolio::with('client')
                ->where('title', 'LIKE', "%{$q}%")
                ->orWhere('description', 'LIKE', "%{$q}%")
                ->get();
        }

        return Inertia::render('Public/SearchResults', [
            'query' => $q,
            'items' => $items,
            'portfolios' => $portfolios,
        ]);
    }
}
