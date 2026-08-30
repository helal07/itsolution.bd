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
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('phone', 30)->nullable();
            $table->string('designation'); // e.g. Senior Mobile Dev, Cyber Sec Architect
            $table->string('department')->default('Engineering'); // Engineering, Security, UI/UX, Sales, Management
            $table->enum('status', ['active', 'inactive', 'on_leave'])->default('active');
            $table->decimal('salary', 10, 2)->nullable();
            $table->date('joined_date')->nullable();
            $table->string('avatar')->nullable();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
