<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AdminPortfolioRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->isAdmin();
    }

    public function rules(): array
    {
        $portfolioId = $this->route('portfolio') ? $this->route('portfolio')->id : null;

        return [
            'item_id' => ['nullable', 'exists:items,id'],
            'client_id' => ['nullable', 'exists:clients,id'],
            'title' => ['required', 'string', 'max:180'],
            'slug' => ['required', 'string', 'max:200', 'unique:portfolios,slug,' . $portfolioId],
            'type' => ['required', 'in:website,software,pos_software'],
            'cover_image' => ['nullable', 'string', 'max:500'],
            'cover_image_file' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp,svg,gif', 'max:10240'],
            'description' => ['nullable', 'string'],
            'project_url' => ['nullable', 'url', 'max:255'],
            'is_featured' => ['nullable'],
            'completed_at' => ['nullable', 'date'],
        ];
    }
}
