<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class ChatQuestion extends Model
{
    use HasFactory;

    public const CACHE_KEY = 'global_active_chat_questions';
    public const CACHE_TTL = 86400; // 24 hours

    protected $fillable = [
        'question',
        'answer',
        'keywords',
        'category',
        'action_label',
        'action_url',
        'suggested_options',
        'is_quick_option',
        'is_active',
        'sort_order',
        'click_count',
    ];

    protected $casts = [
        'suggested_options' => 'array',
        'is_quick_option' => 'boolean',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
        'click_count' => 'integer',
    ];

    /**
     * Scope for active questions
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for quick starter options
     */
    public function scopeQuickOptions($query)
    {
        return $query->where('is_quick_option', true)->where('is_active', true);
    }

    /**
     * Scope ordered
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order', 'asc')->orderBy('id', 'asc');
    }

    /**
     * Retrieve all active chat questions with caching
     */
    public static function allActiveCached()
    {
        return Cache::remember(self::CACHE_KEY, self::CACHE_TTL, function () {
            return static::active()
                ->ordered()
                ->get();
        });
    }

    /**
     * Invalidate cache on model events
     */
    public static function flushCache(): void
    {
        Cache::forget(self::CACHE_KEY);
    }

    protected static function booted()
    {
        static::saved(function () {
            static::flushCache();
        });

        static::deleted(function () {
            static::flushCache();
        });
    }
}
