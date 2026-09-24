<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Add partial payment & billing engine fields to orders table.
     *  - paid_amount: total amount collected so far (may be < amount for partial)
     *  - discount: flat discount applied to the order
     *  - payment_status: paid | partial | due | refunded
     *  - due_date: deadline for remaining balance
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->decimal('paid_amount', 10, 2)->default(0)->after('amount');
            $table->decimal('discount', 10, 2)->default(0)->after('paid_amount');
            $table->string('payment_status', 30)->default('due')->after('status'); // paid | partial | due | refunded
            $table->date('due_date')->nullable()->after('delivery_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['paid_amount', 'discount', 'payment_status', 'due_date']);
        });
    }
};
