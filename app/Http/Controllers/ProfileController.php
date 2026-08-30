<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\Item;
use App\Models\Order;
use App\Models\Quote;
use App\Models\Review;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's unified profile, project progress, orders, and review form.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();

        $orders = Order::with(['item.category', 'item.images'])
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        $quotes = Quote::with(['item.category'])
            ->where('email', $user->email)
            ->orderBy('created_at', 'desc')
            ->get();

        $review = Review::where('user_id', $user->id)->first();

        $purchasableItems = Item::where('is_purchasable', true)
            ->where('status', 'published')
            ->with('category')
            ->select('id', 'name', 'slug', 'category_id', 'price', 'thumbnail', 'short_description')
            ->get();

        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status' => session('status'),
            'orders' => $orders,
            'quotes' => $quotes,
            'review' => $review,
            'purchasableItems' => $purchasableItems,
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit')->with('status', 'Profile information updated.');
    }

    /**
     * Store or update client rating & review.
     */
    public function storeReview(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'title' => 'nullable|string|max:255',
            'comment' => 'nullable|string|max:2000',
            'project_name' => 'nullable|string|max:255',
        ]);

        Review::updateOrCreate(
            ['user_id' => $request->user()->id],
            [
                'rating' => $validated['rating'],
                'title' => $validated['title'] ?? null,
                'comment' => $validated['comment'] ?? null,
                'project_name' => $validated['project_name'] ?? null,
                'is_approved' => true,
            ]
        );

        return Redirect::route('profile.edit')->with('status', 'Thank you! Your rating and review have been submitted.');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
