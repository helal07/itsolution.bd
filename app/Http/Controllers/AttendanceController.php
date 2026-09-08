<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Employee;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AttendanceController extends Controller
{
    /**
     * Display the Attendance Check-in/Check-out dashboard.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $employee = Employee::where('user_id', $user->id)
            ->orWhere('email', $user->email)
            ->first();

        $today = now()->toDateString();
        $selectedDate = $request->query('date', $today);

        // Current user's today attendance
        $todayAttendance = Attendance::where('user_id', $user->id)
            ->whereDate('date', $today)
            ->first();

        // Current user's recent attendance history (last 30 days)
        $myAttendances = Attendance::where('user_id', $user->id)
            ->latest('date')
            ->take(30)
            ->get();

        // Calculate summary stats for the current user this month
        $startOfMonth = now()->startOfMonth()->toDateString();
        $monthAttendances = Attendance::where('user_id', $user->id)
            ->whereBetween('date', [$startOfMonth, $today])
            ->get();

        $myStats = [
            'present_count' => $monthAttendances->whereIn('status', ['present', 'late'])->count(),
            'late_count' => $monthAttendances->where('status', 'late')->count(),
            'half_day_count' => $monthAttendances->where('status', 'half_day')->count(),
            'total_hours' => round($monthAttendances->sum('total_hours'), 1),
        ];

        // Team attendances for the selected date (visible to admins and staff)
        $teamAttendances = Attendance::with(['employee', 'user'])
            ->whereDate('date', $selectedDate)
            ->latest('check_in_time')
            ->get();

        // Total active employees count for attendance rate
        $activeEmployees = Employee::where('status', 'active')->get(['id', 'name', 'designation', 'avatar', 'user_id']);

        return Inertia::render('Attendance/Index', [
            'employee' => $employee,
            'todayAttendance' => $todayAttendance,
            'myAttendances' => $myAttendances,
            'myStats' => $myStats,
            'teamAttendances' => $teamAttendances,
            'activeEmployees' => $activeEmployees,
            'selectedDate' => $selectedDate,
            'todayDate' => $today,
            'isAdmin' => (bool) $user->is_admin,
        ]);
    }

    /**
     * Staff Check-in with Selfie and GPS Coordinates.
     */
    public function checkIn(Request $request): RedirectResponse
    {
        $user = $request->user();
        $employee = Employee::where('user_id', $user->id)
            ->orWhere('email', $user->email)
            ->first();

        $validated = $request->validate([
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'location_name' => 'nullable|string|max:255',
            'selfie' => 'required|string', // Base64 data URL
            'note' => 'nullable|string|max:500',
        ]);

        $today = now()->toDateString();

        // Check if already checked in today
        $existing = Attendance::where('user_id', $user->id)
            ->whereDate('date', $today)
            ->first();

        if ($existing && $existing->check_in_time) {
            return redirect()->back()->with('error', 'You have already checked in today at ' . Carbon::parse($existing->check_in_time)->format('h:i A'));
        }

        // Store selfie image from base64
        $selfieUrl = $this->saveSelfieImage($validated['selfie'], 'checkin', $user->id);

        $now = now();
        $checkInTime = $now->format('H:i:s');

        // Late threshold: after 09:45 AM is marked as late
        $status = $now->hour > 9 || ($now->hour === 9 && $now->minute > 45) ? 'late' : 'present';

        Attendance::updateOrCreate(
            [
                'user_id' => $user->id,
                'date' => $today,
            ],
            [
                'employee_id' => $employee?->id,
                'check_in_time' => $checkInTime,
                'check_in_latitude' => $validated['latitude'],
                'check_in_longitude' => $validated['longitude'],
                'check_in_location_name' => $validated['location_name'] ?? 'Office / Remote Location',
                'check_in_selfie' => $selfieUrl,
                'status' => $status,
                'check_in_note' => $validated['note'] ?? null,
            ]
        );

        return redirect()->back()->with('success', 'Checked in successfully at ' . $now->format('h:i A') . '! ' . ($status === 'late' ? '(Marked as Late Check-in)' : 'Have a productive day!'));
    }

    /**
     * Staff Check-out with GPS and optional Selfie.
     */
    public function checkOut(Request $request): RedirectResponse
    {
        $user = $request->user();
        $employee = Employee::where('user_id', $user->id)
            ->orWhere('email', $user->email)
            ->first();

        $validated = $request->validate([
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'location_name' => 'nullable|string|max:255',
            'selfie' => 'nullable|string', // Base64 data URL
            'note' => 'nullable|string|max:500',
        ]);

        $today = now()->toDateString();
        $attendance = Attendance::where('user_id', $user->id)
            ->whereDate('date', $today)
            ->first();

        if (!$attendance || !$attendance->check_in_time) {
            return redirect()->back()->with('error', 'Please check in first before checking out.');
        }

        if ($attendance->check_out_time) {
            return redirect()->back()->with('error', 'You have already checked out today at ' . Carbon::parse($attendance->check_out_time)->format('h:i A'));
        }

        $selfieUrl = null;
        if (!empty($validated['selfie'])) {
            $selfieUrl = $this->saveSelfieImage($validated['selfie'], 'checkout', $user->id);
        }

        $now = now();
        $checkOutTime = $now->format('H:i:s');

        // Calculate hours worked
        $checkInDateTime = Carbon::parse($today . ' ' . $attendance->check_in_time);
        $totalHours = round($checkInDateTime->diffInMinutes($now) / 60, 2);

        $status = $attendance->status;
        if ($totalHours < 4 && $status !== 'late') {
            $status = 'half_day';
        }

        $attendance->update([
            'check_out_time' => $checkOutTime,
            'check_out_latitude' => $validated['latitude'],
            'check_out_longitude' => $validated['longitude'],
            'check_out_location_name' => $validated['location_name'] ?? 'Office / Remote Location',
            'check_out_selfie' => $selfieUrl ?? $attendance->check_out_selfie,
            'check_out_note' => $validated['note'] ?? null,
            'total_hours' => $totalHours,
            'status' => $status,
        ]);

        return redirect()->back()->with('success', "Checked out successfully at {$now->format('h:i A')}. Total logged time: {$totalHours} hrs.");
    }

    /**
     * Decode base64 image and save to public storage disk.
     */
    private function saveSelfieImage(string $base64Data, string $type, int $userId): string
    {
        if (preg_match('/^data:image\/(\w+);base64,/', $base64Data, $typeMatch)) {
            $data = substr($base64Data, strpos($base64Data, ',') + 1);
            $typeExt = strtolower($typeMatch[1]); // jpg, png, jpeg, webp
            if (!in_array($typeExt, ['jpg', 'jpeg', 'png', 'webp'])) {
                $typeExt = 'jpg';
            }
            $data = base64_decode($data);
            if ($data === false) {
                return '';
            }
        } else {
            return '';
        }

        $fileName = 'attendance_' . $type . '_' . $userId . '_' . time() . '_' . Str::random(6) . '.' . $typeExt;
        $path = 'attendance/' . $fileName;

        Storage::disk('public')->put($path, $data);

        return '/storage/' . $path;
    }
}
