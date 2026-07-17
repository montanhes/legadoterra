<?php

namespace App\Http\Requests\DonationRequest;

use App\Enums\BloodType;
use App\Enums\DonationType;
use App\Models\Pet;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StoreDonationRequestRequest extends FormRequest
{
    public function authorize(): bool
    {
        $pet = Pet::find($this->input('pet_id'));

        return $pet !== null && $this->user()->id === $pet->tutor_id;
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
            'pet_id' => ['required', 'integer', 'exists:pets,id'],
            'blood_type_needed' => ['nullable', Rule::enum(BloodType::class)],
            'donation_type' => ['required', Rule::enum(DonationType::class)],
            'lat' => ['required', 'numeric', 'between:-90,90'],
            'lng' => ['required', 'numeric', 'between:-180,180'],
            'expires_in_days' => ['sometimes', 'integer', 'min:1', 'max:30'],
            'share_phone' => ['sometimes', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'lat.required' => 'Informe a localização ou cadastre seu endereço no perfil primeiro.',
            'lng.required' => 'Informe a localização ou cadastre seu endereço no perfil primeiro.',
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $bloodType = $this->input('blood_type_needed');

            if (is_null($bloodType)) {
                return;
            }

            $pet = Pet::find($this->input('pet_id'));

            if ($pet && BloodType::from((int) $bloodType)->species() !== $pet->species) {
                $validator->errors()->add(
                    'blood_type_needed',
                    "Tipo sanguíneo inválido para a espécie {$pet->species->label()}.",
                );
            }
        });
    }
}
