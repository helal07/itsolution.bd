<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class AdminReviewController extends Controller
{
    /**
     * Display a listing of client reviews & ratings.
     */
    public function index(): Response
    {
        $reviews = Review::with('user:id,name,email')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('Admin/Reviews/Index', [
            'reviews' => $reviews,
        ]);
    }

    /**
     * Update/fix client rating, feedback, or approval status.
     */
    public function update(Request $request, Review $review): RedirectResponse
    {
        $validated = $request->validate([
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'title' => ['nullable', 'string', 'max:255'],
            'comment' => ['nullable', 'string', 'max:2000'],
            'project_name' => ['nullable', 'string', 'max:255'],
            'is_approved' => ['required', 'boolean'],
        ]);

        $review->update($validated);

        Cache::forget('home_approved_reviews');

        return back()->with('success', 'Review & rating updated successfully.');
    }

    /**
     * Remove the specified review.
     */
    public function destroy(Review $review): RedirectResponse
    {
        $review->delete();

        Cache::forget('home_approved_reviews');

        return back()->with('success', 'Review deleted successfully.');
    }
}
