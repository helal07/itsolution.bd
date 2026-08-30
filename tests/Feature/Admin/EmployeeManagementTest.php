<?php

namespace Tests\Feature\Admin;

use App\Models\Employee;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EmployeeManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_view_employees_list(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        Employee::create([
            'name' => 'John Doe',
            'email' => 'john.doe@test.com',
            'designation' => 'Mobile Dev',
            'department' => 'Engineering',
            'status' => 'active',
        ]);

        $response = $this->actingAs($admin)->get('/admin/employees');

        $response->assertStatus(200);
    }

    public function test_admin_can_create_new_employee_and_user_account(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)->post('/admin/employees', [
            'name' => 'Jane Smith',
            'email' => 'jane.smith@test.com',
            'phone' => '+8801700000000',
            'designation' => 'Security Analyst',
            'department' => 'Cyber Security',
            'status' => 'active',
            'salary' => 90000,
            'joined_date' => '2026-01-01',
            'create_user_account' => true,
            'password' => 'secret123',
            'user_role' => 'admin',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('employees', ['email' => 'jane.smith@test.com']);
        $this->assertDatabaseHas('users', ['email' => 'jane.smith@test.com', 'role' => 'admin']);
    }

    public function test_admin_can_update_employee(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $employee = Employee::create([
            'name' => 'Old Name',
            'email' => 'old@test.com',
            'designation' => 'Junior Dev',
            'department' => 'Engineering',
            'status' => 'active',
        ]);

        $response = $this->actingAs($admin)->put("/admin/employees/{$employee->id}", [
            'name' => 'Updated Name',
            'email' => 'old@test.com',
            'designation' => 'Senior Dev',
            'department' => 'Engineering',
            'status' => 'active',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('employees', [
            'id' => $employee->id,
            'name' => 'Updated Name',
            'designation' => 'Senior Dev',
        ]);
    }

    public function test_admin_can_delete_employee(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $employee = Employee::create([
            'name' => 'To Delete',
            'email' => 'delete@test.com',
            'designation' => 'QA',
            'department' => 'Engineering',
            'status' => 'active',
        ]);

        $response = $this->actingAs($admin)->delete("/admin/employees/{$employee->id}");

        $response->assertRedirect();
        $this->assertDatabaseMissing('employees', ['id' => $employee->id]);
    }
}
