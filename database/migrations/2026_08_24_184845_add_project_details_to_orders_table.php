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
        Schema::table('orders', function (Blueprint $table) {
            $table->string('project_name', 180)->nullable()->after('item_id');
            $table->unsignedTinyInteger('progress')->default(0)->after('status'); // 0 to 100%
            $table->string('added_by', 100)->nullable()->default('Admin')->after('transaction_id');
            $table->date('delivery_date')->nullable()->after('added_by');
            $table->text('notes')->nullable()->after('delivery_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['project_name', 'progress', 'added_by', 'delivery_date', 'notes']);
        });
    }
};
