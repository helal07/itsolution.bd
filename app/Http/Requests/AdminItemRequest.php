<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AdminItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->isAdmin();
    }

    public function rules(): array
    {
        $itemId = $this->route('item') ? $this->route('item')->id : null;

        return [
            'category_id' => ['required', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:150'],
            'slug' => ['required', 'string', 'max:180', 'unique:items,slug,' . $itemId],
            'short_description' => ['nullable', 'string', 'max:500'],
            'description' => ['nullable', 'string'],
            'thumbnail' => ['nullable', 'string', 'max:500'],
            'thumbnail_file' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp,svg,gif', 'max:10240'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'is_purchasable' => ['nullable'],
            'is_featured' => ['nullable'],
            'status' => ['required', 'in:draft,published'],
        ];
    }
}
