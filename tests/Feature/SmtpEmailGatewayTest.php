<?php

namespace Tests\Feature;

use App\Mail\ClientAccountCreatedMail;
use App\Models\Quote;
use App\Models\SiteSetting;
use App\Models\User;
use App\Services\MailConfigService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class SmtpEmailGatewayTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_save_smtp_settings(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)->post(route('admin.settings.update'), [
            'mail_enabled' => '1',
            'mail_host' => 'smtp.gmail.com',
            'mail_port' => '587',
            'mail_username' => 'testuser@gmail.com',
            'mail_password' => 'secret-app-password',
            'mail_encryption' => 'tls',
            'mail_from_address' => 'noreply@itsolution.bd',
            'mail_from_name' => 'IT SOLUTIONS BD',
        ]);

        $response->assertRedirect();

        $this->assertEquals('1', SiteSetting::get('mail_enabled'));
        $this->assertEquals('smtp.gmail.com', SiteSetting::get('mail_host'));
        $this->assertEquals('587', SiteSetting::get('mail_port'));
        $this->assertEquals('testuser@gmail.com', SiteSetting::get('mail_username'));
    }

    public function test_converting_quote_sends_email_notification_when_smtp_enabled(): void
    {
        Mail::fake();

        SiteSetting::set('mail_enabled', '1');
        SiteSetting::set('mail_host', 'smtp.gmail.com');
        SiteSetting::set('mail_port', '587');
        SiteSetting::set('mail_username', 'info@itsolution.bd');
        SiteSetting::set('mail_password', 'password');
        SiteSetting::set('mail_from_address', 'info@itsolution.bd');

        $admin = User::factory()->create(['role' => 'admin']);

        $quote = Quote::create([
            'name' => 'Fahim Rahman',
            'company_name' => 'Fahim Tech',
            'email' => 'fahim@testcorp.com',
            'phone' => '01811223344',
            'message' => 'Need POS system with multi-branch sync.',
            'estimated_budget' => 35000,
            'status' => 'new',
        ]);

        $response = $this->actingAs($admin)->post(route('admin.quotes.convert', $quote->id));

        $response->assertRedirect(route('admin.orders.index'));

        // Client User created
        $createdUser = User::where('email', 'fahim@testcorp.com')->first();
        $this->assertNotNull($createdUser);

        // Verification email sent to client
        Mail::assertSent(ClientAccountCreatedMail::class, function ($mail) {
            return $mail->hasTo('fahim@testcorp.com') && !empty($mail->plainPassword);
        });
    }

    public function test_send_test_email_route(): void
    {
        Mail::fake();

        SiteSetting::set('mail_enabled', '1');
        SiteSetting::set('mail_host', 'smtp.gmail.com');
        SiteSetting::set('mail_port', '587');
        SiteSetting::set('mail_username', 'info@itsolution.bd');
        SiteSetting::set('mail_password', 'password');

        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)->post(route('admin.settings.test-email'), [
            'test_email' => 'admin@gmail.com',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');
    }
}
