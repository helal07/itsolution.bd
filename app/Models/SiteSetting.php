<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class SiteSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'value',
    ];

    /**
     * Cache key for all site settings
     */
    public const CACHE_KEY = 'site_settings_all_dict';

    /**
     * Cache TTL in seconds (24 hours)
     */
    public const CACHE_TTL = 86400;

    /**
     * Get all settings from cache or database.
     *
     * @return array<string, string|null>
     */
    public static function allCached(): array
    {
        return Cache::remember(self::CACHE_KEY, self::CACHE_TTL, function () {
            return static::pluck('value', 'key')->toArray();
        });
    }

    /**
     * Get a setting value with fast memory cache fallback.
     *
     * @param string $key
     * @param string|null $default
     * @return string|null
     */
    public static function get(string $key, ?string $default = null): ?string
    {
        $settings = static::allCached();
        return $settings[$key] ?? $default;
    }

    /**
     * Set a setting value and immediately invalidate the cache.
     *
     * @param string $key
     * @param string|null $value
     * @return void
     */
    public static function set(string $key, ?string $value): void
    {
        static::updateOrCreate(['key' => $key], ['value' => $value]);
        Cache::forget(self::CACHE_KEY);
    }

    /**
     * Flush settings cache manually.
     *
     * @return void
     */
    public static function flushCache(): void
    {
        Cache::forget(self::CACHE_KEY);
    }
}
