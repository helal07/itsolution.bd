<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class OrderAttachment extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_requirement_id',
        'file_type',
        'file_path',
        'external_url',
        'original_name',
        'file_size_kb',
        'duration_seconds',
        'uploaded_by',
    ];

    protected $appends = [
        'url',
    ];

    public function getUrlAttribute(): ?string
    {
        if ($this->file_type === 'link' || !empty($this->external_url)) {
            return $this->external_url;
        }

        if ($this->file_path) {
            return asset('storage/' . $this->file_path);
        }

        return null;
    }

    public function requirement(): BelongsTo
    {
        return $this->belongsTo(OrderRequirement::class, 'order_requirement_id');
    }

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
