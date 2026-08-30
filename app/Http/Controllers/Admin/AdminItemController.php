<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\AdminItemRequest;
use App\Models\Category;
use App\Models\Item;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AdminItemController extends Controller
{
    public function index(): Response
    {
        $items = Item::with('category')
            ->orderBy('category_id')
            ->orderBy('id', 'desc')
            ->paginate(15);

        $categories = Category::all(['id', 'name']);

        return Inertia::render('Admin/Items/Index', [
            'items' => $items,
            'categories' => $categories,
        ]);
    }

    public function store(AdminItemRequest $request): RedirectResponse
    {
        $data = $request->validated();
        
        if ($request->hasFile('thumbnail_file')) {
            $path = $request->file('thumbnail_file')->store('services', 'public');
            $data['thumbnail'] = '/storage/' . $path;
        }

        if (isset($data['is_featured'])) {
            $data['is_featured'] = filter_var($data['is_featured'], FILTER_VALIDATE_BOOLEAN);
        }

        if (isset($data['is_purchasable'])) {
            $data['is_purchasable'] = filter_var($data['is_purchasable'], FILTER_VALIDATE_BOOLEAN);
        }

        if ($data['status'] === 'published' && empty($data['published_at'])) {
            $data['published_at'] = now();
        }

        unset($data['thumbnail_file']);

        Item::create($data);

        \Illuminate\Support\Facades\Cache::forget('home_featured_items');
        \Illuminate\Support\Facades\Cache::forget('global_menu_categories');

        return back()->with('success', 'Service created successfully.');
    }

    public function update(AdminItemRequest $request, Item $item): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('thumbnail_file')) {
            // Delete old uploaded thumbnail if stored locally
            if ($item->thumbnail && str_starts_with($item->thumbnail, '/storage/services/')) {
                $oldPath = str_replace('/storage/', '', $item->thumbnail);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('thumbnail_file')->store('services', 'public');
            $data['thumbnail'] = '/storage/' . $path;
        }

        if (isset($data['is_featured'])) {
            $data['is_featured'] = filter_var($data['is_featured'], FILTER_VALIDATE_BOOLEAN);
        }

        if (isset($data['is_purchasable'])) {
            $data['is_purchasable'] = filter_var($data['is_purchasable'], FILTER_VALIDATE_BOOLEAN);
        }

        if ($data['status'] === 'published' && ! $item->published_at) {
            $data['published_at'] = now();
        }

        unset($data['thumbnail_file']);

        $item->update($data);

        \Illuminate\Support\Facades\Cache::forget('home_featured_items');
        \Illuminate\Support\Facades\Cache::forget('global_menu_categories');

        return back()->with('success', 'Service updated successfully.');
    }

    public function destroy(Item $item): RedirectResponse
    {
        if ($item->thumbnail && str_starts_with($item->thumbnail, '/storage/services/')) {
            $oldPath = str_replace('/storage/', '', $item->thumbnail);
            Storage::disk('public')->delete($oldPath);
        }

        $item->delete();

        \Illuminate\Support\Facades\Cache::forget('home_featured_items');
        \Illuminate\Support\Facades\Cache::forget('global_menu_categories');

        return back()->with('success', 'Service deleted successfully.');
    }
}
