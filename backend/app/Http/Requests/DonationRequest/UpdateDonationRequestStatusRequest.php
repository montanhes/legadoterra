<?php

namespace App\Http\Requests\DonationRequest;

use App\Enums\DonationRequestStatus;
use App\Models\DonationRequest;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDonationRequestStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var DonationRequest $donationRequest */
        $donationRequest = $this->route('donation_request');

        return $this->user()->can('update', $donationRequest);
    }

    public function rules(): array
    {
        return [
            'status' => ['required', Rule::in([
                DonationRequestStatus::Atendida->value,
                DonationRequestStatus::Expirada->value,
            ])],
        ];
    }
}
