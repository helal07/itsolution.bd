<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreQuoteRequest;
use App\Models\Category;
use App\Models\Item;
use App\Models\Quote;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class QuoteController extends Controller
{
    /**
     * Show the dedicated Get a Quote page (/get-a-quote)
     */
    public function create(Request $request): Response
    {
        $selectedItemId = $request->query('item_id');

        $categories = Category::with(['publishedItems' => function ($q) {
            $q->select('id', 'category_id', 'name', 'slug', 'price');
        }])->orderBy('sort_order', 'asc')->get();

        return Inertia::render('Public/Quote', [
            'categories' => $categories,
            'selectedItemId' => $selectedItemId ? (int) $selectedItemId : null,
        ]);
    }

    /**
     * Handle quote submission
     */
    public function store(StoreQuoteRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $validated['status'] = 'new';

        Quote::create($validated);

        return back()->with('success', 'Your quote request has been received! Our team will reach out to you within 24 business hours.');
    }
}
