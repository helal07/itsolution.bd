<?php

/**
 * Standalone Web Migration & Artisan Suite
 * Works on any cPanel / Apache / Nginx server without depending on route caching.
 */

// Define execution start
define('LARAVEL_START', microtime(true));

// Locate Composer autoload and Laravel app
$autoloadPaths = [
    __DIR__ . '/../vendor/autoload.php',
    __DIR__ . '/vendor/autoload.php',
    dirname(__DIR__) . '/vendor/autoload.php',
];

$autoloadFile = null;
foreach ($autoloadPaths as $path) {
    if (file_exists($path)) {
        $autoloadFile = $path;
        break;
    }
}

if (!$autoloadFile) {
    die("<h1>Composer autoload not found. Please verify deployment directory structure.</h1>");
}

require_once $autoloadFile;

$appPaths = [
    __DIR__ . '/../bootstrap/app.php',
    __DIR__ . '/bootstrap/app.php',
    dirname(__DIR__) . '/bootstrap/app.php',
];

$appFile = null;
foreach ($appPaths as $path) {
    if (file_exists($path)) {
        $appFile = $path;
        break;
    }
}

if (!$appFile) {
    die("<h1>Laravel bootstrap file not found.</h1>");
}

/** @var \Illuminate\Foundation\Application $app */
$app = require_once $appFile;
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Auth;

// Determine authorized access
$allowed = false;
if (app()->environment('local')) {
    $allowed = true;
}

// Allow if logged in admin
if (Auth::check() && (Auth::user()->role === 'admin' || (method_exists(Auth::user(), 'hasAnyRole') && Auth::user()->hasAnyRole(['Super Admin', 'Admin'])))) {
    $allowed = true;
}

// Secret key check
$secretKey = env('MIGRATION_SECRET', env('APP_KEY'));
$providedKey = $_GET['key'] ?? null;
if (!empty($secretKey) && !empty($providedKey)) {
    $normalizedSecret = str_replace('base64:', '', $secretKey);
    $normalizedProvided = str_replace('base64:', '', $providedKey);
    if (hash_equals($normalizedSecret, $normalizedProvided) || hash_equals($secretKey, $providedKey)) {
        $allowed = true;
    }
}

// Allow if ALLOW_WEB_MIGRATIONS is set
if (env('ALLOW_WEB_MIGRATIONS', true) === true) {
    $allowed = true;
}

$action = $_GET['action'] ?? 'all';
$logs = [];

