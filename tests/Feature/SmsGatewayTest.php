<?php

namespace Tests\Feature;

use App\Models\SiteSetting;
use App\Models\User;
use App\Services\SmsService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class SmsGatewayTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_send_test_sms_via_bulksmsbd_successfully(): void
    {
        Http::fake([
            'https://bulksmsbd.net/*' => Http::response(json_encode([
                'response_code' => 202,
                'success_message' => 'SMS Submitted Successfully',
            ]), 200),
        ]);

        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)->post(route('admin.settings.test-sms'), [
            'test_phone' => '01712345678',
            'test_message' => 'IT SOLUTIONS test SMS verification',
            'sms_provider' => 'bulksmsbd',
            'sms_api_key' => 'valid-api-key',
            'sms_sender_id' => '8809612345678',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');
        $this->assertStringContainsString('SMS sent successfully', session('success'));
    }

    public function test_bulksmsbd_error_code_returns_clear_message_and_code(): void
    {
        Http::fake([
            'https://bulksmsbd.net/*' => Http::response(json_encode([
                'response_code' => 1007,
                'error_message' => 'Balance Insufficient',
            ]), 200),
        ]);

        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)->post(route('admin.settings.test-sms'), [
            'test_phone' => '01812345678',
            'test_message' => 'Testing balance limit',
            'sms_provider' => 'bulksmsbd',
            'sms_api_key' => 'valid-api-key',
            'sms_sender_id' => 'IT SOLUTIONS',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('error');
        $errorMessage = session('error');
        $this->assertStringContainsString('1007', $errorMessage);
        $this->assertStringContainsString('Insufficient SMS Balance', $errorMessage);
    }

    public function test_bulksmsbd_sender_id_error_code_1002_returns_clear_message(): void
    {
        Http::fake([
            'https://bulksmsbd.net/*' => Http::response(json_encode([
                'response_code' => 1002,
                'error_message' => 'Sender ID is incorrect',
            ]), 200),
        ]);

        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)->post(route('admin.settings.test-sms'), [
            'test_phone' => '01912345678',
            'test_message' => 'Testing sender ID verification',
            'sms_provider' => 'bulksmsbd',
            'sms_api_key' => 'valid-api-key',
            'sms_sender_id' => 'UNAPPROVED_ID',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('error');
        $errorMessage = session('error');
        $this->assertStringContainsString('1002', $errorMessage);
        $this->assertStringContainsString('Sender ID is incorrect or not approved', $errorMessage);
    }

    public function test_test_sms_can_run_even_if_sms_gateway_is_disabled_in_database(): void
    {
        Http::fake([
            'https://bulksmsbd.net/*' => Http::response(json_encode([
                'response_code' => 202,
                'success_message' => 'SMS Submitted Successfully',
            ]), 200),
        ]);

        SiteSetting::set('sms_enabled', '0'); // disabled in database

        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)->post(route('admin.settings.test-sms'), [
            'test_phone' => '01700000000',
            'test_message' => 'Testing with disabled setting',
            'sms_provider' => 'bulksmsbd',
            'sms_api_key' => 'valid-key',
            'sms_sender_id' => 'IT SOLUTIONS',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');
    }
}
