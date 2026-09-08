<?php

namespace App\Http\Controllers;

use App\Models\DailyWorkLog;
use App\Models\Employee;
use App\Models\Task;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DailyWorkLogController extends Controller
{
    /**
     * Display staff's daily log submission form and recent logs history.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $employee = Employee::where('user_id', $user->id)
            ->orWhere('email', $user->email)
            ->first();

        $today = now()->toDateString();
        $todayLog = DailyWorkLog::where('user_id', $user->id)
            ->whereDate('log_date', $today)
            ->first();

        // Get past logs for this user
        $pastLogs = DailyWorkLog::where('user_id', $user->id)
            ->latest('log_date')
            ->take(15)
            ->get();

        // Available active tasks for this employee to check off in today's report
        $activeTasks = Task::where(function ($q) use ($employee) {
                if ($employee) {
                    $q->where('assigned_to', $employee->id)
                      ->orWhereHas('steps', fn($sq) => $sq->where('assigned_to', $employee->id));
                }
            })
            ->where('status', '!=', 'cancelled')
            ->get(['id', 'title', 'priority', 'status', 'progress']);

        return Inertia::render('Staff/DailyLog', [
            'todayLog' => $todayLog,
            'pastLogs' => $pastLogs,
            'activeTasks' => $activeTasks,
            'employee' => $employee,
            'todayDate' => $today,
        ]);
    }

    /**
     * Submit or update today's daily activity log.
     */
    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();
        $employee = Employee::where('user_id', $user->id)
            ->orWhere('email', $user->email)
            ->first();

        $validated = $request->validate([
            'log_date' => 'required|date',
            'calls_count' => 'nullable|integer|min:0',
            'call_logs' => 'nullable|array',
            'call_logs.*.client_name' => 'nullable|string|max:150',
            'call_logs.*.phone' => 'nullable|string|max:50',
            'call_logs.*.discussion' => 'nullable|string|max:2000',
            'call_logs.*.follow_up_date' => 'nullable|date',
            'assigned_task_logs' => 'nullable|array',
            'assigned_task_logs.*.task_id' => 'nullable|exists:tasks,id',
            'assigned_task_logs.*.task_title' => 'nullable|string|max:255',
            'assigned_task_logs.*.status' => 'nullable|string|max:50',
            'assigned_task_logs.*.remarks' => 'nullable|string|max:2000',
            'other_work_logs' => 'nullable|array',
            'other_work_logs.*.title' => 'nullable|string|max:255',
            'other_work_logs.*.description' => 'nullable|string|max:2000',
            'other_work_logs.*.time_spent' => 'nullable|string|max:50',
            'client_feedbacks' => 'nullable|string|max:5000',
            'tasks_summary' => 'nullable|string|max:5000',
            'completed_task_ids' => 'nullable|array',
            'completed_task_ids.*' => 'exists:tasks,id',
            'hours_worked' => 'required|numeric|min:0.5|max:24',
            'challenges_notes' => 'nullable|string|max:2000',
        ]);

        // Filter clean call logs
        $callLogs = array_values(array_filter($validated['call_logs'] ?? [], function ($c) {
            return !empty(trim($c['client_name'] ?? '')) || !empty(trim($c['phone'] ?? '')) || !empty(trim($c['discussion'] ?? ''));
        }));

        // Filter clean assigned task logs
        $assignedTaskLogs = array_values(array_filter($validated['assigned_task_logs'] ?? [], function ($t) {
            return !empty($t['task_id']) || !empty(trim($t['remarks'] ?? ''));
        }));

        // Filter clean other work logs
        $otherWorkLogs = array_values(array_filter($validated['other_work_logs'] ?? [], function ($o) {
            return !empty(trim($o['title'] ?? '')) || !empty(trim($o['description'] ?? ''));
        }));

        $callsCount = count($callLogs) > 0 ? count($callLogs) : ($validated['calls_count'] ?? 0);

        // Build fallback summary if empty
        $tasksSummary = $validated['tasks_summary'] ?? '';
        if (empty($tasksSummary)) {
            $summaryParts = [];
            if (!empty($assignedTaskLogs)) {
                $summaryParts[] = "Assigned Tasks:\n" . implode("\n", array_map(fn($t) => "- " . ($t['task_title'] ?? 'Task') . ": " . ($t['remarks'] ?? 'Done'), $assignedTaskLogs));
            }
            if (!empty($otherWorkLogs)) {
                $summaryParts[] = "Other Work:\n" . implode("\n", array_map(fn($o) => "- " . ($o['title'] ?? 'Work') . ": " . ($o['description'] ?? ''), $otherWorkLogs));
            }
            $tasksSummary = implode("\n\n", $summaryParts) ?: 'Daily activities logged.';
        }

        $log = DailyWorkLog::updateOrCreate(
            [
                'user_id' => $user->id,
                'log_date' => $validated['log_date'],
            ],
            [
                'employee_id' => $employee?->id,
                'calls_count' => $callsCount,
                'call_logs' => $callLogs,
                'assigned_task_logs' => $assignedTaskLogs,
                'other_work_logs' => $otherWorkLogs,
                'client_feedbacks' => $validated['client_feedbacks'] ?? null,
                'tasks_summary' => $tasksSummary,
                'completed_task_ids' => $validated['completed_task_ids'] ?? [],
                'hours_worked' => $validated['hours_worked'],
                'challenges_notes' => $validated['challenges_notes'] ?? null,
            ]
        );

        return redirect()->back()->with('success', 'Daily work log submitted successfully! Thank you for updating your progress.');
    }
}
