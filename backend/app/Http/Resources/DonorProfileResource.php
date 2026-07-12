<?php

namespace App\Http\Resources;

use App\Models\DonorProfile;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin DonorProfile */
class DonorProfileResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'blood_type' => $this->blood_type?->value,
            'blood_type_label' => $this->blood_type?->label(),
            'typing_status' => $this->typing_status->value,
            'typing_status_label' => $this->typing_status->label(),
            'eligibility_status' => $this->eligibility_status->value,
            'eligibility_status_label' => $this->eligibility_status->label(),
            'last_donation_at' => $this->last_donation_at?->toDateString(),
            'donation_types' => $this->donationTypes()->map(fn ($type) => [
                'value' => $type->value,
                'label' => $type->label(),
            ]),
        ];
    }
}
