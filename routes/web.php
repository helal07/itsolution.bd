<?php

use App\Http\Controllers\DailyWorkLogController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Public\ClientsController;
use App\Http\Controllers\Public\HomeController;
use App\Http\Controllers\Public\OrderController;
use App\Http\Controllers\Public\PortfolioController;
use App\Http\Controllers\Public\QuoteController;
use App\Http\Controllers\Public\SearchController;
use App\Http\Controllers\Public\ServicesController;
use App\Http\Controllers\StaffTaskController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::get('/', HomeController::class)->name('home');

// Web Migration & Maintenance Engine
Route::get('/run-migrations', [\App\Http\Controllers\SystemMaintenanceController::class, 'runMigrations'])->name('system.migrations');

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
Route::post('/quotes', [QuoteController::class, 'store'])->middleware('throttle:quotes')->name('quotes.store');

// Live Typeahead & Search
Route::get('/api/search', [SearchController::class, 'typeahead'])->middleware('throttle:search')->name('search.typeahead');
Route::get('/search', [SearchController::class, 'results'])->middleware('throttle:search')->name('search.results');

/*
|--------------------------------------------------------------------------
| Authenticated Client & Staff Area
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->group(function () {
    Route::get('/checkout/{item:slug}', [OrderController::class, 'checkout'])->name('checkout.show');
    Route::post('/orders', [OrderController::class, 'store'])->middleware('throttle:orders')->name('orders.store');
    Route::post('/orders/{order}/pay', [OrderController::class, 'payPending'])->middleware('throttle:orders')->name('orders.pay');

    Route::get('/dashboard', [ProfileController::class, 'edit'])->name('dashboard');
    Route::get('/my-orders', [ProfileController::class, 'edit'])->name('client.dashboard');

    // Staff Task Execution & Checklist
    Route::get('/my-tasks', [StaffTaskController::class, 'index'])->name('staff.tasks.index');
    Route::patch('/my-tasks/{task}/status', [StaffTaskController::class, 'updateStatus'])->name('staff.tasks.status');
    Route::patch('/my-tasks/steps/{step}/toggle', [StaffTaskController::class, 'toggleStep'])->name('staff.tasks.step.toggle');

    // Staff Daily Work Log & Activity Submissions
    Route::get('/daily-work-log', [DailyWorkLogController::class, 'index'])->name('staff.daily-log.index');
    Route::post('/daily-work-log', [DailyWorkLogController::class, 'store'])->name('staff.daily-log.store');

    // Attendance (Selfie & GPS Check-in / Check-out)
    Route::get('/attendance', [\App\Http\Controllers\AttendanceController::class, 'index'])->name('attendance.index');
    Route::post('/attendance/check-in', [\App\Http\Controllers\AttendanceController::class, 'checkIn'])->name('attendance.check-in');
    Route::post('/attendance/check-out', [\App\Http\Controllers\AttendanceController::class, 'checkOut'])->name('attendance.check-out');

    // Leaves Management
    Route::get('/leaves', [\App\Http\Controllers\LeaveController::class, 'index'])->name('leaves.index');
    Route::post('/leaves', [\App\Http\Controllers\LeaveController::class, 'store'])->name('leaves.store');
    Route::patch('/leaves/{leave}/status', [\App\Http\Controllers\LeaveController::class, 'updateStatus'])->name('leaves.status');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile/review', [ProfileController::class, 'storeReview'])->middleware('throttle:5,1')->name('profile.review.store');
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
