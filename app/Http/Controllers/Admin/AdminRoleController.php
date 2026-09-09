<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class AdminRoleController extends Controller
{
    public function index(): Response
    {
        $roles = Role::with(['permissions', 'users' => function ($q) {
            $q->select('id', 'name', 'email', 'role');
        }])->get()->map(function ($role) {
            return [
                'id' => $role->id,
                'name' => $role->name,
                'is_system' => in_array($role->name, ['Super Admin', 'Admin', 'Client']),
                'users_count' => $role->users->count(),
                'users' => $role->users->take(5)->map(fn ($u) => [
                    'id' => $u->id,
                    'name' => $u->name,
                    'email' => $u->email,
                ]),
                'permissions' => $role->permissions->pluck('name')->values()->toArray(),
            ];
        });

        // Group all available permissions by logical system modules
        $permissionGroups = [
            'Sales & Commerce' => [
                'view sales' => 'View Sales, Orders & Quotations',
                'manage sales' => 'Manage & Update Orders',
                'manage clients' => 'Create, Edit & Manage Clients',
                'manage quotes' => 'Respond & Convert Quotations',
                'manage subscriptions' => 'Manage Recurring Subscriptions',
                'manage users' => 'Manage Registered Website Users',
            ],
            'Team & Operations' => [
                'view staff' => 'View Team Members List',
                'manage staff' => 'Add, Edit & Manage Staff Profiles',
                'view tasks' => 'View Internal Tasks & Workflows',
                'manage tasks' => 'Create, Assign & Edit Tasks',
                'view work logs' => 'View Daily Work Logs',
                'manage work logs' => 'Evaluate & Review Work Logs',
            ],
            'HRM & Payroll' => [
                'view attendance' => 'View Staff Attendance & GPS Logs',
                'manage attendance' => 'Manage Attendance Records',
                'view leaves' => 'View Staff Leave Requests',
                'manage leaves' => 'Approve or Reject Leaves',
                'manage leave settings' => 'Configure Leave Types & Quotas',
                'view payroll' => 'View Staff Salaries & Payslips',
                'manage payroll' => 'Generate & Settle Payroll',
            ],
            'Frontend & Showcase' => [
                'manage frontend' => 'Manage Hero Banner, Trust Matrix & Socials',
                'manage services' => 'Manage Services & Products Catalog',
                'manage portfolio' => 'Manage Projects & Case Studies',
                'manage reviews' => 'Manage Testimonials & Client Reviews',
                'manage live chat' => 'Configure Live Chat Questions & Triggers',
            ],
            'Settings & System' => [
                'manage settings' => 'Configure Brand, SMS & Payment Gateways',
                'manage roles' => 'Manage System Roles & Permissions Matrix',
            ],
        ];

        return Inertia::render('Admin/Roles/Index', [
            'roles' => $roles,
            'permissionGroups' => $permissionGroups,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:roles,name',
            'permissions' => 'nullable|array',
            'permissions.*' => 'string|exists:permissions,name',
        ]);

        $role = Role::create([
            'name' => $validated['name'],
            'guard_name' => 'web',
        ]);

        if (!empty($validated['permissions'])) {
            $role->syncPermissions($validated['permissions']);
        }

        return back()->with('success', "Role '{$role->name}' created successfully with selected permissions.");
    }

    public function update(Request $request, Role $role): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:roles,name,' . $role->id,
            'permissions' => 'nullable|array',
            'permissions.*' => 'string|exists:permissions,name',
        ]);

        // Super Admin always keeps all permissions
        if ($role->name === 'Super Admin') {
            $role->syncPermissions(Permission::all());
            return back()->with('success', "Super Admin role holds universal system permissions.");
        }

        $role->name = $validated['name'];
        $role->save();

        if (isset($validated['permissions'])) {
            $role->syncPermissions($validated['permissions']);
        } else {
            $role->syncPermissions([]);
        }

        return back()->with('success', "Role '{$role->name}' updated successfully.");
    }

    public function destroy(Role $role): RedirectResponse
    {
        if (in_array($role->name, ['Super Admin', 'Admin', 'Client'])) {
            return back()->with('error', "Cannot delete protected system role '{$role->name}'.");
        }

        if ($role->users()->count() > 0) {
            return back()->with('error', "Cannot delete role '{$role->name}' because {$role->users()->count()} users are assigned to it.");
        }

        $roleName = $role->name;
        $role->delete();

        return back()->with('success', "Role '{$roleName}' deleted successfully.");
    }
}
