<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'icon',
        'description',
        'sort_order',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(Item::class)->orderBy('is_featured', 'desc')->orderBy('name', 'asc');
    }

    public function publishedItems(): HasMany
    {
        return $this->hasMany(Item::class)
            ->where('status', 'published')
            ->orderBy('is_featured', 'desc');
    }
}
