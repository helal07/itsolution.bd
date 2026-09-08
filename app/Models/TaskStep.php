<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TaskStep extends Model
{
    use HasFactory;

    protected $fillable = [
        'task_id',
        'title',
        'assigned_to',
        'is_completed',
        'completed_at',
        'completed_by',
        'sort_order',
    ];

    protected $casts = [
        'is_completed' => 'boolean',
        'completed_at' => 'datetime',
    ];

    public function task()
    {
        return $this->belongsTo(Task::class);
    }

    public function assignee()
    {
        return $this->belongsTo(Employee::class, 'assigned_to');
    }

    public function completer()
    {
        return $this->belongsTo(User::class, 'completed_by');
    }
}
