<?php

namespace Tests\Feature;

use App\Models\Attendance;
use App\Models\Employee;
use App\Models\Leave;
use App\Models\Salary;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AttendanceAndLeaveTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('public');
    }

    public function test_staff_can_view_attendance_dashboard()
    {
        $user = User::factory()->create(['role' => 'client']);
        $employee = Employee::create([
            'name' => 'Rahim Ahmed',
            'email' => $user->email,
            'user_id' => $user->id,
            'designation' => 'Senior Developer',
            'salary' => 30000,
            'status' => 'active',
        ]);

        $response = $this->actingAs($user)->get('/attendance');
        $response->assertStatus(200);
    }

    public function test_staff_can_check_in_with_selfie_and_gps()
    {
        $user = User::factory()->create();
        $employee = Employee::create([
            'name' => 'Karim Hasan',
            'email' => $user->email,
            'user_id' => $user->id,
            'designation' => 'UI/UX Designer',
            'salary' => 25000,
            'status' => 'active',
        ]);

        // 1x1 transparent png in base64
        $fakeSelfie = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

        $response = $this->actingAs($user)->post('/attendance/check-in', [
            'latitude' => 23.8103,
            'longitude' => 90.4125,
            'location_name' => 'Dhaka Office',
            'selfie' => $fakeSelfie,
            'note' => 'Starting work today',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('attendances', [
            'user_id' => $user->id,
            'employee_id' => $employee->id,
            'check_in_latitude' => 23.8103,
            'check_in_longitude' => 90.4125,
        ]);
    }

    public function test_staff_can_check_out()
    {
        $user = User::factory()->create();
        $employee = Employee::create([
            'name' => 'Karim Hasan',
            'email' => $user->email,
            'user_id' => $user->id,
            'designation' => 'UI/UX Designer',
            'salary' => 25000,
            'status' => 'active',
        ]);

        Attendance::create([
            'user_id' => $user->id,
            'employee_id' => $employee->id,
            'date' => now()->toDateString(),
            'check_in_time' => '09:00:00',
            'check_in_latitude' => 23.8103,
            'check_in_longitude' => 90.4125,
            'status' => 'present',
        ]);

        $response = $this->actingAs($user)->post('/attendance/check-out', [
            'latitude' => 23.8103,
            'longitude' => 90.4125,
            'location_name' => 'Dhaka Office',
            'note' => 'Shift ended',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $attendance = Attendance::where('user_id', $user->id)->first();
        $this->assertNotNull($attendance->check_out_time);
        $this->assertNotNull($attendance->total_hours);
    }

    public function test_staff_can_apply_for_leave_and_admin_can_approve()
    {
        $user = User::factory()->create();
        $admin = User::factory()->create(['role' => 'admin']);

        $employee = Employee::create([
            'name' => 'Rahim Ahmed',
            'email' => $user->email,
            'user_id' => $user->id,
            'designation' => 'Developer',
            'salary' => 35000,
            'status' => 'active',
        ]);

        // Staff applies
        $today = now()->toDateString();
        $tomorrow = now()->addDays(2)->toDateString();

        $response = $this->actingAs($user)->post('/leaves', [
            'leave_type' => 'casual',
            'start_date' => $today,
            'end_date' => $tomorrow,
            'reason' => 'Family occasion',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('leaves', [
            'user_id' => $user->id,
            'leave_type' => 'casual',
            'status' => 'pending',
            'total_days' => 3,
        ]);

        $leave = Leave::first();

        // Admin approves
        $adminResponse = $this->actingAs($admin)->patch("/leaves/{$leave->id}/status", [
            'status' => 'approved',
            'admin_remarks' => 'Approved. Enjoy your leave.',
        ]);

        $adminResponse->assertRedirect();
        $this->assertDatabaseHas('leaves', [
            'id' => $leave->id,
            'status' => 'approved',
            'approved_by' => $admin->id,
        ]);
    }

    public function test_admin_can_generate_payroll_linking_attendance()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $staffUser = User::factory()->create();

        $employee = Employee::create([
            'name' => 'Tariq Islam',
            'email' => $staffUser->email,
            'user_id' => $staffUser->id,
            'designation' => 'Marketing Specialist',
            'salary' => 26000, // 1000 per day on 26 days
            'status' => 'active',
        ]);

        // Create 20 days of present attendance in current month
        $month = now()->month;
        $year = now()->year;

        for ($i = 1; $i <= 20; $i++) {
            Attendance::create([
                'user_id' => $staffUser->id,
                'employee_id' => $employee->id,
                'date' => sprintf('%04d-%02d-%02d', $year, $month, $i),
                'check_in_time' => '09:15:00',
                'check_out_time' => '17:30:00',
                'status' => 'present',
                'total_hours' => 8.25,
            ]);
        }

        // Generate monthly payroll
        $response = $this->actingAs($admin)->post('/admin/salary/generate', [
            'month' => $month,
            'year' => $year,
            'working_days' => 26,
            'employee_id' => $employee->id,
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        // Present: 20 days, Absent: 6 days
        // Base salary = 26000. Daily rate = 1000. Deduction = 6 * 1000 = 6000. Net = 20000.
        $this->assertDatabaseHas('salaries', [
            'employee_id' => $employee->id,
            'month' => $month,
            'year' => $year,
            'base_salary' => 26000.00,
            'working_days' => 26,
            'present_days' => 20,
            'absent_days' => 6,
            'deduction' => 6000.00,
            'net_salary' => 20000.00,
            'status' => 'unpaid',
        ]);

        $salary = Salary::where('employee_id', $employee->id)->first();

        // Mark as paid
        $payResponse = $this->actingAs($admin)->post("/admin/salary/{$salary->id}/pay", [
            'payment_method' => 'Bank Transfer',
            'payment_date' => now()->toDateString(),
            'transaction_ref' => 'TRX-987654321',
            'note' => 'Salary transferred to City Bank A/C',
        ]);

        $payResponse->assertRedirect();
        $this->assertDatabaseHas('salaries', [
            'id' => $salary->id,
            'status' => 'paid',
            'payment_method' => 'Bank Transfer',
            'transaction_ref' => 'TRX-987654321',
        ]);
    }
}
