<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quotation Proposal - {{ $siteName }}</title>
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
            max-width: 620px;
            margin: 30px auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }
        .header {
            background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #2563eb 100%);
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
            margin: 8px 0 0;
            font-size: 13px;
            color: #93c5fd;
            text-transform: uppercase;
            letter-spacing: 1.2px;
            font-weight: 700;
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
        .quote-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 24px;
        }
        .quote-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px dashed #e2e8f0;
            font-size: 13px;
        }
        .quote-row:last-child {
            border-bottom: none;
            padding-top: 12px;
            font-size: 15px;
            font-weight: 800;
            color: #1e3a8a;
        }
        .quote-label {
            color: #64748b;
            font-weight: 600;
        }
        .quote-val {
            color: #0f172a;
            font-weight: 700;
            text-align: right;
        }
        .milestones-card {
            background: #eff6ff;
            border: 1px solid #bfdbfe;
            border-radius: 12px;
            padding: 16px 20px;
            margin-bottom: 24px;
        }
        .milestones-title {
            font-size: 12px;
            font-weight: 800;
            color: #1d4ed8;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 10px;
        }
        .milestone-item {
            font-size: 13px;
            color: #1e293b;
            padding: 4px 0;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .btn-wrapper {
            text-align: center;
            margin: 32px 0 20px;
        }
        .btn {
            display: inline-block;
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            color: #ffffff !important;
            text-decoration: none;
            font-size: 15px;
            font-weight: 700;
            padding: 14px 32px;
            border-radius: 10px;
            box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35);
        }
        .footer {
            background: #f1f5f9;
            padding: 24px 30px;
            text-align: center;
            font-size: 12px;
            color: #64748b;
            border-top: 1px solid #e2e8f0;
        }
        .footer p {
            margin: 4px 0;
        }
        .footer a {
            color: #2563eb;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            @if(!empty($siteLogo))
                <div style="margin-bottom: 12px;">
                    <img src="{{ $siteLogo }}" alt="{{ $siteName }}" style="max-height: 48px; max-width: 180px; object-contain: fit;" />
                </div>
            @endif
            <h1>{{ $siteName }}</h1>
            <p>Official Quotation &amp; Proposal</p>
        </div>

        <div class="content">
            <div class="greeting">Hello {{ $quote->name }},</div>
            <div class="text">
                Thank you for considering <strong>{{ $siteName }}</strong> for your technical project. We have prepared a customized quotation and scope of work proposal for your review.
            </div>

            <div class="quote-card">
                <div class="quote-row">
                    <span class="quote-label">Quotation Ref:</span>
                    <span class="quote-val">#{{ $quote->quote_number }}</span>
                </div>
                <div class="quote-row">
                    <span class="quote-label">Project Scope:</span>
                    <span class="quote-val">{{ $quote->project_title ?: ($quote->item ? $quote->item->name : 'Custom Software Solution') }}</span>
                </div>
                @if($quote->valid_until)
                <div class="quote-row">
                    <span class="quote-label">Valid Until:</span>
                    <span class="quote-val">{{ \Carbon\Carbon::parse($quote->valid_until)->format('d M, Y') }}</span>
                </div>
                @endif
                <div class="quote-row">
                    <span class="quote-label">Total Proposed Value:</span>
                    <span class="quote-val">৳{{ number_format($quote->total_amount ?: ($quote->estimated_budget ?: 0), 2) }} {{ $quote->currency ?: 'BDT' }}</span>
                </div>
            </div>

            @if(!empty($quote->payment_terms) && is_array($quote->payment_terms))
            <div class="milestones-card">
                <div class="milestones-title">Proposed Payment Schedule:</div>
                @foreach($quote->payment_terms as $term)
                    <div class="milestone-item">
                        <span>&bull;</span>
                        <strong>{{ $term['percentage'] ?? '' }}%</strong>
                        <span>- {{ $term['condition'] ?? ($term['phase_name'] ?? 'Milestone') }}</span>
                        @if(!empty($term['amount']))
                            <span style="margin-left: auto; font-weight: 700; color: #1e3a8a;">৳{{ number_format($term['amount'], 2) }}</span>
                        @endif
                    </div>
                @endforeach
            </div>
            @endif

            <div class="text">
                You can review the full project breakdown, phase deliverables, and digitally sign the agreement to initiate the project directly online.
            </div>

            <div class="btn-wrapper">
                <a href="{{ $publicUrl }}" class="btn" target="_blank">
                    View Proposal &amp; Sign Work Order &rarr;
                </a>
            </div>

            <p style="font-size: 12px; color: #94a3b8; text-align: center; margin-top: 15px;">
                Link: <a href="{{ $publicUrl }}" style="color: #2563eb; word-break: break-all;">{{ $publicUrl }}</a>
            </p>
        </div>

        <div class="footer">
            <p><strong>{{ $siteName }}</strong> &bull; Professional IT &amp; Software Solutions</p>
            <p>{{ $companyAddress }}</p>
            <p>Phone: {{ $contactPhone }} | Email: <a href="mailto:{{ $contactEmail }}">{{ $contactEmail }}</a></p>
            <p style="margin-top: 10px; font-size: 11px; color: #94a3b8;">
                This document is a confidential commercial proposal intended solely for {{ $quote->name }} / {{ $quote->company_name ?: '' }}.
            </p>
        </div>
    </div>
</body>
</html>
