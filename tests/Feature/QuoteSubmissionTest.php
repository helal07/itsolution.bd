<?php

namespace Tests\Feature;

use App\Models\Item;
use App\Models\Quote;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class QuoteSubmissionTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_can_submit_quote_successfully(): void
    {
        $item = Item::first();

        $response = $this->post('/quotes', [
            'name' => 'Alice Walker',
            'email' => 'alice@enterprise.com',
            'phone' => '+1 (555) 345-6789',
            'item_id' => $item->id,
            'message' => 'We need an enterprise deployment for 25 branches across North America.',
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('quotes', [
            'email' => 'alice@enterprise.com',
            'status' => 'new',
        ]);
    }

    public function test_quote_submission_validates_required_fields(): void
    {
        $response = $this->post('/quotes', []);
        $response->assertSessionHasErrors(['name', 'email', 'message']);
    }
}
