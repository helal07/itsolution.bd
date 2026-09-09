<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminLeaveSettingController extends Controller
{
    /**
     * Default Leave Types and Values Configuration
     */
    public static function getDefaultLeaveTypes(): array
    {
        return [
            [
                'id' => 'casual',
                'name' => 'Casual Leave',
                'days' => 10,
                'is_paid' => true,
                'enabled' => true,
                'description' => 'Standard short-term personal or family leave.',
                'color' => 'blue',
            ],
            [
                'id' => 'sick',
                'name' => 'Sick Leave',
                'days' => 10,
                'is_paid' => true,
                'enabled' => true,
                'description' => 'Medical leave for illnesses or doctor appointments.',
                'color' => 'rose',
            ],
            [
                'id' => 'annual',
                'name' => 'Annual / Earned Leave',
                'days' => 14,
                'is_paid' => true,
                'enabled' => true,
                'description' => 'Accrued annual vacation and personal wellness time.',
                'color' => 'emerald',
            ],
            [
                'id' => 'emergency',
                'name' => 'Emergency Leave',
                'days' => 5,
                'is_paid' => true,
                'enabled' => true,
                'description' => 'Urgent unforeseen situations or compassionate leave.',
                'color' => 'amber',
            ],
            [
                'id' => 'maternity',
                'name' => 'Maternity / Parental Leave',
                'days' => 90,
                'is_paid' => true,
                'enabled' => false,
                'description' => 'Parental leave for childbirth or infant adoption.',
                'color' => 'purple',
            ],
            [
                'id' => 'unpaid',
                'name' => 'Leave Without Pay (LWP)',
                'days' => 30,
                'is_paid' => false,
                'enabled' => true,
                'description' => 'Extended personal absence without compensation.',
                'color' => 'slate',
            ],
        ];
    }

    /**
     * Helper to retrieve current leave types
     */
    public static function getLeaveTypes(): array
    {
        $raw = SiteSetting::get('leave_types_config', null);
        if ($raw) {
            $decoded = json_decode($raw, true);
            if (is_array($decoded) && count($decoded) > 0) {
                return $decoded;
            }
        }
        return self::getDefaultLeaveTypes();
    }

    /**
     * Display Leave Settings Page
     */
    public function index(): Response
    {
        $leaveTypes = self::getLeaveTypes();
        $allowCarryForward = SiteSetting::get('leave_allow_carry_forward', '0');
        $maxCarryForwardDays = SiteSetting::get('leave_max_carry_forward_days', '5');
        $requireDocumentProof = SiteSetting::get('leave_require_proof_days', '3');

        return Inertia::render('Admin/HRM/LeaveSettings', [
            'leaveTypes' => $leaveTypes,
            'settings' => [
                'allow_carry_forward' => $allowCarryForward,
                'max_carry_forward_days' => $maxCarryForwardDays,
                'require_proof_days' => $requireDocumentProof,
            ],
        ]);
    }

    /**
     * Update Leave Settings & Types Quotas
     */
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'leave_types' => 'required|array|min:1',
            'leave_types.*.id' => 'required|string|max:50',
            'leave_types.*.name' => 'required|string|max:100',
            'leave_types.*.days' => 'required|numeric|min:0|max:365',
            'leave_types.*.is_paid' => 'required|boolean',
            'leave_types.*.enabled' => 'required|boolean',
            'leave_types.*.description' => 'nullable|string|max:255',
            'leave_types.*.color' => 'nullable|string|max:30',
            'allow_carry_forward' => 'nullable|string|in:0,1',
            'max_carry_forward_days' => 'nullable|numeric|min:0|max:365',
            'require_proof_days' => 'nullable|numeric|min:1|max:30',
        ]);

        SiteSetting::set('leave_types_config', json_encode($validated['leave_types']));
        SiteSetting::set('leave_allow_carry_forward', $request->input('allow_carry_forward', '0'));
        SiteSetting::set('leave_max_carry_forward_days', (string) $request->input('max_carry_forward_days', '5'));
        SiteSetting::set('leave_require_proof_days', (string) $request->input('require_proof_days', '3'));

        return back()->with('success', 'Leave types and quota settings updated successfully.');
    }
}
