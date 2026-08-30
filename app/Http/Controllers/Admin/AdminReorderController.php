<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Models\Reorder;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminReorderController extends Controller
{
    /**
     * Display a listing of subscriptions / recurring package reorders.
     */
    public function index(Request $request): Response
    {
        $query = Reorder::with(['user', 'item'])->latest('finish_date');

        // Search Filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('client_name', 'like', "%{$search}%")
                    ->orWhere('client_phone', 'like', "%{$search}%")
                    ->orWhere('client_email', 'like', "%{$search}%")
                    ->orWhere('company_name', 'like', "%{$search}%")
                    ->orWhere('package_name', 'like', "%{$search}%");
            });
        }

        // Cycle Filter (Monthly / Yearly / Custom)
        if ($request->filled('cycle') && $request->cycle !== 'all') {
            $query->where('billing_cycle', $request->cycle);
        }

        $today = Carbon::today()->toDateString();
        $soonThreshold = Carbon::today()->addDays(7)->toDateString();

        // Status Filter
        if ($request->filled('status') && $request->status !== 'all') {
            $status = $request->status;
            if ($status === 'expiring_soon') {
                $query->where('status', '!=', 'cancelled')
                      ->where('status', '!=', 'renewed')
                      ->whereBetween('finish_date', [$today, $soonThreshold]);
            } elseif ($status === 'expired') {
                $query->where('status', '!=', 'cancelled')
                      ->where('status', '!=', 'renewed')
                      ->where('finish_date', '<', $today);
            } elseif ($status === 'active') {
                $query->where('status', 'active')
                      ->where('finish_date', '>=', $today);
            } else {
                $query->where('status', $status);
            }
        }

        $reorders = $query->paginate(20)->withQueryString();

        // Aggregated Statistics
        $totalPackages = Reorder::count();
        $activePackages = Reorder::where('finish_date', '>=', $today)->whereNotIn('status', ['cancelled', 'renewed'])->count();
        $expiringSoon = Reorder::whereBetween('finish_date', [$today, $soonThreshold])->whereNotIn('status', ['cancelled', 'renewed'])->count();
        $expiredCount = Reorder::where('finish_date', '<', $today)->whereNotIn('status', ['cancelled', 'renewed'])->count();
        
        $monthlyRevenue = Reorder::where('billing_cycle', 'monthly')
            ->where('finish_date', '>=', $today)
            ->whereNotIn('status', ['cancelled'])
            ->sum('price');

        $yearlyRevenue = Reorder::where('billing_cycle', 'yearly')
            ->where('finish_date', '>=', $today)
            ->whereNotIn('status', ['cancelled'])
            ->sum('price');

        $stats = [
            'total' => $totalPackages,
            'active' => $activePackages,
            'expiring_soon' => $expiringSoon,
            'expired' => $expiredCount,
            'monthly_mrr' => (float) $monthlyRevenue,
            'yearly_arr' => (float) $yearlyRevenue,
        ];

        $users = User::select('id', 'name', 'email', 'phone')->get();
        $items = Item::select('id', 'name', 'price', 'slug')->published()->get();

        return Inertia::render('Admin/Reorders/Index', [
            'reorders' => $reorders,
            'stats' => $stats,
            'users' => $users,
            'items' => $items,
            'filters' => $request->only(['search', 'cycle', 'status']),
        ]);
    }

    /**
     * Store a newly created reorder package subscription.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'client_name' => 'required|string|max:150',
            'client_phone' => 'required|string|max:50',
            'client_email' => 'nullable|email|max:150',
            'company_name' => 'nullable|string|max:150',
            'user_id' => 'nullable|exists:users,id',
            'item_id' => 'nullable|exists:items,id',
            'package_name' => 'required|string|max:180',
            'billing_cycle' => 'required|in:monthly,yearly,custom',
            'price' => 'required|numeric|min:0',
            'currency' => 'nullable|string|max:3',
            'start_date' => 'required|date',
            'finish_date' => 'required|date|after_or_equal:start_date',
            'status' => 'required|in:active,expiring_soon,expired,renewed,cancelled',
            'reminder_days_before' => 'nullable|integer|min:1|max:90',
            'auto_renewal' => 'boolean',
            'notes' => 'nullable|string|max:1000',
        ]);

        $validated['currency'] = $validated['currency'] ?? 'BDT';
        $validated['reminder_days_before'] = $validated['reminder_days_before'] ?? 7;

        Reorder::create($validated);

        return redirect()->route('admin.reorders.index')->with('success', 'Subscription package registered successfully.');
    }

    /**
     * Update the specified subscription package.
     */
    public function update(Request $request, Reorder $reorder): RedirectResponse
    {
        // Handle Quick 1-Click Renewal Extension (+1 Month or +1 Year)
        if ($request->input('action') === 'renew_cycle') {
            $currentFinish = Carbon::parse($reorder->finish_date);
            $newStart = $currentFinish->isPast() ? Carbon::today() : $currentFinish->copy()->addDay();
            
            if ($reorder->billing_cycle === 'yearly') {
                $newFinish = $newStart->copy()->addYear();
            } else {
                $newFinish = $newStart->copy()->addMonth();
            }

            $reorder->update([
                'start_date' => $newStart->toDateString(),
                'finish_date' => $newFinish->toDateString(),
                'status' => 'active',
                'reminder_count' => 0,
                'last_reminder_sent_at' => null,
            ]);

            return redirect()->back()->with('success', "Subscription package renewed successfully until {$newFinish->format('M d, Y')}.");
        }

        $validated = $request->validate([
            'client_name' => 'required|string|max:150',
            'client_phone' => 'required|string|max:50',
            'client_email' => 'nullable|email|max:150',
            'company_name' => 'nullable|string|max:150',
            'user_id' => 'nullable|exists:users,id',
            'item_id' => 'nullable|exists:items,id',
            'package_name' => 'required|string|max:180',
            'billing_cycle' => 'required|in:monthly,yearly,custom',
            'price' => 'required|numeric|min:0',
            'currency' => 'nullable|string|max:3',
            'start_date' => 'required|date',
            'finish_date' => 'required|date',
            'status' => 'required|in:active,expiring_soon,expired,renewed,cancelled',
            'reminder_days_before' => 'nullable|integer|min:1|max:90',
            'auto_renewal' => 'boolean',
            'notes' => 'nullable|string|max:1000',
        ]);

        $reorder->update($validated);

        return redirect()->route('admin.reorders.index')->with('success', 'Subscription package updated successfully.');
    }

    /**
     * Record a sent reminder via WhatsApp or SMS.
     */
    public function sendReminder(Request $request, Reorder $reorder): RedirectResponse
    {
        $channel = $request->input('channel', 'whatsapp'); // 'whatsapp' | 'sms'
        
        $reorder->increment('reminder_count');
        $reorder->update([
            'last_reminder_sent_at' => now(),
            'reminder_channel' => $channel,
        ]);

        $channelLabel = $channel === 'whatsapp' ? 'WhatsApp' : 'SMS';
        return redirect()->back()->with('success', "{$channelLabel} reminder logged for {$reorder->client_name}.");
    }

    /**
     * Remove the specified reorder subscription.
     */
    public function destroy(Reorder $reorder): RedirectResponse
    {
        $reorder->delete();
        return redirect()->route('admin.reorders.index')->with('success', 'Subscription package removed successfully.');
    }
}
