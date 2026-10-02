<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Client Directive - {{ $siteName }}</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: #0f172a;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            color: #334155;
            -webkit-font-smoothing: antialiased;
        }
        .container {
            max-width: 600px;
            margin: 30px auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }
        .header {
            background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%);
            padding: 32px 30px;
            text-align: center;
            color: #ffffff;
        }
        .header h1 {
            margin: 0;
            font-size: 22px;
            font-weight: 800;
            letter-spacing: -0.5px;
        }
        .header p {
            margin: 6px 0 0;
            font-size: 12px;
            color: #c7d2fe;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 700;
        }
        .content {
            padding: 30px 28px;
        }
        .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 9999px;
            background: #e0e7ff;
            color: #3730a3;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 16px;
        }
        .greeting {
            font-size: 16px;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 12px;
        }
        .text {
            font-size: 14px;
            line-height: 1.6;
            color: #475569;
            margin-bottom: 20px;
        }
        .directive-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-left: 4px solid #4f46e5;
            border-radius: 12px;
            padding: 18px 20px;
            margin-bottom: 20px;
        }
        .directive-title {
            font-size: 15px;
            font-weight: 800;
            color: #0f172a;
            margin-bottom: 8px;
        }
        .directive-desc {
            font-size: 13px;
            line-height: 1.6;
            color: #334155;
            white-space: pre-wrap;
            margin: 0;
        }
        .meta-table {
            width: 100%;
            margin-bottom: 20px;
            border-collapse: collapse;
            font-size: 13px;
        }
        .meta-table td {
            padding: 8px 0;
            border-bottom: 1px solid #f1f5f9;
        }
        .meta-label {
            color: #64748b;
            font-weight: 600;
            width: 35%;
        }
        .meta-value {
            color: #0f172a;
            font-weight: 700;
        }
        .attachment-card {
            background: #eff6ff;
            border: 1px solid #bfdbfe;
            border-radius: 10px;
            padding: 14px 16px;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .attachment-name {
            font-size: 13px;
            font-weight: 700;
            color: #1e3a8a;
        }
        .attachment-type {
            font-size: 11px;
            color: #3b82f6;
            text-transform: uppercase;
            font-weight: 600;
        }
        .btn-container {
            text-align: center;
            margin: 28px 0 16px;
        }
        .btn {
            display: inline-block;
            background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%);
            color: #ffffff !important;
            text-decoration: none;
            padding: 13px 28px;
            border-radius: 10px;
            font-weight: 700;
            font-size: 14px;
            letter-spacing: 0.2px;
            box-shadow: 0 4px 12px rgba(79, 70, 229, 0.35);
        }
        .footer {
            background: #f8fafc;
            border-top: 1px solid #e2e8f0;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #94a3b8;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <p>{{ $siteName }} &bull; Client Portal Alert</p>
            <h1>{{ $type }}</h1>
        </div>

        <div class="content">
            <span class="badge">Live Client Directive</span>
            
            <p class="greeting">Hello Team,</p>
            <p class="text">
                The client has submitted a new directive / briefing media for 
                <strong>{{ $order->project_name ?: 'Work Order #' . $order->id }}</strong>. Please review the instructions and implement them accordingly:
            </p>

            <table class="meta-table">
                <tr>
                    <td class="meta-label">Work Order:</td>
                    <td class="meta-value">#{{ $order->id }} &bull; {{ $order->project_name ?: $order->item?->name }}</td>
                </tr>
                <tr>
                    <td class="meta-label">Client Name:</td>
                    <td class="meta-value">{{ $uploader?->name ?: ($order->client?->name ?: 'Client') }}</td>
                </tr>
                <tr>
                    <td class="meta-label">Client Email / Phone:</td>
                    <td class="meta-value">{{ $uploader?->email ?: $order->client?->email }} ({{ $order->client?->phone ?: 'N/A' }})</td>
                </tr>
            </table>

            <div class="directive-card">
                <div class="directive-title">{{ $requirement->title }}</div>
                @if($requirement->description)
                    <p class="directive-desc">{{ $requirement->description }}</p>
                @endif
            </div>

            @if($attachment)
                <div class="attachment-card">
                    <div>
                        <div class="attachment-name">{{ $attachment->original_name }}</div>
                        <div class="attachment-type">{{ strtoupper($attachment->file_type) }} &bull; {{ $attachment->file_size_kb ? $attachment->file_size_kb . ' KB' : 'Media' }}</div>
                    </div>
                </div>
            @endif

            <div class="btn-container">
                <a href="{{ $workspaceUrl }}" class="btn" target="_blank">
                    Open Media Workspace &rarr;
                </a>
            </div>
        </div>

        <div class="footer">
            <p>&copy; {{ date('Y') }} {{ $siteName }}. All rights reserved.</p>
            <p>Sent automatically via IT Solution Operations &amp; Commerce Engine.</p>
        </div>
    </div>
</body>
</html>
