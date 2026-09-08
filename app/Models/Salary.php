<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Salary extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'month',
        'year',
        'base_salary',
        'working_days',
        'present_days',
        'leave_days',
        'absent_days',
        'bonus',
        'deduction',
        'net_salary',
        'status',
        'payment_method',
        'payment_date',
        'transaction_ref',
        'note',
    ];

    protected $casts = [
        'base_salary' => 'decimal:2',
        'bonus' => 'decimal:2',
        'deduction' => 'decimal:2',
        'net_salary' => 'decimal:2',
        'working_days' => 'integer',
        'present_days' => 'integer',
        'leave_days' => 'integer',
        'absent_days' => 'integer',
        'payment_date' => 'date',
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}
