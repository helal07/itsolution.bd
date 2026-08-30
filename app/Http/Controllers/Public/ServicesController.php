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
    public function category(Category $category): Response
    {
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
    public function show(Category $category, Item $item): Response
    {
        abort_if($item->category_id !== $category->id || $item->status !== 'published', 404);

        $item->load(['images', 'category']);

        $relatedPortfolios = $item->portfolios()
            ->with('client')
            ->take(3)
            ->get();

        $relatedItems = Item::where('category_id', $category->id)
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
}
