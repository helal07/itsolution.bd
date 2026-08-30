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
        Schema::create('chat_questions', function (Blueprint $table) {
            $table->id();
            $table->string('question');
            $table->text('answer');
            $table->text('keywords')->nullable(); // Comma-separated or space-separated trigger words
            $table->string('category')->default('General');
            $table->string('action_label')->nullable();
            $table->string('action_url')->nullable();
            $table->json('suggested_options')->nullable(); // Array of strings (follow-up selection chips)
            $table->boolean('is_quick_option')->default(false); // Starter chip on chat open
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->unsignedBigInteger('click_count')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chat_questions');
    }
};
