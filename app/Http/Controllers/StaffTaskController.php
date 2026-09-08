<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Task;
use App\Models\TaskStep;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StaffTaskController extends Controller
{
    /**
     * Display tasks assigned to the logged-in staff/user.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $employee = Employee::where('user_id', $user->id)
            ->orWhere('email', $user->email)
            ->first();

        $employeeId = $employee?->id;

        $tasksQuery = Task::with([
            'assignee',
            'steps.assignee',
            'item',
        ]);

        if ($employeeId) {
            $tasksQuery->where(function ($q) use ($employeeId) {
                $q->where('assigned_to', $employeeId)
                  ->orWhereHas('steps', fn($sq) => $sq->where('assigned_to', $employeeId));
            });
        } elseif ($user->role !== 'admin') {
            // Unlinked user with no employee record
            $tasksQuery->whereRaw('1 = 0');
        }

        if ($request->filled('status') && $request->status !== 'all') {
            $tasksQuery->where('status', $request->status);
        }

        $tasks = $tasksQuery->orderByRaw("CASE 
                WHEN status = 'in_progress' THEN 1 
                WHEN status = 'pending' THEN 2 
                WHEN status = 'completed' THEN 3 
                ELSE 4 
            END")
            ->orderBy('due_date', 'asc')
            ->get();

        $stats = [
            'total' => $tasks->count(),
            'in_progress' => $tasks->where('status', 'in_progress')->count(),
            'pending' => $tasks->where('status', 'pending')->count(),
            'completed' => $tasks->where('status', 'completed')->count(),
        ];

        return Inertia::render('Staff/MyTasks', [
            'tasks' => $tasks,
            'stats' => $stats,
            'employee' => $employee,
            'filters' => $request->only(['status']),
        ]);
    }

    /**
     * Staff updates status of a task assigned to them.
     */
    public function updateStatus(Request $request, Task $task): RedirectResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,in_progress,completed',
        ]);

        $task->status = $validated['status'];
        if ($validated['status'] === 'completed') {
            $task->progress = 100;
        }
        $task->save();

        return redirect()->back()->with('success', 'Task status updated.');
    }

    /**
     * Staff toggles completion of a checklist step.
     */
    public function toggleStep(Request $request, TaskStep $step): RedirectResponse
    {
        $step->is_completed = !$step->is_completed;
        $step->completed_at = $step->is_completed ? now() : null;
        $step->completed_by = $step->is_completed ? $request->user()->id : null;
        $step->save();

        $task = $step->task;
        $task->recalculateProgress();

        return redirect()->back()->with('success', 'Step updated.');
    }
}
