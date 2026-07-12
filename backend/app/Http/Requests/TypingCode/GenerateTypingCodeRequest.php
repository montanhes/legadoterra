<?php

namespace App\Http\Requests\TypingCode;

use App\Models\Pet;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class GenerateTypingCodeRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var Pet $pet */
        $pet = $this->route('pet');

        return $this->user()->can('update', $pet);
    }

    public function rules(): array
    {
        return [];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            /** @var Pet $pet */
            $pet = $this->route('pet');

            if (! $pet->donorProfile) {
                $validator->errors()->add(
                    'pet',
                    'Cadastre o pet como candidato a doador antes de gerar o código de tipagem.',
                );
            }
        });
    }
}
