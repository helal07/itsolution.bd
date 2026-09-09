<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>System Migration & Maintenance Suite</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Plus+Jakarta+Sans:wght@500;700;800&display=swap" rel="stylesheet">
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        body {
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #0f172a;
            color: #f8fafc;
            min-height: 100vh;
            padding: 2rem 1rem;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .container {
            width: 100%;
            max-width: 900px;
        }
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
        .header h1 {
            font-size: 1.35rem;
            font-weight: 800;
            color: #ffffff;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        .header p {
            font-size: 0.8rem;
            color: #94a3b8;
            margin-top: 0.25rem;
        }
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
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
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
        .btn-action.all:hover {
            opacity: 0.95;
            transform: translateY(-1px);
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
        .terminal-dots {
            display: flex;
            gap: 0.4rem;
        }
        .dot {
            width: 11px;
            height: 11px;
            border-radius: 50%;
        }
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
        .command-block {
            margin-bottom: 1.5rem;
        }
        .command-block:last-child {
            margin-bottom: 0;
        }
        .command-header {
            color: #38bdf8;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 0.5rem;
        }
        .command-header::before {
            content: '$';
            color: #10b981;
        }
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
        .footer-nav a {
            color: #38bdf8;
            text-decoration: none;
            font-weight: 700;
        }
        .footer-nav a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div>
                <h1>⚡ Web Migration & Artisan Suite</h1>
                <p>Run Laravel migrations, seeders, storage links, and optimize caching via browser</p>
            </div>
            <div class="badge">
                ENV: {{ app()->environment() }}
            </div>
        </div>

        <!-- Action Buttons -->
        @php
            $keyQuery = !empty($providedKey) ? '&key=' . urlencode($providedKey) : '';
        @endphp
        <div class="actions-grid">
            <a href="/run-migrations?action=all{{ $keyQuery }}" class="btn-action all {{ $currentAction === 'all' ? 'active' : '' }}">
                🚀 Run Deploy Package (All)
            </a>
            <a href="/run-migrations?action=migrate{{ $keyQuery }}" class="btn-action {{ $currentAction === 'migrate' ? 'active' : '' }}">
                🗄️ Run Migrations
            </a>
            <a href="/run-migrations?action=seed{{ $keyQuery }}" class="btn-action {{ $currentAction === 'seed' ? 'active' : '' }}">
                🌱 Run Role Seeder
            </a>
            <a href="/run-migrations?action=storage-link{{ $keyQuery }}" class="btn-action {{ $currentAction === 'storage-link' ? 'active' : '' }}">
                🔗 Storage Link
            </a>
            <a href="/run-migrations?action=optimize{{ $keyQuery }}" class="btn-action {{ $currentAction === 'optimize' ? 'active' : '' }}">
                🧹 Clear & Optimize
            </a>
        </div>

        <!-- Terminal Output -->
        <div class="terminal-window">
            <div class="terminal-bar">
                <div class="terminal-dots">
                    <span class="dot red"></span>
                    <span class="dot yellow"></span>
                    <span class="dot green"></span>
                </div>
                <div class="terminal-title">bash — artisan:{{ $currentAction }}</div>
                <div style="font-size: 0.7rem; color: #475569; font-family: 'JetBrains Mono', monospace;">{{ date('Y-m-d H:i:s') }}</div>
            </div>

            <div class="terminal-body">
                @foreach($logs as $title => $content)
                    <div class="command-block">
                        <div class="command-header">{{ $title }}</div>
                        <div class="command-output">{{ trim($content) ?: 'Command completed successfully with 0 exit code.' }}</div>
                    </div>
                @endforeach
            </div>
        </div>

        <!-- Footer Links -->
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
