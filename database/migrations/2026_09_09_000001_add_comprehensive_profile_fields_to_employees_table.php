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
        Schema::table('employees', function (Blueprint $table) {
            // Name components & User Identification
            $table->string('prefix', 20)->nullable()->after('id');
            $table->string('first_name', 100)->nullable()->after('prefix');
            $table->string('last_name', 100)->nullable()->after('first_name');
            $table->string('username', 100)->nullable()->after('last_name');

            // Sales & Discounts
            $table->decimal('sales_commission_percentage', 5, 2)->nullable()->after('salary');
            $table->decimal('max_sales_discount_percent', 5, 2)->nullable()->after('sales_commission_percentage');

            // Personal & Medical
            $table->date('dob')->nullable()->after('joined_date');
            $table->string('gender', 20)->nullable()->after('dob');
            $table->string('marital_status', 30)->nullable()->after('gender');
            $table->string('blood_group', 10)->nullable()->after('marital_status');

            // Additional Contacts
            $table->string('alternate_phone', 30)->nullable()->after('phone');
            $table->string('family_phone', 30)->nullable()->after('alternate_phone');

            // Social Profiles
            $table->string('facebook_link')->nullable()->after('avatar');
            $table->string('twitter_link')->nullable()->after('facebook_link');
            $table->string('social_media_1')->nullable()->after('twitter_link');
            $table->string('social_media_2')->nullable()->after('social_media_1');

            // Custom Fields & Identity Proofs
            $table->string('custom_field_1')->nullable()->after('social_media_2');
            $table->string('custom_field_2')->nullable()->after('custom_field_1');
            $table->string('custom_field_3')->nullable()->after('custom_field_2');
            $table->string('custom_field_4')->nullable()->after('custom_field_3');
            $table->string('guardian_name')->nullable()->after('custom_field_4');
            $table->string('id_proof_name', 100)->nullable()->after('guardian_name');
            $table->string('id_proof_number', 100)->nullable()->after('id_proof_name');

            // Address Details
            $table->text('permanent_address')->nullable()->after('id_proof_number');
            $table->text('current_address')->nullable()->after('permanent_address');

            // Bank & Tax Details
            $table->string('bank_account_holder_name')->nullable()->after('current_address');
            $table->string('bank_account_number', 100)->nullable()->after('bank_account_holder_name');
            $table->string('bank_name')->nullable()->after('bank_account_number');
            $table->string('bank_identifier_code', 100)->nullable()->after('bank_name');
            $table->string('bank_branch')->nullable()->after('bank_identifier_code');
            $table->string('tax_payer_id', 100)->nullable()->after('bank_branch');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->dropColumn([
                'prefix',
                'first_name',
                'last_name',
                'username',
                'sales_commission_percentage',
                'max_sales_discount_percent',
                'dob',
                'gender',
                'marital_status',
                'blood_group',
                'alternate_phone',
                'family_phone',
                'facebook_link',
                'twitter_link',
                'social_media_1',
                'social_media_2',
                'custom_field_1',
                'custom_field_2',
                'custom_field_3',
                'custom_field_4',
                'guardian_name',
                'id_proof_name',
                'id_proof_number',
                'permanent_address',
                'current_address',
                'bank_account_holder_name',
                'bank_account_number',
                'bank_name',
                'bank_identifier_code',
                'bank_branch',
                'tax_payer_id',
            ]);
        });
    }
};
