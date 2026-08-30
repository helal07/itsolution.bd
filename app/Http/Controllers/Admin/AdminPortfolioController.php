<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\AdminPortfolioRequest;
use App\Models\Client;
use App\Models\Item;
use App\Models\Portfolio;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AdminPortfolioController extends Controller
{
    public function index(): Response
    {
        $portfolios = Portfolio::with(['item', 'client'])
            ->orderBy('id', 'desc')
            ->paginate(15);

        $items = Item::where('status', 'published')->get(['id', 'name']);
        $clients = Client::all(['id', 'name']);

        return Inertia::render('Admin/Portfolios/Index', [
            'portfolios' => $portfolios,
            'items' => $items,
            'clients' => $clients,
        ]);
    }

    public function store(AdminPortfolioRequest $request): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('cover_image_file')) {
            $path = $request->file('cover_image_file')->store('portfolios', 'public');
            $data['cover_image'] = '/storage/' . $path;
        } elseif (empty($data['cover_image'])) {
            $data['cover_image'] = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&auto=format&fit=crop&q=80';
        }

        if (isset($data['is_featured'])) {
            $data['is_featured'] = filter_var($data['is_featured'], FILTER_VALIDATE_BOOLEAN);
        }

        unset($data['cover_image_file']);

        Portfolio::create($data);

        \Illuminate\Support\Facades\Cache::forget('home_featured_portfolios');

        return back()->with('success', 'Project created successfully.');
    }

    public function update(AdminPortfolioRequest $request, Portfolio $portfolio): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('cover_image_file')) {
            if ($portfolio->cover_image && str_starts_with($portfolio->cover_image, '/storage/portfolios/')) {
                $oldPath = str_replace('/storage/', '', $portfolio->cover_image);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('cover_image_file')->store('portfolios', 'public');
            $data['cover_image'] = '/storage/' . $path;
        }

        if (isset($data['is_featured'])) {
            $data['is_featured'] = filter_var($data['is_featured'], FILTER_VALIDATE_BOOLEAN);
        }

        unset($data['cover_image_file']);

        $portfolio->update($data);

        \Illuminate\Support\Facades\Cache::forget('home_featured_portfolios');

        return back()->with('success', 'Project updated successfully.');
    }

    public function destroy(Portfolio $portfolio): RedirectResponse
    {
        if ($portfolio->cover_image && str_starts_with($portfolio->cover_image, '/storage/portfolios/')) {
            $oldPath = str_replace('/storage/', '', $portfolio->cover_image);
            Storage::disk('public')->delete($oldPath);
        }

        $portfolio->delete();

        \Illuminate\Support\Facades\Cache::forget('home_featured_portfolios');

        return back()->with('success', 'Project deleted successfully.');
    }
}
