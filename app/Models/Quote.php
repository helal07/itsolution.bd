<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Quote extends Model
{
    use HasFactory;

    protected $fillable = [
        'quote_number',
        'public_token',
        'project_title',
        'valid_until',
        'currency',
        'subtotal',
        'discount',
        'tax',
        'total_amount',
        'phases',
        'payment_terms',
        'terms_conditions',
        'is_work_order',
        'work_order_number',
        'client_signature',
        'client_signer_name',
        'client_signer_ip',
        'client_signed_at',
        'company_signature',
        'company_signer_name',
        'company_signed_at',
        'item_id',
        'name',
        'company_name',
        'email',
        'phone',
        'message',
        'estimated_budget',
        'notes',
        'status',
    ];

    protected $casts = [
        'phases' => 'array',
        'payment_terms' => 'array',
        'valid_until' => 'date:Y-m-d',
        'client_signed_at' => 'datetime',
        'company_signed_at' => 'datetime',
        'is_work_order' => 'boolean',
        'subtotal' => 'decimal:2',
        'discount' => 'decimal:2',
        'tax' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'estimated_budget' => 'decimal:2',
    ];

    protected $appends = [
        'public_url',
    ];

    protected static function booted(): void
    {
        static::creating(function (Quote $quote) {
            if (empty($quote->public_token)) {
                $quote->public_token = Str::random(40);
            }

            if (empty($quote->quote_number)) {
                $year = date('Y');
                $nextSeq = (static::whereYear('created_at', $year)->count() + 1);
                $quote->quote_number = 'QUO-' . $year . '-' . str_pad($nextSeq, 4, '0', STR_PAD_LEFT);
            }

            if (empty($quote->currency)) {
                $quote->currency = 'BDT';
            }
        });
    }

    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }

    public function getPublicUrlAttribute(): string
    {
        if (empty($this->public_token)) {
            return '';
        }
        return url('/quotes/view/' . $this->public_token);
    }

    /**
     * Check if client has digitally confirmed and signed the quote.
     */
    public function isSigned(): bool
    {
        return !empty($this->client_signature) && !empty($this->client_signed_at);
    }
}
