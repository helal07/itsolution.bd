<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Item;
use Inertia\Inertia;
use Inertia\Response;

class ServicesController extends Controller
{
    /**
     * Display the 3-column category overview (/services)
     */
    public function index(): Response
    {
        $categories = Category::with(['publishedItems' => function ($q) {
            $q->select('id', 'category_id', 'name', 'slug', 'short_description', 'thumbnail', 'price', 'is_featured')
              ->orderBy('is_featured', 'desc')
              ->orderBy('name', 'asc');
        }])->orderBy('sort_order', 'asc')->get();

        return Inertia::render('Public/Services', [
            'categories' => $categories,
        ]);
    }

    /**
     * Display a specific category's items grid (/services/{category})
     */
    public function category(string $categorySlug): Response|RedirectResponse
    {
        $category = Category::where('slug', $categorySlug)->first();

        if (!$category) {
            // Fallback: check if slug matches an item directly
            $item = Item::where('slug', $categorySlug)->with('category')->first();
            if ($item) {
                $catSlug = $item->category ? $item->category->slug : 'apps';
                return redirect()->route('services.item', ['categorySlug' => $catSlug, 'itemSlug' => $item->slug]);
            }

            return redirect()->route('services.index');
        }

        $items = Item::where('category_id', $category->id)
            ->where('status', 'published')
            ->orderBy('is_featured', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate(12);

        $otherCategories = Category::where('id', '!=', $category->id)
            ->orderBy('sort_order', 'asc')
            ->get();

        return Inertia::render('Public/CategoryDetail', [
            'category' => $category,
            'items' => $items,
            'otherCategories' => $otherCategories,
        ]);
    }

    /**
     * Display the dedicated page for a single item (/services/{category}/{item})
     */
    public function show(string $categorySlug, string $itemSlug): Response|RedirectResponse
    {
        $item = Item::where('slug', $itemSlug)->with(['images', 'category'])->first();

        if (!$item) {
            // Fallback by ID if slug is numeric
            if (is_numeric($itemSlug)) {
                $item = Item::with(['images', 'category'])->find($itemSlug);
            }
        }

        if (!$item) {
            abort(404, 'Service or product solution not found.');
        }

        $category = $item->category;

        // If the URL category doesn't match the item's actual category, redirect to the canonical URL
        if ($category && $category->slug !== $categorySlug && $categorySlug !== 'services') {
            return redirect()->route('services.item', [
                'categorySlug' => $category->slug,
                'itemSlug' => $item->slug
            ]);
        }

        if (!$category) {
            $category = Category::where('slug', $categorySlug)->first() ?? new Category(['name' => 'Services', 'slug' => 'services']);
        }

        $relatedPortfolios = $item->portfolios()
            ->with('client')
            ->take(3)
            ->get();

        $relatedItems = Item::where('category_id', $item->category_id)
            ->where('id', '!=', $item->id)
            ->where('status', 'published')
            ->take(3)
            ->get();

        return Inertia::render('Public/ItemDetail', [
            'category' => $category,
            'item' => $item,
            'relatedPortfolios' => $relatedPortfolios,
            'relatedItems' => $relatedItems,
        ]);
    }

    /**
     * Direct item link shortcut (/item/{itemSlug})
     */
    public function showItemDirect(string $itemSlug): RedirectResponse
    {
        $item = Item::where('slug', $itemSlug)->with('category')->firstOrFail();
        $catSlug = $item->category ? $item->category->slug : 'apps';
        return redirect()->route('services.item', ['categorySlug' => $catSlug, 'itemSlug' => $item->slug]);
    }
}
