<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('departments', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('code', 20)->nullable();
            $table->text('description')->nullable();
            $table->string('head_name')->nullable();
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();
        });

        // Seed standard departments
        $initialDepts = [
            ['name' => 'Engineering', 'code' => 'ENG', 'description' => 'Software engineering, architecture, web & backend systems.'],
            ['name' => 'Cyber Security', 'code' => 'SEC', 'description' => 'Vulnerability assessment, penetration testing, and digital safety.'],
            ['name' => 'Mobile Development', 'code' => 'MOB', 'description' => 'iOS, Android native, and cross-platform Flutter/React Native.'],
            ['name' => 'Cloud & DevOps', 'code' => 'CLD', 'description' => 'Cloud infrastructure, CI/CD automation, AWS, and server management.'],
            ['name' => 'UI/UX Design', 'code' => 'DES', 'description' => 'User experience research, wireframing, branding, and visual interfaces.'],
            ['name' => 'Sales & Growth', 'code' => 'SLS', 'description' => 'Business development, client relations, bids, and commerce growth.'],
            ['name' => 'HR & Accounts', 'code' => 'HRA', 'description' => 'Human resources, talent management, payroll, and fiscal records.'],
            ['name' => 'Management', 'code' => 'MGT', 'description' => 'Executive operations, leadership, and strategic planning.'],
        ];

        foreach ($initialDepts as $d) {
            DB::table('departments')->insert([
                'name' => $d['name'],
                'code' => $d['code'],
                'description' => $d['description'],
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('departments');
    }
};
