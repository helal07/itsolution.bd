<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
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
                do {
                    $token = Str::random(40);
                } while (static::where('public_token', $token)->exists());
                $quote->public_token = $token;
            }

            if (empty($quote->quote_number)) {
                $quote->quote_number = static::generateQuoteNumber();
            }

            if (empty($quote->currency)) {
                $quote->currency = 'BDT';
            }
        });
    }

    /**
     * Generate a collision-free sequential quotation number.
     * Pattern: QUO-{YYYY}-{0001}
     */
    public static function generateQuoteNumber(): string
    {
        $year = date('Y');
        $prefix = "QUO-{$year}-";

        // Query the highest existing sequence number for this year's prefix
        $latest = static::where('quote_number', 'like', "{$prefix}%")
            ->orderByRaw('LENGTH(quote_number) DESC, quote_number DESC')
            ->value('quote_number');

        $nextSeq = 1;
        if ($latest && preg_match('/QUO-\d{4}-(\d+)/', $latest, $matches)) {
            $nextSeq = ((int) $matches[1]) + 1;
        }

        // Loop to guarantee no conflict with any manual, restored, or existing entries
        do {
            $candidate = $prefix . str_pad($nextSeq, 4, '0', STR_PAD_LEFT);
            $exists = static::where('quote_number', $candidate)->exists();
            if ($exists) {
                $nextSeq++;
            }
        } while ($exists);

        return $candidate;
    }

    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }

    public function order(): HasOne
    {
        return $this->hasOne(Order::class);
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
