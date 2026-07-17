<?php

namespace App\Http\Requests\ContactRequest;

use App\Models\ContactRequest;
use App\Models\Pet;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StoreContactRequestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'pet_id' => ['required', 'integer', 'exists:pets,id'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $pet = Pet::find($this->input('pet_id'));

            if (! $pet) {
                return;
            }

            if ($pet->tutor_id === $this->user()->id) {
                $validator->errors()->add('pet_id', 'Você não pode solicitar contato do próprio pet.');

                return;
            }

            $alreadyRequested = ContactRequest::where('requester_id', $this->user()->id)
                ->where('pet_id', $pet->id)
                ->exists();

            if ($alreadyRequested) {
                $validator->errors()->add('pet_id', 'Você já solicitou contato para este doador.');
            }
        });
    }
}
