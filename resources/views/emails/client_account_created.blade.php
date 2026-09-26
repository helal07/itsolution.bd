<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Created - {{ $siteName }}</title>
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
            background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
            padding: 36px 30px;
            text-align: center;
            color: #ffffff;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 800;
            letter-spacing: -0.5px;
        }
        .header p {
            margin: 6px 0 0;
            font-size: 13px;
            color: #93c5fd;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 600;
        }
        .content {
            padding: 32px 30px;
        }
        .greeting {
            font-size: 18px;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 12px;
        }
        .text {
            font-size: 14px;
            line-height: 1.6;
            color: #475569;
            margin-bottom: 24px;
        }
        .credentials-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-left: 4px solid #2563eb;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 24px;
        }
        .cred-title {
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #64748b;
            margin-bottom: 12px;
        }
        .cred-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            font-size: 13px;
        }
        .cred-label {
            color: #64748b;
            font-weight: 600;
        }
        .cred-val {
            font-family: 'Courier New', Courier, monospace;
            font-weight: 700;
            color: #0f172a;
            background: #e2e8f0;
            padding: 2px 8px;
            border-radius: 4px;
        }
        .order-card {
            background: #eff6ff;
            border: 1px solid #bfdbfe;
            border-radius: 12px;
            padding: 16px 20px;
            margin-bottom: 24px;
        }
        .btn-container {
            text-align: center;
            margin: 32px 0;
        }
        .btn {
            display: inline-block;
            background: #2563eb;
            color: #ffffff !important;
            padding: 14px 32px;
            border-radius: 12px;
            font-weight: 700;
            font-size: 14px;
            text-decoration: none;
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }
        .notice {
            background: #fffbeb;
            border: 1px solid #fde68a;
            border-radius: 10px;
            padding: 14px 16px;
            font-size: 12px;
            color: #92400e;
            line-height: 1.5;
            margin-bottom: 24px;
        }
        .footer {
            background: #f8fafc;
            border-top: 1px solid #f1f5f9;
            padding: 24px 30px;
            text-align: center;
            font-size: 12px;
            color: #64748b;
        }
        .footer a {
            color: #2563eb;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>{{ $siteName }}</h1>
            <p>Client Portal & Work Order Credentials</p>
        </div>

        <!-- Content -->
        <div class="content">
            <div class="greeting">Hello {{ $user->name }},</div>
            <div class="text">
                Welcome to <strong>{{ $siteName }}</strong>. We have finalized your work order and automatically generated your client access account so you can submit your detailed requirements, track progress, and communicate directly with our team.
            </div>

            <!-- Credentials Box -->
            <div class="credentials-card">
                <div class="cred-title">Your Login Credentials (লগইন তথ্য)</div>
                <div class="cred-row">
                    <span class="cred-label">Login URL:</span>
                    <span class="cred-val">{{ $loginUrl }}</span>
                </div>
                <div class="cred-row">
                    <span class="cred-label">Email / Username:</span>
                    <span class="cred-val">{{ $user->email }}</span>
                </div>
                <div class="cred-row">
                    <span class="cred-label">Temporary Password:</span>
                    <span class="cred-val">{{ $plainPassword }}</span>
                </div>
            </div>

            @if($order)
            <!-- Work Order Box -->
            <div class="order-card">
                <div style="font-weight: 700; color: #1e40af; font-size: 13px; margin-bottom: 6px;">
                    Work Order #{{ $order->id }} &bull; {{ $order->project_name }}
                </div>
                <div style="font-size: 12px; color: #3b82f6;">
                    Total Budget: <strong>৳{{ number_format((float)$order->amount, 2) }} {{ $order->currency }}</strong> &bull; Status: <span style="text-transform: capitalize;">{{ $order->status }}</span>
                </div>
            </div>
            @endif

            <!-- Button CTA -->
            <div class="btn-container">
                <a href="{{ $requirementsUrl }}" class="btn" target="_blank">
                    Login & Submit Requirements
                </a>
            </div>

            <!-- Notice / Instructions -->
            <div class="notice">
                <strong>Next Steps:</strong>
                <ol style="margin: 6px 0 0 16px; padding: 0;">
                    <li>Log in to your account using the credentials above.</li>
                    <li>Go to your Work Order and submit your detailed instructions, reference images, audio voice notes, or video walkthroughs.</li>
                    <li>For your security, please update your password after your first login via the Profile Settings page.</li>
                </ol>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p style="margin: 0 0 6px;">Need help or have questions? Contact our engineering team:</p>
            <p style="margin: 0;">
                Email: <a href="mailto:{{ $contactEmail }}">{{ $contactEmail }}</a> &bull; Phone: {{ $contactPhone }}
            </p>
            <p style="margin: 12px 0 0; font-size: 11px; color: #94a3b8;">
                &copy; {{ date('Y') }} {{ $siteName }}. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>
