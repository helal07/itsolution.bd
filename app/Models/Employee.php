<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;

    protected $fillable = [
        'prefix',
        'first_name',
        'last_name',
        'name',
        'username',
        'email',
        'phone',
        'alternate_phone',
        'family_phone',
        'designation',
        'department',
        'status',
        'salary',
        'sales_commission_percentage',
        'max_sales_discount_percent',
        'joined_date',
        'dob',
        'gender',
        'marital_status',
        'blood_group',
        'avatar',
        'facebook_link',
        'twitter_link',
        'social_media_1',
        'social_media_2',
        'custom_field_1',
        'custom_field_2',
        'custom_field_3',
        'custom_field_4',
        'guardian_name',
        'id_proof_name',
        'id_proof_number',
        'permanent_address',
        'current_address',
        'bank_account_holder_name',
        'bank_account_number',
        'bank_name',
        'bank_identifier_code',
        'bank_branch',
        'tax_payer_id',
        'user_id',
    ];

    protected $casts = [
        'salary' => 'decimal:2',
        'sales_commission_percentage' => 'decimal:2',
        'max_sales_discount_percent' => 'decimal:2',
        'joined_date' => 'date',
        'dob' => 'date',
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

    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }

    public function leaves()
    {
        return $this->hasMany(Leave::class);
    }

    public function salaries()
    {
        return $this->hasMany(Salary::class);
    }
}
