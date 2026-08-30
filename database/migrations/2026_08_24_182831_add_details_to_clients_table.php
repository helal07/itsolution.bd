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
        Schema::table('clients', function (Blueprint $table) {
            $table->string('phone', 50)->nullable()->after('website_url');
            $table->string('email', 150)->nullable()->after('phone');
            $table->string('contact_person', 150)->nullable()->after('email');
            $table->string('address', 255)->nullable()->after('contact_person');
            $table->unsignedTinyInteger('rating')->default(5)->after('testimonial');
            $table->string('status', 30)->default('active')->index()->after('rating');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('clients', function (Blueprint $table) {
            $table->dropColumn(['phone', 'email', 'contact_person', 'address', 'rating', 'status']);
        });
    }
};
