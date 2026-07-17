<?php

namespace App\Http\Requests\ContactRequest;

use App\Enums\ContactRequestStatus;
use App\Models\ContactRequest;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateContactRequestStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var ContactRequest $contactRequest */
        $contactRequest = $this->route('contact_request');

        return $this->user()->can('respond', $contactRequest);
    }

    public function rules(): array
    {
        return [
            'status' => ['required', Rule::in([
                ContactRequestStatus::Aceita->value,
                ContactRequestStatus::Recusada->value,
            ])],
        ];
    }
}
