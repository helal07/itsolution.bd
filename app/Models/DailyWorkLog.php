<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DailyWorkLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'employee_id',
        'log_date',
        'calls_count',
        'call_logs',
        'client_feedbacks',
        'tasks_summary',
        'completed_task_ids',
        'assigned_task_logs',
        'other_work_logs',
        'hours_worked',
        'challenges_notes',
        'admin_notes',
    ];

    protected $casts = [
        'log_date' => 'date:Y-m-d',
        'calls_count' => 'integer',
        'call_logs' => 'array',
        'assigned_task_logs' => 'array',
        'other_work_logs' => 'array',
        'completed_task_ids' => 'array',
        'hours_worked' => 'decimal:1',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}
