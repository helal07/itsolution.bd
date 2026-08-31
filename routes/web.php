<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Public\ClientsController;
use App\Http\Controllers\Public\HomeController;
use App\Http\Controllers\Public\OrderController;
use App\Http\Controllers\Public\PortfolioController;
use App\Http\Controllers\Public\QuoteController;
use App\Http\Controllers\Public\SearchController;
use App\Http\Controllers\Public\ServicesController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::get('/', HomeController::class)->name('home');

// Services & Items
Route::get('/services', [ServicesController::class, 'index'])->name('services.index');
Route::get('/services/{categorySlug}', [ServicesController::class, 'category'])->name('services.category');
Route::get('/services/{categorySlug}/{itemSlug}', [ServicesController::class, 'show'])->name('services.item');
Route::get('/item/{itemSlug}', [ServicesController::class, 'showItemDirect'])->name('services.item.direct');

// Portfolio
Route::get('/portfolio', [PortfolioController::class, 'index'])->name('portfolio.index');
Route::get('/portfolio/{portfolio:slug}', [PortfolioController::class, 'show'])->name('portfolio.show');

// Clients
Route::get('/clients', [ClientsController::class, 'index'])->name('clients.index');

// Quotes
Route::get('/get-a-quote', [QuoteController::class, 'create'])->name('quotes.create');
Route::post('/quotes', [QuoteController::class, 'store'])->middleware('throttle:6,1')->name('quotes.store');

// Live Typeahead & Search
Route::get('/api/search', [SearchController::class, 'typeahead'])->name('search.typeahead');
Route::get('/search', [SearchController::class, 'results'])->name('search.results');

/*
|--------------------------------------------------------------------------
| Authenticated Client Area
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->group(function () {
    Route::get('/checkout/{item:slug}', [OrderController::class, 'checkout'])->name('checkout.show');
    Route::post('/orders', [OrderController::class, 'store'])->name('orders.store');
    Route::post('/orders/{order}/pay', [OrderController::class, 'payPending'])->name('orders.pay');

    Route::get('/dashboard', [ProfileController::class, 'edit'])->name('dashboard');
    Route::get('/my-orders', [ProfileController::class, 'edit'])->name('client.dashboard');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile/review', [ProfileController::class, 'storeReview'])->name('profile.review.store');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

/*
|--------------------------------------------------------------------------
| Admin Area
|--------------------------------------------------------------------------
*/
require __DIR__.'/admin.php';

/*
|--------------------------------------------------------------------------
| Auth Routes
|--------------------------------------------------------------------------
*/
require __DIR__.'/auth.php';
