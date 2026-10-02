<?php

namespace App\Mail;

use App\Models\Order;
use App\Models\OrderAttachment;
use App\Models\OrderRequirement;
use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ClientDirectiveNotificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Order $order,
        public OrderRequirement $requirement,
        public ?OrderAttachment $attachment = null,
        public ?User $uploader = null,
        public string $type = 'New Requirement / Directive'
    ) {}

    public function envelope(): Envelope
    {
        $siteName = SiteSetting::get('site_name', config('app.name', 'IT Solution'));
        $projName = $this->order->project_name ?: "Order #{$this->order->id}";
        return new Envelope(
            subject: "[Client Directive] {$this->type} - {$projName} ({$siteName})",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.client_directive_notification',
            with: [
                'order' => $this->order,
                'requirement' => $this->requirement,
                'attachment' => $this->attachment,
                'uploader' => $this->uploader,
                'type' => $this->type,
                'siteName' => SiteSetting::get('site_name', config('app.name', 'IT Solution')),
                'workspaceUrl' => url("/orders/{$this->order->id}/requirements"),
                'taskUrl' => url("/admin/tasks?search={$this->order->id}"),
            ],
        );
    }
}
