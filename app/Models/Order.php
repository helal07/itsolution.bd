<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'client_id',
        'item_id',
        'project_name',
        'amount',
        'paid_amount',
        'discount',
        'currency',
        'status',
        'payment_status',
        'progress',
        'payment_method',
        'transaction_id',
        'added_by',
        'delivery_date',
        'due_date',
        'notes',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'paid_amount' => 'decimal:2',
        'discount' => 'decimal:2',
        'progress' => 'integer',
        'delivery_date' => 'date',
        'due_date' => 'date',
    ];

    protected $appends = [
        'net_amount',
        'due_amount',
    ];

    /**
     * Net payable after discount.
     */
    public function getNetAmountAttribute(): float
    {
        return (float) max(0, round((float) $this->amount - (float) ($this->discount ?? 0), 2));
    }

    /**
     * Outstanding due balance.
     */
    public function getDueAmountAttribute(): float
    {
        return (float) max(0, round($this->net_amount - (float) ($this->paid_amount ?? 0), 2));
    }

    /**
     * Recalculate payment_status based on paid_amount vs net_amount.
     */
    public function syncPaymentStatus(): void
    {
        $net = $this->net_amount;
        $paid = (float) $this->paid_amount;

        if ($paid <= 0) {
            $this->payment_status = 'due';
        } elseif ($paid >= $net) {
            $this->payment_status = 'paid';
        } else {
            $this->payment_status = 'partial';
        }
        $this->saveQuietly();
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(ClientPayment::class);
    }

    public function requirements(): HasMany
    {
        return $this->hasMany(OrderRequirement::class)->orderBy('id', 'desc');
    }

    public function latestRequirement()
    {
        return $this->hasOne(OrderRequirement::class)->latestOfMany();
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }
}
