<?php

namespace Tests\Feature\Admin;

use App\Models\Employee;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminProfileTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;
    protected User $staffUser;
    protected Employee $employee;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create([
            'name' => 'Main Admin',
            'email' => 'admin@itsolutions.com',
            'phone' => '+880 1700-000001',
            'role' => 'admin',
            'password' => Hash::make('old-password'),
        ]);

        $this->staffUser = User::factory()->create([
            'name' => 'Staff Member',
            'email' => 'staff@itsolutions.com',
            'phone' => '+880 1800-000002',
            'role' => 'admin',
            'password' => Hash::make('old-password'),
        ]);

        $this->employee = Employee::create([
            'name' => 'Staff Member',
            'email' => 'staff@itsolutions.com',
            'phone' => '+880 1800-000002',
            'designation' => 'Senior Mobile Developer',
            'department' => 'Engineering',
            'status' => 'active',
            'user_id' => $this->staffUser->id,
        ]);
    }

    public function test_admin_can_view_profile_edit_page(): void
    {
        $response = $this->actingAs($this->admin)->get(route('admin.profile.edit'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Profile/Edit')
            ->has('user')
        );
    }

    public function test_staff_can_view_profile_edit_page_with_employee_details(): void
    {
        $response = $this->actingAs($this->staffUser)->get(route('admin.profile.edit'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Profile/Edit')
            ->has('user')
            ->where('employee.designation', 'Senior Mobile Developer')
        );
    }

    public function test_admin_can_update_profile_details(): void
    {
        $response = $this->actingAs($this->admin)->put(route('admin.profile.update'), [
            'name' => 'Updated Admin Name',
            'email' => 'admin_updated@itsolutions.com',
            'phone' => '+880 1711-222333',
            'designation' => 'Chief Technology Officer',
            'department' => 'Executive',
        ]);

        $response->assertRedirect(route('admin.profile.edit'));

        $this->assertDatabaseHas('users', [
            'id' => $this->admin->id,
            'name' => 'Updated Admin Name',
            'email' => 'admin_updated@itsolutions.com',
            'phone' => '+880 1711-222333',
        ]);
    }

    public function test_staff_profile_update_syncs_employee_record(): void
    {
        $response = $this->actingAs($this->staffUser)->put(route('admin.profile.update'), [
            'name' => 'Staff Lead Updated',
            'email' => 'staff_lead@itsolutions.com',
            'phone' => '+880 1999-888777',
            'designation' => 'Principal Architect',
            'department' => 'Cloud & DevOps',
        ]);

        $response->assertRedirect(route('admin.profile.edit'));

        $this->assertDatabaseHas('users', [
            'id' => $this->staffUser->id,
            'name' => 'Staff Lead Updated',
            'email' => 'staff_lead@itsolutions.com',
        ]);

        $this->assertDatabaseHas('employees', [
            'id' => $this->employee->id,
            'name' => 'Staff Lead Updated',
            'email' => 'staff_lead@itsolutions.com',
            'designation' => 'Principal Architect',
            'department' => 'Cloud & DevOps',
        ]);
    }

    public function test_admin_can_change_password(): void
    {
        $response = $this->actingAs($this->admin)->put(route('admin.profile.password'), [
            'current_password' => 'old-password',
            'password' => 'new-secure-password',
            'password_confirmation' => 'new-secure-password',
        ]);

        $response->assertRedirect(route('admin.profile.edit'));
        $this->assertTrue(Hash::check('new-secure-password', $this->admin->fresh()->password));
    }
}
