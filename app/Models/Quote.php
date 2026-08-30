<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Quote extends Model
{
    use HasFactory;

    protected $fillable = [
        'item_id',
        'name',
        'company_name',
        'email',
        'phone',
        'message',
        'estimated_budget',
        'notes',
        'status',
    ];

    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }
}
