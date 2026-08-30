<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AdminClientRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->isAdmin();
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:150'],
            'contact_person' => ['nullable', 'string', 'max:150'],
            'phone' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:150'],
            'website_url' => ['nullable', 'url', 'max:255'],
            'address' => ['nullable', 'string', 'max:255'],
            'logo' => ['nullable', 'string', 'max:500'],
            'logo_file' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp,svg,gif', 'max:10240'],
            'testimonial' => ['nullable', 'string'],
            'rating' => ['nullable', 'integer', 'min:1', 'max:5'],
            'status' => ['required', 'in:active,lead,archived'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
