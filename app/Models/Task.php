<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'assigned_to',
        'created_by',
        'priority',
        'status',
        'progress',
        'due_date',
        'item_id',
        'order_id',
        'client_id',
    ];

    protected $casts = [
        'progress' => 'integer',
        'due_date' => 'date:Y-m-d',
    ];

    protected $appends = [
        'completed_steps_count',
        'total_steps_count',
    ];

    public function assignee()
    {
        return $this->belongsTo(Employee::class, 'assigned_to');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function steps()
    {
        return $this->hasMany(TaskStep::class)->orderBy('sort_order', 'asc')->orderBy('id', 'asc');
    }

    public function item()
    {
        return $this->belongsTo(Item::class);
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function getTotalStepsCountAttribute(): int
    {
        return $this->steps()->count();
    }

    public function getCompletedStepsCountAttribute(): int
    {
        return $this->steps()->where('is_completed', true)->count();
    }

    /**
     * Recalculate and update the task's progress percentage based on subtask steps.
     */
    public function recalculateProgress(): void
    {
        $total = $this->steps()->count();
        if ($total === 0) {
            return;
        }

        $completed = $this->steps()->where('is_completed', true)->count();
        $percentage = (int) round(($completed / $total) * 100);

        $status = $this->status;
        if ($percentage === 100) {
            $status = 'completed';
        } elseif ($percentage > 0 && $status === 'pending') {
            $status = 'in_progress';
        }

        $this->update([
            'progress' => $percentage,
            'status' => $status,
        ]);
    }
}
