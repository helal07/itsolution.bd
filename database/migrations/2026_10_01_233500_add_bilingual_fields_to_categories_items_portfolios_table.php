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
        // 1. Categories table: name_bn and description_bn
        Schema::table('categories', function (Blueprint $table) {
            if (!Schema::hasColumn('categories', 'name_bn')) {
                $table->string('name_bn')->nullable()->after('name');
            }
            if (!Schema::hasColumn('categories', 'description_bn')) {
                $table->text('description_bn')->nullable()->after('description');
            }
        });

        // 2. Items table: name_bn, short_description_bn, description_bn
        Schema::table('items', function (Blueprint $table) {
            if (!Schema::hasColumn('items', 'name_bn')) {
                $table->string('name_bn')->nullable()->after('name');
            }
            if (!Schema::hasColumn('items', 'short_description_bn')) {
                $table->text('short_description_bn')->nullable()->after('short_description');
            }
            if (!Schema::hasColumn('items', 'description_bn')) {
                $table->longText('description_bn')->nullable()->after('description');
            }
        });

        // 3. Portfolios table: title_bn, description_bn
        Schema::table('portfolios', function (Blueprint $table) {
            if (!Schema::hasColumn('portfolios', 'title_bn')) {
                $table->string('title_bn')->nullable()->after('title');
            }
            if (!Schema::hasColumn('portfolios', 'description_bn')) {
                $table->text('description_bn')->nullable()->after('description');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            if (Schema::hasColumn('categories', 'name_bn')) {
                $table->dropColumn('name_bn');
            }
            if (Schema::hasColumn('categories', 'description_bn')) {
                $table->dropColumn('description_bn');
            }
        });

        Schema::table('items', function (Blueprint $table) {
            if (Schema::hasColumn('items', 'name_bn')) {
                $table->dropColumn('name_bn');
            }
            if (Schema::hasColumn('items', 'short_description_bn')) {
                $table->dropColumn('short_description_bn');
            }
            if (Schema::hasColumn('items', 'description_bn')) {
                $table->dropColumn('description_bn');
            }
        });

        Schema::table('portfolios', function (Blueprint $table) {
            if (Schema::hasColumn('portfolios', 'title_bn')) {
                $table->dropColumn('title_bn');
            }
            if (Schema::hasColumn('portfolios', 'description_bn')) {
                $table->dropColumn('description_bn');
            }
        });
    }
};
