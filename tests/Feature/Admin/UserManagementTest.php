<?php

namespace Tests\Feature\Admin;

use App\Models\Client;
use App\Models\Item;
use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_admin_can_view_users_list(): void
    {
        $admin = User::where('role', 'admin')->first();

        $response = $this->actingAs($admin)->get('/admin/users');

        $response->assertStatus(200);
    }

    public function test_admin_can_create_order_for_user_and_auto_makes_client(): void
    {
        $admin = User::where('role', 'admin')->first();
        $user = User::factory()->create([
            'name' => 'Kazi Shuvo',
            'email' => 'kazi.shuvo@example.com',
            'phone' => '+880 1712-998877',
            'role' => 'client',
        ]);

        $item = Item::first();

        // Ensure user is not yet a client in clients table
        $this->assertDatabaseMissing('clients', ['email' => 'kazi.shuvo@example.com']);

        $response = $this->actingAs($admin)->post("/admin/users/{$user->id}/order", [
            'item_id' => $item->id,
            'project_name' => 'Custom Retail POS Deployment',
            'amount' => 50000,
            'status' => 'paid',
            'payment_method' => 'bKash/Nagad',
            'notes' => 'Fast delivery required',
        ]);

        $response->assertRedirect();

        // Assert user was automatically created as a CRM Client!
        $this->assertDatabaseHas('clients', [
            'email' => 'kazi.shuvo@example.com',
            'name' => 'Kazi Shuvo',
        ]);

        $client = Client::where('email', 'kazi.shuvo@example.com')->first();

        // Assert order is linked to both user and client
        $this->assertDatabaseHas('orders', [
            'user_id' => $user->id,
            'client_id' => $client->id,
            'item_id' => $item->id,
            'amount' => 50000,
            'status' => 'paid',
        ]);
    }

    public function test_admin_can_manually_convert_user_to_client(): void
    {
        $admin = User::where('role', 'admin')->first();
        $user = User::factory()->create([
            'name' => 'Nusrat Jahan',
            'email' => 'nusrat.j@example.com',
            'phone' => '+880 1819-112233',
            'role' => 'client',
        ]);

        $response = $this->actingAs($admin)->post("/admin/users/{$user->id}/make-client");

        $response->assertRedirect();

        $this->assertDatabaseHas('clients', [
            'email' => 'nusrat.j@example.com',
            'name' => 'Nusrat Jahan',
        ]);
    }

    public function test_admin_can_update_user(): void
    {
        $admin = User::where('role', 'admin')->first();
        $user = User::factory()->create();

        $response = $this->actingAs($admin)->put("/admin/users/{$user->id}", [
            'name' => 'Updated User Name',
            'email' => 'updated.user@example.com',
            'phone' => '+880 1700-112233',
            'role' => 'client',
        ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'Updated User Name',
            'email' => 'updated.user@example.com',
        ]);
    }
}
