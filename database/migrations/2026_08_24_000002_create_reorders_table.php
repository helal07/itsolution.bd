<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reorders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('item_id')->nullable()->constrained('items')->nullOnDelete();
            $table->string('client_name', 150);
            $table->string('client_email', 150)->nullable();
            $table->string('client_phone', 50);
            $table->string('company_name', 150)->nullable();
            $table->string('package_name', 180);
            $table->enum('billing_cycle', ['monthly', 'yearly', 'custom'])->default('monthly')->index();
            $table->decimal('price', 10, 2);
            $table->string('currency', 3)->default('BDT');
            $table->date('start_date');
            $table->date('finish_date')->index();
            $table->enum('status', ['active', 'expiring_soon', 'expired', 'renewed', 'cancelled'])->default('active')->index();
            $table->boolean('auto_renewal')->default(false);
            $table->integer('reminder_days_before')->default(7);
            $table->timestamp('last_reminder_sent_at')->nullable();
            $table->integer('reminder_count')->default(0);
            $table->string('reminder_channel', 50)->nullable(); // 'whatsapp', 'sms', 'both'
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reorders');
    }
};
