<?php

namespace Database\Seeders;

use App\Models\Employee;
use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // Standard Granular Permissions Grouped by Modules
        $permissions = [
            // Sales & Commerce
            'view sales',
            'manage sales',
            'manage clients',
            'manage quotes',
            'manage subscriptions',
            'manage users',

            // Team & Operations
            'view staff',
            'manage staff',
            'view tasks',
            'manage tasks',
            'view work logs',
            'manage work logs',

            // HRM & Payroll
            'view attendance',
            'manage attendance',
            'view leaves',
            'manage leaves',
            'manage leave settings',
            'view payroll',
            'manage payroll',

            // Frontend & Showcase
            'manage frontend',
            'manage services',
            'manage portfolio',
            'manage reviews',
            'manage live chat',

            // Settings & System
            'manage settings',
            'manage roles',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        // Define Standard Roles
        $superAdminRole = Role::firstOrCreate(['name' => 'Super Admin', 'guard_name' => 'web']);
        $adminRole = Role::firstOrCreate(['name' => 'Admin', 'guard_name' => 'web']);
        $pmRole = Role::firstOrCreate(['name' => 'Project Manager', 'guard_name' => 'web']);
        $devRole = Role::firstOrCreate(['name' => 'Developer', 'guard_name' => 'web']);
        $designerRole = Role::firstOrCreate(['name' => 'Designer', 'guard_name' => 'web']);
        $hrAccountsRole = Role::firstOrCreate(['name' => 'HR & Accounts', 'guard_name' => 'web']);
        $clientRole = Role::firstOrCreate(['name' => 'Client', 'guard_name' => 'web']);

        // Assign Permissions to Roles
        $superAdminRole->syncPermissions(Permission::all());

        $adminRole->syncPermissions([
            'view sales', 'manage sales', 'manage clients', 'manage quotes', 'manage subscriptions', 'manage users',
            'view staff', 'manage staff', 'view tasks', 'manage tasks', 'view work logs', 'manage work logs',
            'view attendance', 'manage attendance', 'view leaves', 'manage leaves', 'manage leave settings',
            'view payroll', 'manage payroll',
            'manage frontend', 'manage services', 'manage portfolio', 'manage reviews', 'manage live chat',
            'manage settings', 'manage roles',
        ]);

        $pmRole->syncPermissions([
            'view sales', 'manage sales', 'manage clients', 'manage quotes',
            'view staff', 'view tasks', 'manage tasks', 'view work logs', 'manage work logs',
            'view attendance', 'view leaves',
            'manage frontend', 'manage services', 'manage portfolio', 'manage reviews', 'manage live chat',
        ]);

        $devRole->syncPermissions([
            'view tasks',
            'view work logs',
            'view attendance',
            'view leaves',
            'manage portfolio',
        ]);

        $designerRole->syncPermissions([
            'view tasks',
            'view work logs',
            'view attendance',
            'view leaves',
            'manage portfolio',
            'manage frontend',
        ]);

        $hrAccountsRole->syncPermissions([
            'view staff', 'manage staff',
            'view work logs',
            'view attendance', 'manage attendance',
            'view leaves', 'manage leaves', 'manage leave settings',
            'view payroll', 'manage payroll',
        ]);

        // Client role has no administrative permissions
        $clientRole->syncPermissions([]);

        // Sync existing Users with Roles
        $users = User::all();
        foreach ($users as $user) {
            if ($user->role === 'admin') {
                $user->assignRole($superAdminRole);
            } elseif ($user->employee || Employee::where('user_id', $user->id)->orWhere('email', $user->email)->exists()) {
                // Staff member fallback
                $emp = Employee::where('user_id', $user->id)->orWhere('email', $user->email)->first();
                $designation = strtolower($emp->designation ?? '');
                
                if (str_contains($designation, 'dev') || str_contains($designation, 'engineer') || str_contains($designation, 'program')) {
                    $user->assignRole($devRole);
                } elseif (str_contains($designation, 'design') || str_contains($designation, 'ui') || str_contains($designation, 'ux')) {
                    $user->assignRole($designerRole);
                } elseif (str_contains($designation, 'manager') || str_contains($designation, 'pm') || str_contains($designation, 'lead')) {
                    $user->assignRole($pmRole);
                } elseif (str_contains($designation, 'hr') || str_contains($designation, 'account')) {
                    $user->assignRole($hrAccountsRole);
                } else {
                    $user->assignRole($devRole);
                }
            } else {
                $user->assignRole($clientRole);
            }
        }
    }
}
