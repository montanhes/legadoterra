<?php

namespace App\Http\Requests\Pet;

use App\Enums\Sex;
use App\Enums\Species;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePetRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'lat' => $this->input('lat') ?? $this->user()?->lat,
            'lng' => $this->input('lng') ?? $this->user()?->lng,
        ]);
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'species' => ['required', Rule::enum(Species::class)],
            'sex' => ['required', Rule::enum(Sex::class)],
            'breed' => ['nullable', 'string', 'max:255'],
            'weight' => ['nullable', 'numeric', 'min:0', 'max:200'],
            'birthdate' => ['nullable', 'date', 'before_or_equal:today'],
            'castrado' => ['boolean'],
            'lat' => ['required', 'numeric', 'between:-90,90'],
            'lng' => ['required', 'numeric', 'between:-180,180'],
        ];
    }

    public function messages(): array
    {
        return [
            'lat.required' => 'Informe a localização do pet ou cadastre seu endereço no perfil primeiro.',
            'lng.required' => 'Informe a localização do pet ou cadastre seu endereço no perfil primeiro.',
        ];
    }
}
