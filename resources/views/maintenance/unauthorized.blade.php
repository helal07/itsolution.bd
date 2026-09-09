<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>403 — Unauthorized Migration Access</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #0f172a;
            color: #f8fafc;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            padding: 1rem;
        }
        .box {
            background: #1e293b;
            border: 1px solid #334155;
            padding: 2.5rem;
            border-radius: 1rem;
            max-width: 500px;
            text-align: center;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4);
        }
        h1 { font-size: 1.5rem; color: #ef4444; margin-bottom: 0.5rem; }
        p { font-size: 0.9rem; color: #94a3b8; line-height: 1.5; margin-bottom: 1.5rem; }
        a {
            display: inline-block;
            background: #2563eb;
            color: white;
            text-decoration: none;
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            font-weight: bold;
            font-size: 0.85rem;
        }
    </style>
</head>
<body>
    <div class="box">
        <h1>🔒 Restricted Access</h1>
        <p>You must be logged in as an Administrator or provide the valid authorization key in the query string (<code>?key=...</code>) to execute migrations.</p>
        <a href="/login">Login as Admin</a>
    </div>
</body>
</html>
