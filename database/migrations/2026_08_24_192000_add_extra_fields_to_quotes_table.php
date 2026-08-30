<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('quotes', function (Blueprint $table) {
            if (!Schema::hasColumn('quotes', 'company_name')) {
                $table->string('company_name', 191)->nullable()->after('name');
            }
            if (!Schema::hasColumn('quotes', 'estimated_budget')) {
                $table->decimal('estimated_budget', 12, 2)->nullable()->after('message');
            }
            if (!Schema::hasColumn('quotes', 'notes')) {
                $table->text('notes')->nullable()->after('estimated_budget');
            }
        });
    }

    public function down(): void
    {
        Schema::table('quotes', function (Blueprint $table) {
            $table->dropColumn(['company_name', 'estimated_budget', 'notes']);
        });
    }
};
