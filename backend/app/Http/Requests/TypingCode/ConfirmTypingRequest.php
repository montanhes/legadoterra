<?php

namespace App\Http\Requests\TypingCode;

use App\Enums\BloodType;
use App\Models\PetTypingCode;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class ConfirmTypingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isVerifiedClinic();
    }

    public function rules(): array
    {
        return [
            'code' => ['required', 'string', 'size:6'],
            'blood_type' => ['required', Rule::enum(BloodType::class)],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $typingCode = PetTypingCode::query()
                ->where('code', $this->input('code'))
                ->active()
                ->with('pet')
                ->first();

            if (! $typingCode) {
                $validator->errors()->add('code', 'Código inválido ou expirado.');

                return;
            }

            $bloodType = $this->input('blood_type');

            if (! is_null($bloodType) && BloodType::from((int) $bloodType)->species() !== $typingCode->pet->species) {
                $validator->errors()->add(
                    'blood_type',
                    "Tipo sanguíneo inválido para a espécie {$typingCode->pet->species->label()}.",
                );
            }
        });
    }

    public function typingCode(): PetTypingCode
    {
        return PetTypingCode::query()
            ->where('code', $this->validated('code'))
            ->active()
            ->with('pet.donorProfile')
            ->firstOrFail();
    }
}
