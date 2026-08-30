<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Item;
use App\Models\Portfolio;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicRoutesTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_home_page_loads_successfully(): void
    {
        $response = $this->get('/');
        $response->assertStatus(200);
    }

    public function test_services_index_loads_successfully(): void
    {
        $response = $this->get('/services');
        $response->assertStatus(200);
    }

    public function test_category_page_loads_successfully(): void
    {
        $response = $this->get('/services/apps');
        $response->assertStatus(200);
    }

    public function test_item_detail_page_loads_successfully(): void
    {
        $item = Item::whereHas('category', fn($q) => $q->where('slug', 'apps'))->first();
        $response = $this->get('/services/apps/' . $item->slug);
        $response->assertStatus(200);
    }

    public function test_portfolio_index_loads_successfully(): void
    {
        $response = $this->get('/portfolio');
        $response->assertStatus(200);
    }

    public function test_clients_page_loads_successfully(): void
    {
        $response = $this->get('/clients');
        $response->assertStatus(200);
    }

    public function test_get_a_quote_page_loads_successfully(): void
    {
        $response = $this->get('/get-a-quote');
        $response->assertStatus(200);
    }

    public function test_search_typeahead_api_returns_json(): void
    {
        $response = $this->getJson('/api/search?q=POS');
        $response->assertStatus(200)
            ->assertJsonStructure(['items', 'portfolios']);
    }
}
