<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Main Tasks Table
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->string('title', 255);
            $table->text('description')->nullable();
            $table->foreignId('assigned_to')->nullable()->constrained('employees')->nullOnDelete();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('priority', 20)->default('medium'); // low, medium, high, urgent
            $table->string('status', 30)->default('pending'); // pending, in_progress, completed, cancelled
            $table->unsignedTinyInteger('progress')->default(0); // 0 to 100%
            $table->date('due_date')->nullable();
            $table->foreignId('item_id')->nullable()->constrained('items')->nullOnDelete();
            $table->foreignId('order_id')->nullable()->constrained('orders')->nullOnDelete();
            $table->foreignId('client_id')->nullable()->constrained('clients')->nullOnDelete();
            $table->timestamps();
        });

        // 2. Subtasks / Checklist Steps Table
        Schema::create('task_steps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('task_id')->constrained('tasks')->cascadeOnDelete();
            $table->string('title', 255);
            $table->foreignId('assigned_to')->nullable()->constrained('employees')->nullOnDelete();
            $table->boolean('is_completed')->default(false);
            $table->timestamp('completed_at')->nullable();
            $table->foreignId('completed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });

        // 3. Daily Activity & Work Logs Table (Calls, Feedback, Tasks done, Hours)
        Schema::create('daily_work_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('employee_id')->nullable()->constrained('employees')->nullOnDelete();
            $table->date('log_date');
            $table->unsignedInteger('calls_count')->default(0);
            $table->text('client_feedbacks')->nullable();
            $table->text('tasks_summary')->nullable();
            $table->json('completed_task_ids')->nullable();
            $table->decimal('hours_worked', 4, 1)->default(8.0);
            $table->text('challenges_notes')->nullable();
            $table->text('admin_notes')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'log_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('daily_work_logs');
        Schema::dropIfExists('task_steps');
        Schema::dropIfExists('tasks');
    }
};
