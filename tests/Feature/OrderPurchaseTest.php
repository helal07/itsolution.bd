<?php

namespace Tests\Feature;

use App\Models\Item;
use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderPurchaseTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_authenticated_user_can_place_order(): void
    {
        $user = User::where('role', 'client')->first();
        $item = Item::where('is_purchasable', true)->first();

        $response = $this->actingAs($user)->post('/orders', [
            'item_id' => $item->id,
            'payment_method' => 'Stripe',
        ]);

        $response->assertRedirect(route('profile.edit'));

        $this->assertDatabaseHas('orders', [
            'user_id' => $user->id,
            'item_id' => $item->id,
            'amount' => $item->price,
            'status' => 'paid',
        ]);
    }
}
