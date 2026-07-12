<?php

namespace App\Http\Requests\DonorProfile;

class UpdateDonorProfileRequest extends StoreDonorProfileRequest
{
    public function rules(): array
    {
        $rules = parent::rules();
        $rules['donation_types'] = ['sometimes', 'array', 'min:1'];

        return $rules;
    }
}
