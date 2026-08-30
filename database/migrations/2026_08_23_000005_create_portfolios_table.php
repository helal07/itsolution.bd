<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('portfolios', function (Blueprint $table) {
            $table->id();
            $table->foreignId('item_id')->nullable()->constrained('items')->nullOnDelete();
            $table->foreignId('client_id')->nullable()->constrained('clients')->nullOnDelete();
            $table->string('title', 180);
            $table->string('slug', 200)->unique();
            $table->enum('type', ['website', 'software', 'pos_software'])->index();
            $table->string('cover_image', 255);
            $table->longText('description')->nullable();
            $table->string('project_url', 255)->nullable();
            $table->boolean('is_featured')->default(false)->index();
            $table->date('completed_at')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('portfolios');
    }
};
