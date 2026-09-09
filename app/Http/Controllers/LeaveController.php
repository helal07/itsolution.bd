<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Leave;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LeaveController extends Controller
{
    /**
     * Display Leave Requests & Balances.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $employee = Employee::where('user_id', $user->id)
            ->orWhere('email', $user->email)
            ->first();

        $currentYear = now()->year;

        // Staff's personal leaves
        $myLeaves = Leave::with(['approver'])
            ->where('user_id', $user->id)
            ->latest('start_date')
            ->get();

        // Calculate used leaves for current employee this year
        $approvedLeavesThisYear = Leave::where('user_id', $user->id)
            ->where('status', 'approved')
            ->whereYear('start_date', $currentYear)
            ->get();

        // Get configured leave types from settings
        $configuredTypes = \App\Http\Controllers\Admin\AdminLeaveSettingController::getLeaveTypes();

        $leaveStats = [];
        foreach ($configuredTypes as $type) {
            if ($type['enabled'] ?? true) {
                $typeId = $type['id'];
                $leaveStats[$typeId] = [
                    'id' => $typeId,
                    'name' => $type['name'],
                    'total' => (float) ($type['days'] ?? 0),
                    'is_paid' => (bool) ($type['is_paid'] ?? true),
                    'color' => $type['color'] ?? 'blue',
                    'description' => $type['description'] ?? '',
                    'used' => (float) $approvedLeavesThisYear->where('leave_type', $typeId)->sum('total_days'),
                ];
            }
        }

        // All leaves for Admin overview
        $allLeaves = [];
        if ($user->is_admin) {
            $allLeaves = Leave::with(['employee', 'user', 'approver'])
                ->latest('created_at')
                ->get();
        }

        return Inertia::render('Leaves/Index', [
            'employee' => $employee,
            'myLeaves' => $myLeaves,
            'allLeaves' => $allLeaves,
            'leaveStats' => $leaveStats,
            'leaveTypes' => array_values($configuredTypes),
            'currentYear' => $currentYear,
            'isAdmin' => (bool) $user->is_admin,
        ]);
    }

    /**
     * Staff Submit Leave Application.
     */
    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();
        $employee = Employee::where('user_id', $user->id)
            ->orWhere('email', $user->email)
            ->first();

        $configuredTypes = \App\Http\Controllers\Admin\AdminLeaveSettingController::getLeaveTypes();
        $validTypeKeys = array_column($configuredTypes, 'id');
        $validTypesRule = implode(',', array_merge($validTypeKeys, ['casual', 'sick', 'annual', 'emergency', 'other']));

        $validated = $request->validate([
            'leave_type' => 'required|string|in:' . $validTypesRule,
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'required|string|max:1000',
        ]);

        $startDate = Carbon::parse($validated['start_date']);
        $endDate = Carbon::parse($validated['end_date']);
        $totalDays = $startDate->diffInDays($endDate) + 1;

        Leave::create([
            'employee_id' => $employee?->id,
            'user_id' => $user->id,
            'leave_type' => $validated['leave_type'],
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'total_days' => $totalDays,
            'reason' => $validated['reason'],
            'status' => 'pending',
        ]);

        return redirect()->back()->with('success', 'Leave application submitted successfully. It will be reviewed by admin.');
    }

    /**
     * Admin Approve or Reject Leave.
     */
    public function updateStatus(Request $request, Leave $leave): RedirectResponse
    {
        $user = $request->user();
        if (!$user->is_admin) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'status' => 'required|in:approved,rejected,pending',
            'admin_remarks' => 'nullable|string|max:500',
        ]);

        $leave->update([
            'status' => $validated['status'],
            'admin_remarks' => $validated['admin_remarks'] ?? null,
            'approved_by' => $user->id,
            'approved_at' => now(),
        ]);

        return redirect()->back()->with('success', "Leave application status updated to " . ucfirst($validated['status']) . ".");
    }
}
