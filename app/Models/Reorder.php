<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Reorder extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'item_id',
        'client_name',
        'client_email',
        'client_phone',
        'company_name',
        'package_name',
        'billing_cycle',
        'price',
        'currency',
        'start_date',
        'finish_date',
        'status',
        'auto_renewal',
        'reminder_days_before',
        'last_reminder_sent_at',
        'reminder_count',
        'reminder_channel',
        'notes',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'start_date' => 'date:Y-m-d',
        'finish_date' => 'date:Y-m-d',
        'last_reminder_sent_at' => 'datetime',
        'auto_renewal' => 'boolean',
        'reminder_days_before' => 'integer',
        'reminder_count' => 'integer',
    ];

    protected $appends = [
        'days_remaining',
        'computed_status',
        'is_urgent',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }

    public function getDaysRemainingAttribute(): int
    {
        if (!$this->finish_date) {
            return 0;
        }
        $finish = Carbon::parse($this->finish_date)->startOfDay();
        $today = Carbon::today();
        return (int) $today->diffInDays($finish, false);
    }

    public function getComputedStatusAttribute(): string
    {
        if ($this->status === 'cancelled' || $this->status === 'renewed') {
            return $this->status;
        }

        $days = $this->days_remaining;
        if ($days < 0) {
            return 'expired';
        }
        if ($days <= ($this->reminder_days_before ?: 7)) {
            return 'expiring_soon';
        }
        return 'active';
    }

    public function getIsUrgentAttribute(): bool
    {
        $days = $this->days_remaining;
        return $this->status !== 'cancelled' && $this->status !== 'renewed' && $days <= ($this->reminder_days_before ?: 7);
    }
}
