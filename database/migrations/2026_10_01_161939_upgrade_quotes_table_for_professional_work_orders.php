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
        Schema::table('quotes', function (Blueprint $table) {
            if (!Schema::hasColumn('quotes', 'quote_number')) {
                $table->string('quote_number', 50)->nullable()->unique()->after('id');
            }
            if (!Schema::hasColumn('quotes', 'public_token')) {
                $table->string('public_token', 64)->nullable()->unique()->after('quote_number');
            }
            if (!Schema::hasColumn('quotes', 'project_title')) {
                $table->string('project_title', 255)->nullable()->after('public_token');
            }
            if (!Schema::hasColumn('quotes', 'valid_until')) {
                $table->date('valid_until')->nullable()->after('project_title');
            }
            if (!Schema::hasColumn('quotes', 'currency')) {
                $table->string('currency', 10)->default('BDT')->after('valid_until');
            }
            if (!Schema::hasColumn('quotes', 'subtotal')) {
                $table->decimal('subtotal', 12, 2)->default(0)->after('currency');
            }
            if (!Schema::hasColumn('quotes', 'discount')) {
                $table->decimal('discount', 12, 2)->default(0)->after('subtotal');
            }
            if (!Schema::hasColumn('quotes', 'tax')) {
                $table->decimal('tax', 12, 2)->default(0)->after('discount');
            }
            if (!Schema::hasColumn('quotes', 'total_amount')) {
                $table->decimal('total_amount', 12, 2)->default(0)->after('tax');
            }
            if (!Schema::hasColumn('quotes', 'phases')) {
                $table->json('phases')->nullable()->after('total_amount');
            }
            if (!Schema::hasColumn('quotes', 'payment_terms')) {
                $table->json('payment_terms')->nullable()->after('phases');
            }
            if (!Schema::hasColumn('quotes', 'terms_conditions')) {
                $table->text('terms_conditions')->nullable()->after('payment_terms');
            }
            if (!Schema::hasColumn('quotes', 'is_work_order')) {
                $table->boolean('is_work_order')->default(false)->after('terms_conditions');
            }
            if (!Schema::hasColumn('quotes', 'work_order_number')) {
                $table->string('work_order_number', 50)->nullable()->after('is_work_order');
            }
            if (!Schema::hasColumn('quotes', 'client_signature')) {
                $table->longText('client_signature')->nullable()->after('work_order_number');
            }
            if (!Schema::hasColumn('quotes', 'client_signer_name')) {
                $table->string('client_signer_name', 150)->nullable()->after('client_signature');
            }
            if (!Schema::hasColumn('quotes', 'client_signer_ip')) {
                $table->string('client_signer_ip', 45)->nullable()->after('client_signer_name');
            }
            if (!Schema::hasColumn('quotes', 'client_signed_at')) {
                $table->timestamp('client_signed_at')->nullable()->after('client_signer_ip');
            }
            if (!Schema::hasColumn('quotes', 'company_signature')) {
                $table->longText('company_signature')->nullable()->after('client_signed_at');
            }
            if (!Schema::hasColumn('quotes', 'company_signer_name')) {
                $table->string('company_signer_name', 150)->nullable()->after('company_signature');
            }
            if (!Schema::hasColumn('quotes', 'company_signed_at')) {
                $table->timestamp('company_signed_at')->nullable()->after('company_signer_name');
            }
        });
    }

    public function down(): void
    {
        Schema::table('quotes', function (Blueprint $table) {
            $table->dropColumn([
                'quote_number',
                'public_token',
                'project_title',
                'valid_until',
                'currency',
                'subtotal',
                'discount',
                'tax',
                'total_amount',
                'phases',
                'payment_terms',
                'terms_conditions',
                'is_work_order',
                'work_order_number',
                'client_signature',
                'client_signer_name',
                'client_signer_ip',
                'client_signed_at',
                'company_signature',
                'company_signer_name',
                'company_signed_at',
            ]);
        });
    }
};
