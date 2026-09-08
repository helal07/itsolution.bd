<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DailyWorkLog;
use App\Models\Employee;
use App\Models\Task;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminWorkLogController extends Controller
{
    /**
     * Display listing of all staff daily work logs and activity matrix.
     */
    public function index(Request $request): Response
    {
        $query = DailyWorkLog::with(['user', 'employee'])->latest('log_date');

        if ($request->filled('employee_id') && $request->employee_id !== 'all') {
            $query->where('employee_id', $request->employee_id);
        }

        if ($request->filled('date')) {
            $query->whereDate('log_date', $request->date);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('tasks_summary', 'like', "%{$search}%")
                  ->orWhere('client_feedbacks', 'like', "%{$search}%")
                  ->orWhere('challenges_notes', 'like', "%{$search}%")
                  ->orWhereHas('employee', fn($eq) => $eq->where('name', 'like', "%{$search}%"));
            });
        }

        $logs = $query->paginate(20)->withQueryString();

        // Load referenced completed tasks info
        $allCompletedTaskIds = collect($logs->items())->pluck('completed_task_ids')->flatten()->filter()->unique()->values();
        $completedTasksMap = Task::whereIn('id', $allCompletedTaskIds)->get(['id', 'title', 'priority', 'status'])->keyBy('id');

        $logs->getCollection()->transform(function ($log) use ($completedTasksMap) {
            $taskIds = is_array($log->completed_task_ids) ? $log->completed_task_ids : [];
            $log->completed_tasks = collect($taskIds)->map(fn($id) => $completedTasksMap->get($id))->filter()->values();
            return $log;
        });

        $employees = Employee::where('status', 'active')->orderBy('name', 'asc')->get(['id', 'name', 'designation', 'avatar']);

        $today = now()->toDateString();
        $stats = [
            'today_submissions' => DailyWorkLog::whereDate('log_date', $today)->count(),
            'today_calls' => (int) DailyWorkLog::whereDate('log_date', $today)->sum('calls_count'),
            'today_hours' => (float) DailyWorkLog::whereDate('log_date', $today)->sum('hours_worked'),
            'total_active_staff' => Employee::where('status', 'active')->count(),
        ];

        return Inertia::render('Admin/WorkLogs/Index', [
            'logs' => $logs,
            'employees' => $employees,
            'stats' => $stats,
            'filters' => $request->only(['employee_id', 'date', 'search']),
        ]);
    }

    /**
     * Admin adds feedback/review notes to a staff daily log.
     */
    public function updateNotes(Request $request, DailyWorkLog $log): RedirectResponse
    {
        $validated = $request->validate([
            'admin_notes' => 'nullable|string|max:2000',
        ]);

        $log->update($validated);

        return redirect()->back()->with('success', 'Admin evaluation updated.');
    }
}
