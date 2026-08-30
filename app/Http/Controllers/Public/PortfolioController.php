<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Portfolio;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PortfolioController extends Controller
{
    /**
     * Display portfolio gallery with carousel and filterable grid (/portfolio)
     */
    public function index(Request $request): Response
    {
        $currentType = $request->query('type', 'all');

        $query = Portfolio::with(['item.category', 'client']);

        if ($currentType !== 'all' && in_array($currentType, ['website', 'software', 'pos_software'])) {
            $query->where('type', $currentType);
        }

        $portfolios = $query->orderBy('is_featured', 'desc')
            ->orderBy('completed_at', 'desc')
            ->paginate(9)
            ->withQueryString();

        $featuredCarousel = Portfolio::with(['item', 'client'])
            ->where('is_featured', true)
            ->take(5)
            ->get();

        return Inertia::render('Public/Portfolio', [
            'portfolios' => $portfolios,
            'featuredCarousel' => $featuredCarousel,
            'currentType' => $currentType,
        ]);
    }

    /**
     * Display a specific portfolio project detail (/portfolio/{portfolio:slug})
     */
    public function show(Portfolio $portfolio): Response
    {
        $portfolio->load(['item.category', 'client', 'images']);

        $relatedPortfolios = Portfolio::where('id', '!=', $portfolio->id)
            ->where('type', $portfolio->type)
            ->take(3)
            ->get();

        return Inertia::render('Public/PortfolioDetail', [
            'portfolio' => $portfolio,
            'relatedPortfolios' => $relatedPortfolios,
        ]);
    }
}
