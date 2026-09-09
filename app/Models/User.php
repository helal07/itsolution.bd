<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
    ];

    protected $appends = [
        'avatar',
        'is_admin',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin' || (method_exists($this, 'hasAnyRole') && $this->hasAnyRole(['Super Admin', 'Admin']));
    }

    public function isClient(): bool
    {
        return $this->role === 'client' || (method_exists($this, 'hasRole') && $this->hasRole('Client'));
    }

    public function isStaff(): bool
    {
        return !$this->isClient();
    }

    public function getIsAdminAttribute(): bool
    {
        return $this->isAdmin();
    }

    public function employee()
    {
        return $this->hasOne(Employee::class);
    }

    public function getAvatarAttribute(): ?string
    {
        if ($this->relationLoaded('employee') && $this->employee && $this->employee->avatar) {
            return $this->employee->avatar;
        }

        $emp = Employee::where('user_id', $this->id)->orWhere('email', $this->email)->first();
        return $emp?->avatar;
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function dailyWorkLogs()
    {
        return $this->hasMany(DailyWorkLog::class);
    }
}
