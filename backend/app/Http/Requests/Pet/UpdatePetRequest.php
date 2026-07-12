<?php

namespace App\Http\Requests\Pet;

use App\Enums\Sex;
use App\Enums\Species;
use App\Models\Pet;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePetRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var Pet $pet */
        $pet = $this->route('pet');

        return $this->user()->can('update', $pet);
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'species' => ['sometimes', 'required', Rule::enum(Species::class)],
            'sex' => ['sometimes', 'required', Rule::enum(Sex::class)],
            'breed' => ['nullable', 'string', 'max:255'],
            'weight' => ['nullable', 'numeric', 'min:0', 'max:200'],
            'birthdate' => ['nullable', 'date', 'before_or_equal:today'],
            'castrado' => ['boolean'],
            'lat' => ['sometimes', 'required', 'numeric', 'between:-90,90'],
            'lng' => ['sometimes', 'required', 'numeric', 'between:-180,180'],
        ];
    }
}
