<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'designation',
        'department',
        'status',
        'salary',
        'joined_date',
        'avatar',
        'user_id',
    ];

    protected $casts = [
        'salary' => 'decimal:2',
        'joined_date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function tasks()
    {
        return $this->hasMany(Task::class, 'assigned_to');
    }

    public function taskSteps()
    {
        return $this->hasMany(TaskStep::class, 'assigned_to');
    }

    public function dailyWorkLogs()
    {
        return $this->hasMany(DailyWorkLog::class, 'employee_id');
    }
}
