<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\Item;
use App\Models\Task;
use App\Models\TaskStep;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminTaskController extends Controller
{
    /**
     * Display a listing of all tasks and subtasks.
     */
    public function index(Request $request): Response
    {
        $query = Task::with([
            'assignee',
            'steps.assignee',
            'item',
            'client',
        ]);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhereHas('assignee', fn($aq) => $aq->where('name', 'like', "%{$search}%"))
                  ->orWhereHas('steps', fn($sq) => $sq->where('title', 'like', "%{$search}%"));
            });
        }

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->filled('priority') && $request->priority !== 'all') {
            $query->where('priority', $request->priority);
        }

        if ($request->filled('assigned_to') && $request->assigned_to !== 'all') {
            if ($request->assigned_to === 'unassigned') {
                $query->whereNull('assigned_to');
            } else {
                $query->where('assigned_to', $request->assigned_to);
            }
        }

        $tasks = $query->orderByRaw("CASE 
                WHEN status = 'in_progress' THEN 1 
                WHEN status = 'pending' THEN 2 
                WHEN status = 'completed' THEN 3 
                ELSE 4 
            END")
            ->orderBy('due_date', 'asc')
            ->orderBy('id', 'desc')
            ->paginate(25)
            ->withQueryString();

        $employees = Employee::where('status', 'active')
            ->orderBy('name', 'asc')
            ->get(['id', 'name', 'designation', 'avatar']);

        $items = Item::where('status', 'published')
            ->orderBy('name', 'asc')
            ->get(['id', 'name', 'slug']);

        $stats = [
            'total' => Task::count(),
            'open' => Task::whereIn('status', ['pending', 'in_progress'])->count(),
            'completed' => Task::where('status', 'completed')->count(),
            'urgent' => Task::where('priority', 'urgent')->where('status', '!=', 'completed')->count(),
            'unassigned' => Task::whereNull('assigned_to')->count(),
        ];

        return Inertia::render('Admin/Tasks/Index', [
            'tasks' => $tasks,
            'employees' => $employees,
            'items' => $items,
            'stats' => $stats,
            'filters' => $request->only(['search', 'status', 'priority', 'assigned_to']),
        ]);
    }

    /**
     * Store a newly created task with optional subtasks.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'assigned_to' => 'nullable|exists:employees,id',
            'priority' => 'required|in:low,medium,high,urgent',
            'status' => 'required|in:pending,in_progress,completed,cancelled',
            'due_date' => 'nullable|date',
            'item_id' => 'nullable|exists:items,id',
            'steps' => 'nullable|array',
            'steps.*.title' => 'required|string|max:255',
            'steps.*.assigned_to' => 'nullable|exists:employees,id',
        ]);

        $task = Task::create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'assigned_to' => $validated['assigned_to'] ?? null,
            'created_by' => $request->user()->id,
            'priority' => $validated['priority'],
            'status' => $validated['status'],
            'progress' => 0,
            'due_date' => $validated['due_date'] ?? null,
            'item_id' => $validated['item_id'] ?? null,
        ]);

        if (!empty($validated['steps']) && is_array($validated['steps'])) {
            foreach ($validated['steps'] as $index => $stepData) {
                if (!empty(trim($stepData['title'] ?? ''))) {
                    TaskStep::create([
                        'task_id' => $task->id,
                        'title' => trim($stepData['title']),
                        'assigned_to' => $stepData['assigned_to'] ?? $task->assigned_to,
                        'is_completed' => false,
                        'sort_order' => $index,
                    ]);
                }
            }
        }

        return redirect()->back()->with('success', "Task '{$task->title}' assigned successfully.");
    }

    /**
     * Update task details.
     */
    public function update(Request $request, Task $task): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'assigned_to' => 'nullable|exists:employees,id',
            'priority' => 'required|in:low,medium,high,urgent',
            'status' => 'required|in:pending,in_progress,completed,cancelled',
            'progress' => 'nullable|integer|min:0|max:100',
            'due_date' => 'nullable|date',
            'item_id' => 'nullable|exists:items,id',
        ]);

        $task->update($validated);

        if (isset($validated['status']) && $validated['status'] === 'completed') {
            $task->update(['progress' => 100]);
        }

        return redirect()->back()->with('success', 'Task updated successfully.');
    }

    /**
     * Delete a task.
     */
    public function destroy(Task $task): RedirectResponse
    {
        $title = $task->title;
        $task->delete();

        return redirect()->back()->with('success', "Task '{$title}' deleted successfully.");
    }

    /**
     * Store a new subtask step inside a task.
     */
    public function storeStep(Request $request, Task $task): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'assigned_to' => 'nullable|exists:employees,id',
        ]);

        $order = $task->steps()->count();

        TaskStep::create([
            'task_id' => $task->id,
            'title' => $validated['title'],
            'assigned_to' => $validated['assigned_to'] ?? $task->assigned_to,
            'is_completed' => false,
            'sort_order' => $order,
        ]);

        $task->recalculateProgress();

        return redirect()->back()->with('success', 'Step added.');
    }

    /**
     * Toggle a subtask step completion.
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

    /**
     * Delete a subtask step.
     */
    public function destroyStep(TaskStep $step): RedirectResponse
    {
        $task = $step->task;
        $step->delete();
        $task->recalculateProgress();

        return redirect()->back()->with('success', 'Step removed.');
    }
}
