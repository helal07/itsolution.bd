<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        $this->configureRateLimiting();
    }

    /**
     * Configure rate limiters to prevent brute force, credential stuffing, and DoS attacks.
     */
    protected function configureRateLimiting(): void
    {
        // Login rate limiter: 5 attempts per minute per email + IP
        RateLimiter::for('login', function (Request $request) {
            $email = Str::transliterate(Str::lower((string) $request->input('email', '')));
            return Limit::perMinute(5)->by($email . '|' . $request->ip())->response(function () {
                return response()->json([
                    'message' => 'Too many login attempts. Please try again in 1 minute.',
                ], 429);
            });
        });

        // Registration rate limiter: 5 registrations per minute per IP
        RateLimiter::for('register', function (Request $request) {
            return Limit::perMinute(5)->by($request->ip())->response(function () {
                return response()->json([
                    'message' => 'Too many registration requests from this IP. Please wait a minute before trying again.',
                ], 429);
            });
        });

        // Forgot password rate limiter: 3 requests per minute per IP to prevent email flooding
        RateLimiter::for('forgot-password', function (Request $request) {
            $email = Str::transliterate(Str::lower((string) $request->input('email', '')));
            return Limit::perMinute(3)->by($email . '|' . $request->ip())->response(function () {
                return response()->json([
                    'message' => 'Too many password reset requests. Please wait a moment before trying again.',
                ], 429);
            });
        });

        // Search rate limiter: 30 requests per minute per IP to prevent heavy query abuse / DoS
        RateLimiter::for('search', function (Request $request) {
            return Limit::perMinute(30)->by($request->ip());
        });

        // Public quotes rate limiter: 5 submissions per minute per IP
        RateLimiter::for('quotes', function (Request $request) {
            return Limit::perMinute(5)->by($request->ip());
        });

        // Order submission rate limiter: 10 orders per minute per user / IP
        RateLimiter::for('orders', function (Request $request) {
            return Limit::perMinute(10)->by($request->user()?->id ?: $request->ip());
        });

        // SMS testing limiter: 3 tests per minute per admin / IP to protect SMS balance
        RateLimiter::for('sms-test', function (Request $request) {
            return Limit::perMinute(3)->by($request->user()?->id ?: $request->ip());
        });
    }
}
