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
        // 1. Attendances Table
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->nullable()->constrained('employees')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->date('date');
            $table->time('check_in_time')->nullable();
            $table->time('check_out_time')->nullable();
            $table->string('check_in_selfie', 500)->nullable();
            $table->string('check_out_selfie', 500)->nullable();
            $table->decimal('check_in_latitude', 10, 7)->nullable();
            $table->decimal('check_in_longitude', 10, 7)->nullable();
            $table->string('check_in_location_name', 255)->nullable();
            $table->decimal('check_out_latitude', 10, 7)->nullable();
            $table->decimal('check_out_longitude', 10, 7)->nullable();
            $table->string('check_out_location_name', 255)->nullable();
            $table->string('status', 30)->default('present'); // present, late, half_day, absent
            $table->decimal('total_hours', 5, 2)->default(0);
            $table->text('check_in_note')->nullable();
            $table->text('check_out_note')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'date']);
        });

        // 2. Leaves Table
        Schema::create('leaves', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->nullable()->constrained('employees')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('leave_type', 50)->default('casual'); // casual, sick, annual, unpaid, emergency
            $table->date('start_date');
            $table->date('end_date');
            $table->unsignedSmallInteger('total_days')->default(1);
            $table->text('reason');
            $table->string('status', 30)->default('pending'); // pending, approved, rejected
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable();
            $table->text('admin_remarks')->nullable();
            $table->text('admin_notes')->nullable();
            $table->timestamps();
        });

        // 3. Salaries & Payrolls Table
        Schema::create('salaries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained('employees')->cascadeOnDelete();
            $table->unsignedSmallInteger('month'); // 1 - 12
            $table->unsignedSmallInteger('year'); // 2026
            $table->decimal('base_salary', 10, 2)->default(0);
            $table->unsignedSmallInteger('working_days')->default(26);
            $table->unsignedSmallInteger('present_days')->default(0);
            $table->unsignedSmallInteger('leave_days')->default(0);
            $table->unsignedSmallInteger('absent_days')->default(0);
            $table->decimal('bonus', 10, 2)->default(0);
            $table->decimal('deduction', 10, 2)->default(0);
            $table->decimal('net_salary', 10, 2)->default(0);
            $table->string('status', 30)->default('unpaid'); // unpaid, paid
            $table->date('payment_date')->nullable();
            $table->string('payment_method', 50)->nullable(); // Bank Transfer, bKash, Cash
            $table->string('transaction_ref', 100)->nullable();
            $table->text('note')->nullable();
            $table->timestamps();

            $table->unique(['employee_id', 'month', 'year']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('salaries');
        Schema::dropIfExists('leaves');
        Schema::dropIfExists('attendances');
    }
};
