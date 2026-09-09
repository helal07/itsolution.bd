<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Department;
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
                    ->orWhere('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
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
        $availableDepartments = Department::where('status', 'active')->orderBy('name')->pluck('name');

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
            'availableDepartments' => $availableDepartments,
            'stats' => $stats,
            'filters' => $request->only(['search', 'department', 'status']),
        ]);
    }

    /**
     * Show the form for creating a new team member (Full Page).
     */
    public function create(): Response
    {
        $availableRoles = Role::where('name', '!=', 'Client')->get(['id', 'name']);
        $availableDepartments = Department::where('status', 'active')->orderBy('name')->pluck('name');

        return Inertia::render('Admin/Employees/Create', [
            'availableRoles' => $availableRoles,
            'availableDepartments' => $availableDepartments,
        ]);
    }

    /**
     * Store a newly created employee & optional user account with Role.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'prefix' => 'nullable|string|max:20',
            'first_name' => 'required|string|max:100',
            'last_name' => 'nullable|string|max:100',
            'name' => 'nullable|string|max:255',
            'username' => 'nullable|string|max:100|unique:users,email',
            'email' => 'required|email|max:255|unique:employees,email',
            'phone' => 'nullable|string|max:30',
            'alternate_phone' => 'nullable|string|max:30',
            'family_phone' => 'nullable|string|max:30',
            'designation' => 'required|string|max:255',
            'department' => 'required|string|max:100',
            'status' => 'required|in:active,inactive,on_leave',
            'salary' => 'nullable|numeric|min:0',
            'sales_commission_percentage' => 'nullable|numeric|min:0|max:100',
            'max_sales_discount_percent' => 'nullable|numeric|min:0|max:100',
            'joined_date' => 'nullable|date',
            'dob' => 'nullable|date',
            'gender' => 'nullable|string|max:20',
            'marital_status' => 'nullable|string|max:30',
            'blood_group' => 'nullable|string|max:10',
            'avatar' => 'nullable|string|max:2000',
            'avatar_file' => 'nullable|image|max:4096',
            'facebook_link' => 'nullable|string|max:255',
            'twitter_link' => 'nullable|string|max:255',
            'social_media_1' => 'nullable|string|max:255',
            'social_media_2' => 'nullable|string|max:255',
            'custom_field_1' => 'nullable|string|max:255',
            'custom_field_2' => 'nullable|string|max:255',
            'custom_field_3' => 'nullable|string|max:255',
            'custom_field_4' => 'nullable|string|max:255',
            'guardian_name' => 'nullable|string|max:255',
            'id_proof_name' => 'nullable|string|max:100',
            'id_proof_number' => 'nullable|string|max:100',
            'permanent_address' => 'nullable|string',
            'current_address' => 'nullable|string',
            'bank_account_holder_name' => 'nullable|string|max:255',
            'bank_account_number' => 'nullable|string|max:100',
            'bank_name' => 'nullable|string|max:255',
            'bank_identifier_code' => 'nullable|string|max:100',
            'bank_branch' => 'nullable|string|max:255',
            'tax_payer_id' => 'nullable|string|max:100',
            'allow_login' => 'nullable|boolean',
            'system_role' => 'nullable|string|exists:roles,name',
            'password' => 'nullable|string|min:6|confirmed',
        ]);

        $avatarUrl = $validated['avatar'] ?? null;
        if ($request->hasFile('avatar_file')) {
            $path = $request->file('avatar_file')->store('employees', 'public');
            $avatarUrl = '/storage/' . $path;
        }

        // Compute full display name
        $fullName = trim(($validated['first_name'] ?? '') . ' ' . ($validated['last_name'] ?? ''));
        if (empty($fullName)) {
            $fullName = $validated['name'] ?? 'Staff Member';
        }

        $userId = null;

        // Optionally provision User login account and attach Spatie Role
        if ($request->boolean('allow_login') && !empty($validated['password'])) {
            $selectedRole = $validated['system_role'] ?? 'Developer';
            $isAdminRole = in_array($selectedRole, ['Super Admin', 'Admin']);

            $user = User::create([
                'name' => $fullName,
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
            'prefix' => $validated['prefix'] ?? null,
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'] ?? null,
            'name' => $fullName,
            'username' => $validated['username'] ?? null,
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'alternate_phone' => $validated['alternate_phone'] ?? null,
            'family_phone' => $validated['family_phone'] ?? null,
            'designation' => $validated['designation'],
            'department' => $validated['department'],
            'status' => $validated['status'],
            'salary' => $validated['salary'] ?? null,
            'sales_commission_percentage' => $validated['sales_commission_percentage'] ?? null,
            'max_sales_discount_percent' => $validated['max_sales_discount_percent'] ?? null,
            'joined_date' => $validated['joined_date'] ?? now()->toDateString(),
            'dob' => $validated['dob'] ?? null,
            'gender' => $validated['gender'] ?? null,
            'marital_status' => $validated['marital_status'] ?? null,
            'blood_group' => $validated['blood_group'] ?? null,
            'avatar' => $avatarUrl,
            'facebook_link' => $validated['facebook_link'] ?? null,
            'twitter_link' => $validated['twitter_link'] ?? null,
            'social_media_1' => $validated['social_media_1'] ?? null,
            'social_media_2' => $validated['social_media_2'] ?? null,
            'custom_field_1' => $validated['custom_field_1'] ?? null,
            'custom_field_2' => $validated['custom_field_2'] ?? null,
            'custom_field_3' => $validated['custom_field_3'] ?? null,
            'custom_field_4' => $validated['custom_field_4'] ?? null,
            'guardian_name' => $validated['guardian_name'] ?? null,
            'id_proof_name' => $validated['id_proof_name'] ?? null,
            'id_proof_number' => $validated['id_proof_number'] ?? null,
            'permanent_address' => $validated['permanent_address'] ?? null,
            'current_address' => $validated['current_address'] ?? null,
            'bank_account_holder_name' => $validated['bank_account_holder_name'] ?? null,
            'bank_account_number' => $validated['bank_account_number'] ?? null,
            'bank_name' => $validated['bank_name'] ?? null,
            'bank_identifier_code' => $validated['bank_identifier_code'] ?? null,
            'bank_branch' => $validated['bank_branch'] ?? null,
            'tax_payer_id' => $validated['tax_payer_id'] ?? null,
            'user_id' => $userId,
        ]);

        return redirect()->route('admin.employees.index')->with('success', 'Team member added successfully with complete profile.');
    }

    /**
     * Show the form for editing the specified employee (Full Page).
     */
    public function edit(Employee $employee): Response
    {
        $employee->load('user.roles');
        $roleName = $employee->user?->roles->first()?->name;
        if (!$roleName && $employee->user) {
            $roleName = $employee->user->role === 'admin' ? 'Super Admin' : 'Staff';
        }
        $employee->system_role = $roleName;
        $employee->allow_login = !empty($employee->user_id);

        $availableRoles = Role::where('name', '!=', 'Client')->get(['id', 'name']);
        $availableDepartments = Department::where('status', 'active')->orderBy('name')->pluck('name');

        return Inertia::render('Admin/Employees/Edit', [
            'employee' => $employee,
            'availableRoles' => $availableRoles,
            'availableDepartments' => $availableDepartments,
        ]);
    }

    /**
     * Update the specified employee in storage and sync Role.
     */
    public function update(Request $request, Employee $employee): RedirectResponse
    {
        $validated = $request->validate([
            'prefix' => 'nullable|string|max:20',
            'first_name' => 'required|string|max:100',
            'last_name' => 'nullable|string|max:100',
            'name' => 'nullable|string|max:255',
            'username' => 'nullable|string|max:100',
            'email' => 'required|email|max:255|unique:employees,email,' . $employee->id,
            'phone' => 'nullable|string|max:30',
            'alternate_phone' => 'nullable|string|max:30',
            'family_phone' => 'nullable|string|max:30',
            'designation' => 'required|string|max:255',
            'department' => 'required|string|max:100',
            'status' => 'required|in:active,inactive,on_leave',
            'salary' => 'nullable|numeric|min:0',
            'sales_commission_percentage' => 'nullable|numeric|min:0|max:100',
            'max_sales_discount_percent' => 'nullable|numeric|min:0|max:100',
            'joined_date' => 'nullable|date',
            'dob' => 'nullable|date',
            'gender' => 'nullable|string|max:20',
            'marital_status' => 'nullable|string|max:30',
            'blood_group' => 'nullable|string|max:10',
            'avatar' => 'nullable|string|max:2000',
            'avatar_file' => 'nullable|image|max:4096',
            'facebook_link' => 'nullable|string|max:255',
            'twitter_link' => 'nullable|string|max:255',
            'social_media_1' => 'nullable|string|max:255',
            'social_media_2' => 'nullable|string|max:255',
            'custom_field_1' => 'nullable|string|max:255',
            'custom_field_2' => 'nullable|string|max:255',
            'custom_field_3' => 'nullable|string|max:255',
            'custom_field_4' => 'nullable|string|max:255',
            'guardian_name' => 'nullable|string|max:255',
            'id_proof_name' => 'nullable|string|max:100',
            'id_proof_number' => 'nullable|string|max:100',
            'permanent_address' => 'nullable|string',
            'current_address' => 'nullable|string',
            'bank_account_holder_name' => 'nullable|string|max:255',
            'bank_account_number' => 'nullable|string|max:100',
            'bank_name' => 'nullable|string|max:255',
            'bank_identifier_code' => 'nullable|string|max:100',
            'bank_branch' => 'nullable|string|max:255',
            'tax_payer_id' => 'nullable|string|max:100',
            'allow_login' => 'nullable|boolean',
            'system_role' => 'nullable|string|exists:roles,name',
            'password' => 'nullable|string|min:6|confirmed',
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

        $fullName = trim(($validated['first_name'] ?? '') . ' ' . ($validated['last_name'] ?? ''));
        if (empty($fullName)) {
            $fullName = $validated['name'] ?? $employee->name;
        }

        $selectedRole = $validated['system_role'] ?? null;
        $isAdminRole = $selectedRole && in_array($selectedRole, ['Super Admin', 'Admin']);

        // Handle user account updates or provisioning
        if ($employee->user) {
            $userUpdate = [
                'name' => $fullName,
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
        } elseif ($request->boolean('allow_login') && !empty($validated['password'])) {
            $user = User::firstOrCreate(
                ['email' => $validated['email']],
                [
                    'name' => $fullName,
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
            'prefix' => $validated['prefix'] ?? null,
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'] ?? null,
            'name' => $fullName,
            'username' => $validated['username'] ?? null,
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'alternate_phone' => $validated['alternate_phone'] ?? null,
            'family_phone' => $validated['family_phone'] ?? null,
            'designation' => $validated['designation'],
            'department' => $validated['department'],
            'status' => $validated['status'],
            'salary' => $validated['salary'] ?? null,
            'sales_commission_percentage' => $validated['sales_commission_percentage'] ?? null,
            'max_sales_discount_percent' => $validated['max_sales_discount_percent'] ?? null,
            'joined_date' => $validated['joined_date'] ?? $employee->joined_date,
            'dob' => $validated['dob'] ?? null,
            'gender' => $validated['gender'] ?? null,
            'marital_status' => $validated['marital_status'] ?? null,
            'blood_group' => $validated['blood_group'] ?? null,
            'avatar' => $avatarUrl,
            'facebook_link' => $validated['facebook_link'] ?? null,
            'twitter_link' => $validated['twitter_link'] ?? null,
            'social_media_1' => $validated['social_media_1'] ?? null,
            'social_media_2' => $validated['social_media_2'] ?? null,
            'custom_field_1' => $validated['custom_field_1'] ?? null,
            'custom_field_2' => $validated['custom_field_2'] ?? null,
            'custom_field_3' => $validated['custom_field_3'] ?? null,
            'custom_field_4' => $validated['custom_field_4'] ?? null,
            'guardian_name' => $validated['guardian_name'] ?? null,
            'id_proof_name' => $validated['id_proof_name'] ?? null,
            'id_proof_number' => $validated['id_proof_number'] ?? null,
            'permanent_address' => $validated['permanent_address'] ?? null,
            'current_address' => $validated['current_address'] ?? null,
            'bank_account_holder_name' => $validated['bank_account_holder_name'] ?? null,
            'bank_account_number' => $validated['bank_account_number'] ?? null,
            'bank_name' => $validated['bank_name'] ?? null,
            'bank_identifier_code' => $validated['bank_identifier_code'] ?? null,
            'bank_branch' => $validated['bank_branch'] ?? null,
            'tax_payer_id' => $validated['tax_payer_id'] ?? null,
        ]);

        return redirect()->route('admin.employees.index')->with('success', 'Team member profile updated successfully.');
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
