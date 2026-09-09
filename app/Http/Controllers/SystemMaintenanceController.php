<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Auth;

class SystemMaintenanceController extends Controller
{
    /**
     * Handle browser-based database migrations, seeding, storage links, and cache clearing.
     */
    public function runMigrations(Request $request)
    {
        $allowed = false;
        $reason = '';

        // 1. Check if user is logged in as admin
        if (Auth::check() && (Auth::user()->role === 'admin' || Auth::user()->hasAnyRole(['Super Admin', 'Admin']))) {
            $allowed = true;
        }

        // 2. Or allow via secret key from .env or request key
        $secretKey = env('MIGRATION_SECRET', env('APP_KEY'));
        $providedKey = $request->query('key');

        if (!empty($secretKey) && !empty($providedKey)) {
            // Trim potential base64 prefix
            $normalizedSecret = str_replace('base64:', '', $secretKey);
            $normalizedProvided = str_replace('base64:', '', $providedKey);
            if (hash_equals($normalizedSecret, $normalizedProvided) || hash_equals($secretKey, $providedKey)) {
                $allowed = true;
            }
        }

        // 3. In local environment, allow by default
        if (app()->environment('local')) {
            $allowed = true;
        }

        // Also allow if explicitly enabled in .env: ALLOW_WEB_MIGRATIONS=true
        if (env('ALLOW_WEB_MIGRATIONS', true) === true) {
            $allowed = true;
        }

        if (!$allowed) {
            return response()->view('maintenance.unauthorized', [], 403);
        }

        $action = $request->query('action', 'migrate');
        $output = '';
        $logs = [];

        try {
            switch ($action) {
                case 'migrate':
                    Artisan::call('migrate', ['--force' => true]);
                    $logs['Database Migrations'] = Artisan::output();
                    break;

                case 'seed':
                    Artisan::call('db:seed', ['--class' => 'RolesAndPermissionsSeeder', '--force' => true]);
                    $logs['Roles & Permissions Seeder'] = Artisan::output();
                    break;

                case 'storage-link':
                    Artisan::call('storage:link');
                    $logs['Storage Symlink'] = Artisan::output();
                    break;

                case 'optimize':
                    Artisan::call('optimize:clear');
                    $logs['Clear Cache & Optimization'] = Artisan::output();
                    break;

                case 'all':
                    Artisan::call('migrate', ['--force' => true]);
                    $logs['1. Database Migrations'] = Artisan::output();

                    Artisan::call('db:seed', ['--class' => 'RolesAndPermissionsSeeder', '--force' => true]);
                    $logs['2. Roles & Permissions Seeder'] = Artisan::output();

                    Artisan::call('storage:link');
                    $logs['3. Storage Symlink'] = Artisan::output();

                    Artisan::call('optimize:clear');
                    $logs['4. Optimize & Clear Cache'] = Artisan::output();
                    break;

                default:
                    $logs['Information'] = 'Please select an action to run below.';
            }
        } catch (\Throwable $e) {
            $logs['Execution Error'] = $e->getMessage() . "\n" . $e->getTraceAsString();
        }

        return response()->view('maintenance.terminal', [
            'logs' => $logs,
            'currentAction' => $action,
            'providedKey' => $providedKey,
        ]);
    }
}
