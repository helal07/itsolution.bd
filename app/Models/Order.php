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
        'quote_id',
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

    /**
     * Recalculate and synchronize overall order progress and status from linked tasks and subtasks.
     */
    public function recalculateProgress(): void
    {
        $tasks = $this->tasks()->with('steps')->get();
        if ($tasks->isEmpty()) {
            return;
        }

        $totalSteps = 0;
        $completedSteps = 0;
        $hasSteps = false;

        foreach ($tasks as $task) {
            $count = $task->steps->count();
            if ($count > 0) {
                $hasSteps = true;
                $totalSteps += $count;
                $completedSteps += $task->steps->where('is_completed', true)->count();
            }
        }

        if ($hasSteps && $totalSteps > 0) {
            $calculatedProgress = (int) round(($completedSteps / $totalSteps) * 100);
        } else {
            $calculatedProgress = (int) round($tasks->avg('progress') ?? 0);
        }

        $calculatedProgress = min(100, max(0, $calculatedProgress));

        $updates = ['progress' => $calculatedProgress];

        if ($calculatedProgress === 100) {
            if (!in_array($this->status, ['cancelled', 'failed', 'refunded'])) {
                $updates['status'] = 'completed';
            }
        } elseif ($calculatedProgress > 0) {
            if ($this->status === 'pending' || $this->status === 'completed') {
                $updates['status'] = 'processing';
            }
        }

        $this->update($updates);
    }

    public function quote(): BelongsTo
    {
        return $this->belongsTo(Quote::class);
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
