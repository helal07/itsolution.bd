<?php

namespace App\Mail;

use App\Models\Order;
use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ClientAccountCreatedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public User $user,
        public string $plainPassword,
        public ?Order $order = null
    ) {}

    public function envelope(): Envelope
    {
        $siteName = SiteSetting::get('site_name', 'IT SOLUTIONS');
        return new Envelope(
            subject: "Your Account Credentials & Work Order Details - {$siteName}",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.client_account_created',
            with: [
                'user' => $this->user,
                'plainPassword' => $this->plainPassword,
                'order' => $this->order,
                'siteName' => SiteSetting::get('site_name', 'IT SOLUTIONS'),
                'contactEmail' => SiteSetting::get('contact_email', 'contact@itsolution.bd'),
                'contactPhone' => SiteSetting::get('contact_phone', '+880 1800-000000'),
                'loginUrl' => url('/login'),
                'requirementsUrl' => $this->order ? url("/orders/{$this->order->id}/requirements") : url('/dashboard'),
            ],
        );
    }
}
