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
        // 1. Order Requirements Table
        Schema::create('order_requirements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->foreignId('client_id')->nullable()->constrained('clients')->nullOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('title', 255);
            $table->longText('description')->nullable();
            $table->string('status', 30)->default('submitted'); // draft, submitted, in_review, approved
            $table->timestamps();
        });

        // 2. Order Attachments Table (Images, Audio Voice Notes, Videos, Documents, Links)
        Schema::create('order_attachments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_requirement_id')->constrained('order_requirements')->cascadeOnDelete();
            $table->enum('file_type', ['image', 'audio', 'video', 'document', 'link'])->default('image');
            $table->string('file_path', 255)->nullable();
            $table->string('external_url', 500)->nullable();
            $table->string('original_name', 255);
            $table->unsignedInteger('file_size_kb')->nullable();
            $table->unsignedInteger('duration_seconds')->nullable();
            $table->foreignId('uploaded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_attachments');
        Schema::dropIfExists('order_requirements');
    }
};