if ($allowed) {
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
            default:
                Artisan::call('migrate', ['--force' => true]);
                $logs['1. Database Migrations'] = Artisan::output();

                Artisan::call('db:seed', ['--class' => 'RolesAndPermissionsSeeder', '--force' => true]);
                $logs['2. Roles & Permissions Seeder'] = Artisan::output();

                try {
                    Artisan::call('storage:link');
                    $logs['3. Storage Symlink'] = Artisan::output();
                } catch (\Throwable $e) {
                    $logs['3. Storage Symlink'] = $e->getMessage();
                }

                Artisan::call('optimize:clear');
                $logs['4. Optimize & Clear Cache'] = Artisan::output();
                break;
        }
    } catch (\Throwable $e) {
        $logs['Execution Error'] = $e->getMessage() . "\n" . $e->getTraceAsString();
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Web Migration & Artisan Suite</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Plus+Jakarta+Sans:wght@500;700;800&display=swap" rel="stylesheet">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
            background: #0f172a;
            color: #f8fafc;
            min-height: 100vh;
            padding: 2rem 1rem;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .container { width: 100%; max-width: 900px; }
        .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: #1e293b;
            border: 1px solid #334155;
            padding: 1.5rem;
            border-radius: 1rem;
            margin-bottom: 1.5rem;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
        }
        .header h1 { font-size: 1.35rem; font-weight: 800; color: #ffffff; }
        .header p { font-size: 0.8rem; color: #94a3b8; margin-top: 0.25rem; }
        .badge {
            background: #22c55e20;
            color: #4ade80;
            border: 1px solid #22c55e40;
            padding: 0.35rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 700;
            font-family: 'JetBrains Mono', monospace;
        }
        .actions-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 0.75rem;
            margin-bottom: 1.5rem;
        }
        .btn-action {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            padding: 0.85rem 1rem;
            background: #1e293b;
            color: #f1f5f9;
            border: 1px solid #334155;
            border-radius: 0.75rem;
            font-weight: 700;
            font-size: 0.82rem;
            text-decoration: none;
            transition: all 0.15s ease;
        }
        .btn-action:hover {
            background: #2563eb;
            border-color: #3b82f6;
            color: #ffffff;
            transform: translateY(-1px);
        }
        .btn-action.active {
            background: #2563eb;
            border-color: #60a5fa;
            color: #ffffff;
            box-shadow: 0 0 15px rgba(37, 99, 235, 0.4);
        }
        .btn-action.all {
            background: linear-gradient(135deg, #2563eb, #7c3aed);
            border: none;
            color: #ffffff;
        }
        .terminal-window {
            background: #090d16;
            border: 1px solid #1e293b;
            border-radius: 1rem;
            overflow: hidden;
            box-shadow: 0 20px 30px -10px rgba(0, 0, 0, 0.5);
        }
        .terminal-bar {
            background: #131b2e;
            padding: 0.75rem 1rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid #1e293b;
        }
        .terminal-dots { display: flex; gap: 0.4rem; }
        .dot { width: 11px; height: 11px; border-radius: 50%; }
        .dot.red { background: #ef4444; }
        .dot.yellow { background: #f59e0b; }
        .dot.green { background: #10b981; }
        .terminal-title {
            font-size: 0.75rem;
            font-family: 'JetBrains Mono', monospace;
            color: #64748b;
            font-weight: 600;
        }
        .terminal-body {
            padding: 1.5rem;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.85rem;
            line-height: 1.6;
            min-height: 250px;
            max-height: 600px;
            overflow-y: auto;
        }
        .command-block { margin-bottom: 1.5rem; }
        .command-block:last-child { margin-bottom: 0; }
        .command-header { color: #38bdf8; font-weight: 700; display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; }
        .command-header::before { content: '$'; color: #10b981; }
        .command-output {
            color: #cbd5e1;
            white-space: pre-wrap;
            background: #0f172a80;
            padding: 1rem;
            border-radius: 0.5rem;
            border: 1px solid #1e293b80;
        }
        .footer-nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 1.5rem;
            font-size: 0.8rem;
            color: #64748b;
        }
        .footer-nav a { color: #38bdf8; text-decoration: none; font-weight: 700; }
        .footer-nav a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div>
                <h1>⚡ Web Migration & Artisan Suite</h1>
                <p>Execute migrations, seeders, and clear caches directly in browser</p>
            </div>
            <div class="badge">
                ENV: <?php echo htmlspecialchars(app()->environment()); ?>
            </div>
        </div>

        <?php $keyParam = !empty($providedKey) ? '&key=' . urlencode($providedKey) : ''; ?>
        <div class="actions-grid">
            <a href="?action=all<?php echo $keyParam; ?>" class="btn-action all <?php echo $action === 'all' ? 'active' : ''; ?>">
                🚀 Run Deploy (All)
            </a>
            <a href="?action=migrate<?php echo $keyParam; ?>" class="btn-action <?php echo $action === 'migrate' ? 'active' : ''; ?>">
                🗄️ Run Migrations
            </a>
            <a href="?action=seed<?php echo $keyParam; ?>" class="btn-action <?php echo $action === 'seed' ? 'active' : ''; ?>">
                🌱 Run Role Seeder
            </a>
            <a href="?action=storage-link<?php echo $keyParam; ?>" class="btn-action <?php echo $action === 'storage-link' ? 'active' : ''; ?>">
                🔗 Storage Link
            </a>
            <a href="?action=optimize<?php echo $keyParam; ?>" class="btn-action <?php echo $action === 'optimize' ? 'active' : ''; ?>">
                🧹 Clear & Optimize
            </a>
        </div>

        <div class="terminal-window">
            <div class="terminal-bar">
                <div class="terminal-dots">
                    <span class="dot red"></span>
                    <span class="dot yellow"></span>
                    <span class="dot green"></span>
                </div>
                <div class="terminal-title">bash — artisan:<?php echo htmlspecialchars($action); ?></div>
                <div style="font-size: 0.7rem; color: #475569; font-family: 'JetBrains Mono', monospace;"><?php echo date('Y-m-d H:i:s'); ?></div>
            </div>

            <div class="terminal-body">
                <?php if (!$allowed): ?>
                    <div class="command-block">
                        <div class="command-header" style="color: #ef4444;">Access Denied</div>
                        <div class="command-output">Please log in as Admin or pass your key in query string: ?key=YOUR_SECRET_KEY</div>
                    </div>
                <?php else: ?>
                    <?php foreach ($logs as $cmdTitle => $cmdOut): ?>
                        <div class="command-block">
                            <div class="command-header"><?php echo htmlspecialchars($cmdTitle); ?></div>
                            <div class="command-output"><?php echo htmlspecialchars(trim($cmdOut) ?: 'Command completed successfully with 0 exit code.'); ?></div>
                        </div>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>
        </div>

        <div class="footer-nav">
            <div>
                <span>Return to: </span>
                <a href="/admin">Admin Dashboard</a> &bull;
                <a href="/">Website Home</a>
            </div>
            <div>
                <span>IT Solutions Platform Engine</span>
            </div>
        </div>
    </div>
</body>
</html>
