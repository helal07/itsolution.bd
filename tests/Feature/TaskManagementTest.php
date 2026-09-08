<?php

namespace Tests\Feature;

use App\Models\Employee;
use App\Models\Task;
use App\Models\TaskStep;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskManagementTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;
    protected User $staffUser;
    protected Employee $employee;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $this->staffUser = User::factory()->create([
            'role' => 'client', // or staff
            'email' => 'helal@itsolutions.bd',
        ]);

        $this->employee = Employee::create([
            'name' => 'Md Al Helal',
            'email' => 'helal@itsolutions.bd',
            'designation' => 'Lead Full-Stack Engineer',
            'department' => 'Engineering',
            'status' => 'active',
            'salary' => 50000,
            'joined_date' => now()->toDateString(),
            'user_id' => $this->staffUser->id,
        ]);
    }

    public function test_admin_can_view_tasks_index(): void
    {
        $response = $this->actingAs($this->admin)->get(route('admin.tasks.index'));
        $response->assertStatus(200);
    }

    public function test_admin_can_create_task_with_subtask_steps(): void
    {
        $response = $this->actingAs($this->admin)->post(route('admin.tasks.store'), [
            'title' => 'Security Brokerage, Website and applicant portal',
            'description' => 'Applicant portal, SMS otp/ ID & password, Notice, and Publication',
            'assigned_to' => $this->employee->id,
            'priority' => 'medium',
            'status' => 'pending',
            'due_date' => '2026-07-31',
            'steps' => [
                ['title' => 'SMS OTP Integration', 'assigned_to' => $this->employee->id],
                ['title' => 'Applicant Portal Frontend', 'assigned_to' => $this->employee->id],
            ],
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('tasks', [
            'title' => 'Security Brokerage, Website and applicant portal',
            'assigned_to' => $this->employee->id,
            'priority' => 'medium',
        ]);

        $this->assertDatabaseHas('task_steps', [
            'title' => 'SMS OTP Integration',
            'assigned_to' => $this->employee->id,
            'is_completed' => false,
        ]);
    }

    public function test_toggling_subtask_step_recalculates_task_progress(): void
    {
        $task = Task::create([
            'title' => 'Website Redesign',
            'assigned_to' => $this->employee->id,
            'created_by' => $this->admin->id,
            'priority' => 'medium',
            'status' => 'pending',
            'progress' => 0,
        ]);

        $step1 = TaskStep::create([
            'task_id' => $task->id,
            'title' => 'e commerce website setup',
            'assigned_to' => $this->employee->id,
            'is_completed' => false,
        ]);

        $step2 = TaskStep::create([
            'task_id' => $task->id,
            'title' => 'Payment Gateway Integration',
            'assigned_to' => $this->employee->id,
            'is_completed' => false,
        ]);

        // Toggle Step 1 -> Should make progress 50% & status in_progress
        $response = $this->actingAs($this->admin)->patch(route('admin.tasks.steps.toggle', $step1->id));
        $response->assertSessionHasNoErrors();

        $task->refresh();
        $this->assertEquals(50, $task->progress);
        $this->assertEquals('in_progress', $task->status);

        // Toggle Step 2 -> Should make progress 100% & status completed
        $response = $this->actingAs($this->admin)->patch(route('admin.tasks.steps.toggle', $step2->id));
        $response->assertSessionHasNoErrors();

        $task->refresh();
        $this->assertEquals(100, $task->progress);
        $this->assertEquals('completed', $task->status);
    }

    public function test_staff_can_view_my_tasks(): void
    {
        Task::create([
            'title' => 'Cafe Eat & Meet POS',
            'assigned_to' => $this->employee->id,
            'created_by' => $this->admin->id,
            'priority' => 'medium',
            'status' => 'pending',
        ]);

        $response = $this->actingAs($this->staffUser)->get(route('staff.tasks.index'));
        $response->assertStatus(200);
    }

    public function test_staff_can_submit_daily_work_log_with_calls_and_feedback(): void
    {
        $task = Task::create([
            'title' => 'ERP Module Development',
            'assigned_to' => $this->employee->id,
            'created_by' => $this->admin->id,
            'priority' => 'high',
            'status' => 'in_progress',
        ]);

        $response = $this->actingAs($this->staffUser)->post(route('staff.daily-log.store'), [
            'log_date' => now()->toDateString(),
            'call_logs' => [
                [
                    'client_name' => 'Md Rafiq',
                    'phone' => '01658855000',
                    'discussion' => 'রফিক বলেছেন কাল সকাল ১১টায় যোগাযোগ করতে।',
                    'follow_up_date' => now()->addDay()->toDateString(),
                ],
                [
                    'client_name' => 'Karim Enterprise',
                    'phone' => '01711223344',
                    'discussion' => 'POS ডেমো লিঙ্ক পাঠানো হয়েছে।',
                    'follow_up_date' => null,
                ],
            ],
            'assigned_task_logs' => [
                [
                    'task_id' => $task->id,
                    'task_title' => 'ERP Module Development',
                    'status' => 'in_progress',
                    'remarks' => 'ডাটাবেজ স্কিমা তৈরি ও এপিআই কনফিগার সম্পন্ন।',
                ]
            ],
            'other_work_logs' => [
                [
                    'title' => 'ই-কমার্স ব্যানার ডিজাইন',
                    'description' => '৩টি হিরো ব্যানার ডিজাইন করে সাইটে আপলোড করা হয়েছে।',
                    'time_spent' => '2 hours',
                ]
            ],
            'hours_worked' => 8.0,
            'challenges_notes' => 'Awaiting API credentials from courier.',
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('daily_work_logs', [
            'user_id' => $this->staffUser->id,
            'employee_id' => $this->employee->id,
            'calls_count' => 2, // Auto-computed from 2 call entries!
            'hours_worked' => 8.0,
        ]);
    }

    public function test_admin_can_view_and_evaluate_daily_work_logs(): void
    {
        $this->actingAs($this->staffUser)->post(route('staff.daily-log.store'), [
            'log_date' => now()->toDateString(),
            'calls_count' => 8,
            'client_feedbacks' => 'Client follow-up completed.',
            'tasks_summary' => 'Delivered milestone 1.',
            'hours_worked' => 8.0,
        ]);

        $response = $this->actingAs($this->admin)->get(route('admin.work-logs.index'));
        $response->assertStatus(200);

        $log = \App\Models\DailyWorkLog::first();
        $patchResponse = $this->actingAs($this->admin)->patch(route('admin.work-logs.notes', $log->id), [
            'admin_notes' => 'Great work on the milestone delivery!',
        ]);

        $patchResponse->assertSessionHasNoErrors();
        $this->assertDatabaseHas('daily_work_logs', [
            'id' => $log->id,
            'admin_notes' => 'Great work on the milestone delivery!',
        ]);
    }
}
