<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\Employee;
use App\Models\Item;
use App\Models\Order;
use App\Models\Portfolio;
use App\Models\Quote;
use App\Models\Reorder;
use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        $today = Carbon::today()->toDateString();
        $sevenDays = Carbon::today()->addDays(7)->toDateString();

        $stats = [
            'total_items' => Item::count(),
            'total_portfolios' => Portfolio::count(),
            'total_clients' => Client::count(),
            'total_staff' => Employee::count(),
            'total_quotes' => Quote::count(),
            'new_quotes' => Quote::where('status', 'new')->count(),
            'total_orders' => Order::count(),
            'total_revenue' => (float) Order::where('status', 'paid')->sum('amount'),
            'pending_revenue' => (float) Order::where('status', 'pending')->sum('amount'),
            'active_reorders' => Reorder::where('finish_date', '>=', $today)->where('status', 'active')->count(),
            'expiring_reorders' => Reorder::whereBetween('finish_date', [$today, $sevenDays])->count(),
            'expired_reorders' => Reorder::where('finish_date', '<', $today)->count(),
        ];

        $recentQuotes = Quote::with('item')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        $recentOrders = Order::with(['user', 'item'])
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        // Expiring or expired subscriptions needing action
        $expiringSubscriptions = Reorder::where('finish_date', '<=', $sevenDays)
            ->orderBy('finish_date', 'asc')
            ->take(4)
            ->get()
            ->map(function ($item) {
                $finish = Carbon::parse($item->finish_date);
                $days = Carbon::today()->diffInDays($finish, false);
                $item->days_remaining = $days;
                return $item;
            });

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentQuotes' => $recentQuotes,
            'recentOrders' => $recentOrders,
            'expiringSubscriptions' => $expiringSubscriptions,
        ]);
    }
}
