<?php

namespace App\Mail;

use App\Models\Quote;
use App\Models\SiteSetting;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class QuoteProposalMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Quote $quote
    ) {}

    public function envelope(): Envelope
    {
        $siteName = SiteSetting::get('site_name', config('app.name', 'IT Solution'));
        $title = $this->quote->project_title ?: ($this->quote->item ? $this->quote->item->name : 'Project Solution');

        return new Envelope(
            subject: "Quotation Proposal: {$title} (#{$this->quote->quote_number}) - {$siteName}",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.quote_proposal',
            with: [
                'quote' => $this->quote,
                'siteName' => SiteSetting::get('site_name', config('app.name', 'IT Solution')),
                'siteLogo' => SiteSetting::get('site_logo'),
                'contactEmail' => SiteSetting::get('contact_email', 'contact@itsolution.bd'),
                'contactPhone' => SiteSetting::get('contact_phone', '+880 1800-000000'),
                'companyAddress' => SiteSetting::get('company_address', 'Dhaka, Bangladesh'),
                'publicUrl' => $this->quote->public_url,
            ],
        );
    }
}
