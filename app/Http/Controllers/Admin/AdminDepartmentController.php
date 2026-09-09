<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\Employee;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminDepartmentController extends Controller
{
    /**
     * Display a listing of departments.
     */
    public function index(Request $request): Response
    {
        $query = Department::withCount('employees')->latest();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('head_name', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $departments = $query->get();

        // Calculate statistics
        $stats = [
            'total' => Department::count(),
            'active' => Department::where('status', 'active')->count(),
            'total_staff' => Employee::count(),
        ];

        return Inertia::render('Admin/Departments/Index', [
            'departments' => $departments,
            'stats' => $stats,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Store a newly created department.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:departments,name',
            'code' => 'nullable|string|max:20',
            'description' => 'nullable|string|max:1000',
            'head_name' => 'nullable|string|max:150',
            'status' => 'required|in:active,inactive',
        ]);

        Department::create($validated);

        return redirect()->back()->with('success', "Department '{$validated['name']}' created successfully.");
    }

    /**
     * Update the specified department.
     */
    public function update(Request $request, Department $department): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:departments,name,' . $department->id,
            'code' => 'nullable|string|max:20',
            'description' => 'nullable|string|max:1000',
            'head_name' => 'nullable|string|max:150',
            'status' => 'required|in:active,inactive',
        ]);

        $oldName = $department->name;
        $department->update($validated);

        // If department name changed, update corresponding employee records
        if ($oldName !== $validated['name']) {
            Employee::where('department', $oldName)->update(['department' => $validated['name']]);
        }

        return redirect()->back()->with('success', "Department '{$department->name}' updated successfully.");
    }

    /**
     * Remove the specified department from storage.
     */
    public function destroy(Department $department): RedirectResponse
    {
        // Reassign or check employees count
        $staffCount = Employee::where('department', $department->name)->count();
        if ($staffCount > 0) {
            return redirect()->back()->with('error', "Cannot delete department '{$department->name}' because {$staffCount} active staff member(s) are assigned to it.");
        }

        $department->delete();
        return redirect()->back()->with('success', "Department '{$department->name}' removed successfully.");
    }
}
