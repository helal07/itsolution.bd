<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class AdminEmployeeController extends Controller
{
    /**
     * Display a listing of employees and team members.
     */
    public function index(Request $request): Response
    {
        $query = Employee::with(['user.roles'])->latest();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('designation', 'like', "%{$search}%")
                    ->orWhere('department', 'like', "%{$search}%");
            });
        }

        if ($request->filled('department') && $request->department !== 'all') {
            $query->where('department', $request->department);
        }

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $employees = $query->paginate(20)->withQueryString();

        // Attach primary role name to each employee
        $employees->getCollection()->transform(function ($emp) {
            $roleName = $emp->user?->roles->first()?->name;
            if (!$roleName && $emp->user) {
                $roleName = $emp->user->role === 'admin' ? 'Super Admin' : 'Staff';
            }
            $emp->system_role = $roleName;
            return $emp;
        });

        // Get all staff roles available for assignment (excluding Client)
        $availableRoles = Role::where('name', '!=', 'Client')->get(['id', 'name']);

        // Department statistics & Monthly Payroll
        $stats = [
            'total' => Employee::count(),
            'active' => Employee::where('status', 'active')->count(),
            'on_leave' => Employee::where('status', 'on_leave')->count(),
            'engineering' => Employee::whereIn('department', ['Engineering', 'Mobile Development', 'Cloud & DevOps'])->count(),
            'security' => Employee::where('department', 'Cyber Security')->count(),
            'admin_accounts' => User::where('role', 'admin')->count(),
            'monthly_payroll' => (float) Employee::where('status', 'active')->sum('salary'),
        ];

        return Inertia::render('Admin/Employees/Index', [
            'employees' => $employees,
            'availableRoles' => $availableRoles,
            'stats' => $stats,
            'filters' => $request->only(['search', 'department', 'status']),
        ]);
    }

    /**
     * Store a newly created employee & optional user account with Role.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:employees,email',
            'phone' => 'nullable|string|max:30',
            'designation' => 'required|string|max:255',
            'department' => 'required|string|max:100',
            'status' => 'required|in:active,inactive,on_leave',
            'salary' => 'nullable|numeric|min:0',
            'joined_date' => 'nullable|date',
            'avatar' => 'nullable|string|max:2000',
            'avatar_file' => 'nullable|image|max:4096',
            'create_user_account' => 'boolean',
            'system_role' => 'nullable|string|exists:roles,name',
            'password' => 'nullable|string|min:6',
        ]);

        $avatarUrl = $validated['avatar'] ?? null;
        if ($request->hasFile('avatar_file')) {
            $path = $request->file('avatar_file')->store('employees', 'public');
            $avatarUrl = '/storage/' . $path;
        }

        $userId = null;

        // Optionally create user account for system login and attach Spatie Role
        if ($request->boolean('create_user_account') && !empty($validated['password'])) {
            $selectedRole = $validated['system_role'] ?? 'Developer';
            $isAdminRole = in_array($selectedRole, ['Super Admin', 'Admin']);

            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'] ?? null,
                'password' => Hash::make($validated['password']),
                'role' => $isAdminRole ? 'admin' : 'staff',
                'email_verified_at' => now(),
            ]);

            $user->assignRole($selectedRole);
            $userId = $user->id;
        }

        Employee::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'designation' => $validated['designation'],
            'department' => $validated['department'],
            'status' => $validated['status'],
            'salary' => $validated['salary'] ?? null,
            'joined_date' => $validated['joined_date'] ?? now()->toDateString(),
            'avatar' => $avatarUrl,
            'user_id' => $userId,
        ]);

        return redirect()->back()->with('success', 'Team member added successfully.');
    }

    /**
     * Update the specified employee in storage and sync Role.
     */
    public function update(Request $request, Employee $employee): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:employees,email,' . $employee->id,
            'phone' => 'nullable|string|max:30',
            'designation' => 'required|string|max:255',
            'department' => 'required|string|max:100',
            'status' => 'required|in:active,inactive,on_leave',
            'salary' => 'nullable|numeric|min:0',
            'joined_date' => 'nullable|date',
            'avatar' => 'nullable|string|max:2000',
            'avatar_file' => 'nullable|image|max:4096',
            'system_role' => 'nullable|string|exists:roles,name',
            'grant_access' => 'nullable|boolean',
            'password' => 'nullable|string|min:6',
        ]);

        $avatarUrl = $employee->avatar;
        if ($request->hasFile('avatar_file')) {
            if ($employee->avatar && str_starts_with($employee->avatar, '/storage/employees/')) {
                $oldPath = str_replace('/storage/', '', $employee->avatar);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('avatar_file')->store('employees', 'public');
            $avatarUrl = '/storage/' . $path;
        } elseif ($request->filled('avatar')) {
            $avatarUrl = $validated['avatar'];
        }

        $selectedRole = $validated['system_role'] ?? null;
        $isAdminRole = $selectedRole && in_array($selectedRole, ['Super Admin', 'Admin']);

        // If employee has associated user, update details and sync Spatie Role
        if ($employee->user) {
            $userUpdate = [
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'] ?? null,
            ];

            if ($selectedRole) {
                $userUpdate['role'] = $isAdminRole ? 'admin' : 'staff';
                $employee->user->syncRoles([$selectedRole]);
            }

            if (!empty($validated['password'])) {
                $userUpdate['password'] = Hash::make($validated['password']);
            }

            $employee->user->update($userUpdate);
        } elseif (($request->boolean('grant_access') || !empty($selectedRole)) && !empty($validated['password'])) {
            // Provision new user account
            $user = User::firstOrCreate(
                ['email' => $validated['email']],
                [
                    'name' => $validated['name'],
                    'phone' => $validated['phone'] ?? null,
                    'password' => Hash::make($validated['password']),
                    'role' => $isAdminRole ? 'admin' : 'staff',
                    'email_verified_at' => now(),
                ]
            );

            if ($selectedRole) {
                $user->syncRoles([$selectedRole]);
            } else {
                $user->assignRole('Developer');
            }

            $employee->user_id = $user->id;
        }

        $employee->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'designation' => $validated['designation'],
            'department' => $validated['department'],
            'status' => $validated['status'],
            'salary' => $validated['salary'] ?? null,
            'joined_date' => $validated['joined_date'] ?? $employee->joined_date,
            'avatar' => $avatarUrl,
        ]);

        return redirect()->back()->with('success', 'Team member details updated successfully.');
    }

    /**
     * Remove the specified employee from storage.
     */
    public function destroy(Employee $employee): RedirectResponse
    {
        if ($employee->avatar && str_starts_with($employee->avatar, '/storage/employees/')) {
            $oldPath = str_replace('/storage/', '', $employee->avatar);
            Storage::disk('public')->delete($oldPath);
        }

        $employee->delete();
        return redirect()->back()->with('success', 'Team member removed successfully.');
    }
}
