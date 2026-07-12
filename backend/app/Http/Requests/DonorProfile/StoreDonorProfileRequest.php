<?php

namespace App\Http\Requests\DonorProfile;

use App\Enums\BloodType;
use App\Enums\DonationType;
use App\Enums\TypingStatus;
use App\Models\Pet;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StoreDonorProfileRequest extends FormRequest
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
            'blood_type' => ['nullable', Rule::enum(BloodType::class)],
            // tutor só pode autoinformar — confirmação de clínica é fluxo à parte (portal parceiro)
            'typing_status' => ['sometimes', Rule::in([
                TypingStatus::NaoTestado->value,
                TypingStatus::Autoinformado->value,
            ])],
            'donation_types' => ['required', 'array', 'min:1'],
            'donation_types.*' => [Rule::enum(DonationType::class)],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $bloodType = $this->input('blood_type');

            if (is_null($bloodType)) {
                return;
            }

            /** @var Pet $pet */
            $pet = $this->route('pet');
            $bloodType = BloodType::from((int) $bloodType);

            if ($bloodType->species() !== $pet->species) {
                $validator->errors()->add(
                    'blood_type',
                    "Tipo sanguíneo inválido para a espécie {$pet->species->label()}.",
                );
            }
        });
    }
}
