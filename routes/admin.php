<?php

use App\Http\Controllers\Admin\AdminChatQuestionController;
use App\Http\Controllers\Admin\AdminClientController;
use App\Http\Controllers\Admin\AdminEmployeeController;
use App\Http\Controllers\Admin\AdminItemController;
use App\Http\Controllers\Admin\AdminOrderController;
use App\Http\Controllers\Admin\AdminPortfolioController;
use App\Http\Controllers\Admin\AdminProfileController;
use App\Http\Controllers\Admin\AdminQuoteController;
use App\Http\Controllers\Admin\AdminReorderController;
use App\Http\Controllers\Admin\AdminReviewController;
use App\Http\Controllers\Admin\AdminSettingController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\DashboardController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', DashboardController::class)->name('dashboard');

    // Site & Hero Settings
    Route::get('/settings', [AdminSettingController::class, 'index'])->name('settings.index');
    Route::post('/settings', [AdminSettingController::class, 'update'])->name('settings.update');
    Route::post('/settings/test-sms', [AdminSettingController::class, 'testSms'])->name('settings.test-sms');

    // Registered Website Users Management
    Route::get('/users', [AdminUserController::class, 'index'])->name('users.index');
    Route::post('/users', [AdminUserController::class, 'store'])->name('users.store');
    Route::post('/users/{user}/order', [AdminUserController::class, 'storeOrder'])->name('users.order');
    Route::post('/users/{user}/make-client', [AdminUserController::class, 'makeClient'])->name('users.make-client');
    Route::put('/users/{user}', [AdminUserController::class, 'update'])->name('users.update');
    Route::delete('/users/{user}', [AdminUserController::class, 'destroy'])->name('users.destroy');

    // Items CRUD (Service Products)
    Route::get('/items', [AdminItemController::class, 'index'])->name('items.index');
    Route::post('/items', [AdminItemController::class, 'store'])->name('items.store');
    Route::put('/items/{item}', [AdminItemController::class, 'update'])->name('items.update');
    Route::delete('/items/{item}', [AdminItemController::class, 'destroy'])->name('items.destroy');

    // Portfolios CRUD
    Route::get('/portfolios', [AdminPortfolioController::class, 'index'])->name('portfolios.index');
    Route::post('/portfolios', [AdminPortfolioController::class, 'store'])->name('portfolios.store');
    Route::put('/portfolios/{portfolio}', [AdminPortfolioController::class, 'update'])->name('portfolios.update');
    Route::delete('/portfolios/{portfolio}', [AdminPortfolioController::class, 'destroy'])->name('portfolios.destroy');

    // Quotes Management
    Route::get('/quotes', [AdminQuoteController::class, 'index'])->name('quotes.index');
    Route::post('/quotes', [AdminQuoteController::class, 'store'])->name('quotes.store');
    Route::patch('/quotes/{quote}', [AdminQuoteController::class, 'update'])->name('quotes.update');
    Route::post('/quotes/{quote}/convert', [AdminQuoteController::class, 'convert'])->name('quotes.convert');
    Route::delete('/quotes/{quote}', [AdminQuoteController::class, 'destroy'])->name('quotes.destroy');

    // Orders Management
    Route::get('/orders', [AdminOrderController::class, 'index'])->name('orders.index');
    Route::post('/orders', [AdminOrderController::class, 'store'])->name('orders.store');
    Route::patch('/orders/{order}', [AdminOrderController::class, 'update'])->name('orders.update');
    Route::put('/orders/{order}', [AdminOrderController::class, 'update'])->name('orders.update.put');
    Route::delete('/orders/{order}', [AdminOrderController::class, 'destroy'])->name('orders.destroy');

    // Reorders (Subscriptions, Monthly/Yearly Packages & Renewal Reminders)
    Route::get('/reorders', [AdminReorderController::class, 'index'])->name('reorders.index');
    Route::post('/reorders', [AdminReorderController::class, 'store'])->name('reorders.store');
    Route::put('/reorders/{reorder}', [AdminReorderController::class, 'update'])->name('reorders.update');
    Route::delete('/reorders/{reorder}', [AdminReorderController::class, 'destroy'])->name('reorders.destroy');
    Route::post('/reorders/{reorder}/send-reminder', [AdminReorderController::class, 'sendReminder'])->name('reorders.reminder');

    // Reviews & Ratings Management
    Route::get('/reviews', [AdminReviewController::class, 'index'])->name('reviews.index');
    Route::put('/reviews/{review}', [AdminReviewController::class, 'update'])->name('reviews.update');
    Route::delete('/reviews/{review}', [AdminReviewController::class, 'destroy'])->name('reviews.destroy');

    // Clients Management
    Route::get('/clients', [AdminClientController::class, 'index'])->name('clients.index');
    Route::post('/clients', [AdminClientController::class, 'store'])->name('clients.store');
    Route::put('/clients/{client}', [AdminClientController::class, 'update'])->name('clients.update');
    Route::delete('/clients/{client}', [AdminClientController::class, 'destroy'])->name('clients.destroy');
    Route::post('/clients/{client}/orders', [AdminClientController::class, 'storeOrder'])->name('clients.orders.store');
    Route::post('/clients/{client}/payments', [AdminClientController::class, 'storePayment'])->name('clients.payments.store');

    // Employees & Team Members Management (Staff)
    Route::get('/employees', [AdminEmployeeController::class, 'index'])->name('employees.index');
    Route::post('/employees', [AdminEmployeeController::class, 'store'])->name('employees.store');
    Route::put('/employees/{employee}', [AdminEmployeeController::class, 'update'])->name('employees.update');
    Route::delete('/employees/{employee}', [AdminEmployeeController::class, 'destroy'])->name('employees.destroy');

    // Live Chat Box Questions & Selections Management
    Route::get('/chat-questions', [AdminChatQuestionController::class, 'index'])->name('chat-questions.index');
    Route::post('/chat-questions', [AdminChatQuestionController::class, 'store'])->name('chat-questions.store');
    Route::put('/chat-questions/{chatQuestion}', [AdminChatQuestionController::class, 'update'])->name('chat-questions.update');
    Route::delete('/chat-questions/{chatQuestion}', [AdminChatQuestionController::class, 'destroy'])->name('chat-questions.destroy');
    Route::post('/chat-questions/{chatQuestion}/toggle-active', [AdminChatQuestionController::class, 'toggleActive'])->name('chat-questions.toggle-active');
    Route::post('/chat-questions/{chatQuestion}/toggle-quick', [AdminChatQuestionController::class, 'toggleQuickOption'])->name('chat-questions.toggle-quick');
    Route::post('/chat-questions/settings', [AdminChatQuestionController::class, 'updateSettings'])->name('chat-questions.settings');

    // Admin & Staff My Profile Management
    Route::get('/profile', [AdminProfileController::class, 'edit'])->name('profile.edit');
    Route::put('/profile', [AdminProfileController::class, 'update'])->name('profile.update');
    Route::put('/profile/password', [AdminProfileController::class, 'updatePassword'])->name('profile.password');
});
