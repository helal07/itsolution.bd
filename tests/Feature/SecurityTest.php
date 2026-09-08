<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\RateLimiter;
use Tests\TestCase;

class SecurityTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        RateLimiter::clear('login');
        RateLimiter::clear('register');
        RateLimiter::clear('quotes');
        RateLimiter::clear('search');
    }

    public function test_security_headers_are_present_on_responses(): void
    {
        $response = $this->get('/');

        $response->assertHeader('X-Frame-Options', 'SAMEORIGIN');
        $response->assertHeader('X-Content-Type-Options', 'nosniff');
        $response->assertHeader('X-XSS-Protection', '1; mode=block');
        $response->assertHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    }

    public function test_registration_endpoint_has_rate_limiting(): void
    {
        for ($i = 0; $i < 5; $i++) {
            $this->post('/register', [
                'name' => "User {$i}",
                'email' => "user{$i}@example.com",
                'password' => 'password123',
                'password_confirmation' => 'password123',
            ]);
        }

        // 6th request should hit rate limit (HTTP 429)
        $response = $this->post('/register', [
            'name' => 'Spam User',
            'email' => 'spam@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(429);
    }

    public function test_quote_honeypot_rejects_bot_submissions(): void
    {
        $response = $this->post('/quotes', [
            'name' => 'Spam Bot',
            'email' => 'bot@spammer.com',
            'message' => 'Spam message',
            'website' => 'http://spam-link.com', // Filled honeypot
        ]);

        $response->assertSessionHasErrors(['website']);
    }
}
