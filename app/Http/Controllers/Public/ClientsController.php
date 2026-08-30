<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Inertia\Inertia;
use Inertia\Response;

class ClientsController extends Controller
{
    /**
     * Display client list with testimonials and project links (/clients)
     */
    public function index(): Response
    {
        $clients = Client::with(['portfolios' => function ($q) {
            $q->select('id', 'client_id', 'title', 'slug', 'cover_image', 'type');
        }])
        ->orderBy('sort_order', 'asc')
        ->paginate(10);

        return Inertia::render('Public/Clients', [
            'clients' => $clients,
        ]);
    }
}
