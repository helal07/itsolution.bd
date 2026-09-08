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
        Schema::table('daily_work_logs', function (Blueprint $table) {
            $table->json('call_logs')->nullable()->after('calls_count');
            $table->json('assigned_task_logs')->nullable()->after('completed_task_ids');
            $table->json('other_work_logs')->nullable()->after('assigned_task_logs');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('daily_work_logs', function (Blueprint $table) {
            $table->dropColumn(['call_logs', 'assigned_task_logs', 'other_work_logs']);
        });
    }
};
