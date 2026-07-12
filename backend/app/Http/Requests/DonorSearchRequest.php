<?php

namespace App\Http\Requests;

use App\Enums\BloodType;
use App\Enums\Species;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class DonorSearchRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'lat' => ['required', 'numeric', 'between:-90,90'],
            'lng' => ['required', 'numeric', 'between:-180,180'],
            'radius_km' => ['sometimes', 'numeric', 'min:1', 'max:200'],
            'species' => ['sometimes', Rule::enum(Species::class)],
            'blood_type' => ['sometimes', Rule::enum(BloodType::class)],
        ];
    }
}
