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
        Schema::table('client_payments', function (Blueprint $table) {
            $table->string('status')->default('approved')->after('payment_method'); // 'pending', 'approved', 'rejected'
            $table->string('payment_type')->default('manual')->after('status'); // 'manual', 'gateway'
            $table->string('sender_number')->nullable()->after('transaction_id');
            $table->timestamp('approved_at')->nullable()->after('notes');
            $table->unsignedBigInteger('approved_by')->nullable()->after('approved_at');
            $table->text('rejection_reason')->nullable()->after('approved_by');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('client_payments', function (Blueprint $table) {
            $table->dropColumn([
                'status',
                'payment_type',
                'sender_number',
                'approved_at',
                'approved_by',
                'rejection_reason',
            ]);
        });
    }
};
