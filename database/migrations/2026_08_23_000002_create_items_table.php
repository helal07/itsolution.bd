<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('categories')->cascadeOnDelete();
            $table->string('name', 150);
            $table->string('slug', 180)->unique();
            $table->string('short_description', 255)->nullable();
            $table->longText('description')->nullable();
            $table->string('thumbnail', 255)->nullable();
            $table->decimal('price', 10, 2)->nullable();
            $table->boolean('is_purchasable')->default(true);
            $table->boolean('is_featured')->default(false)->index();
            $table->enum('status', ['draft', 'published'])->default('draft')->index();
            $table->timestamp('published_at')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->index(['category_id', 'status', 'published_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('items');
    }
};
