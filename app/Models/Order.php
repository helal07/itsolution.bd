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
        'item_id',
        'project_name',
        'amount',
        'currency',
        'status',
        'progress',
        'payment_method',
        'transaction_id',
        'added_by',
        'delivery_date',
        'notes',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'progress' => 'integer',
        'delivery_date' => 'date',
    ];

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
}
