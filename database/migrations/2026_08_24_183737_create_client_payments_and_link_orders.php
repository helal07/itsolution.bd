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
        // 1. Add client_id to orders table if not present
        if (!Schema::hasColumn('orders', 'client_id')) {
            Schema::table('orders', function (Blueprint $table) {
                $table->foreignId('client_id')->nullable()->after('user_id')->constrained('clients')->nullOnDelete();
            });
        }

        // 2. Create client_payments table
        Schema::create('client_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained('clients')->cascadeOnDelete();
            $table->foreignId('order_id')->nullable()->constrained('orders')->nullOnDelete();
            $table->decimal('amount', 10, 2);
            $table->string('currency', 3)->default('BDT');
            $table->string('payment_method', 50); // bKash, Nagad, Bank, Card, Cash, Multi-Pay Split
            $table->string('transaction_id', 150)->nullable();
            $table->text('notes')->nullable();
            $table->date('payment_date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('client_payments');

        if (Schema::hasColumn('orders', 'client_id')) {
            Schema::table('orders', function (Blueprint $table) {
                $table->dropForeign(['client_id']);
                $table->dropColumn('client_id');
            });
        }
    }
};
