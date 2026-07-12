<?php

namespace App\Http\Resources;

use App\Models\DonationRequest;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin DonationRequest */
class DonationRequestResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'pet' => PetResource::make($this->whenLoaded('pet')),
            'species' => $this->species->value,
            'species_label' => $this->species->label(),
            'blood_type_needed' => $this->blood_type_needed?->value,
            'blood_type_needed_label' => $this->blood_type_needed?->label(),
            'donation_type' => $this->donation_type->value,
            'donation_type_label' => $this->donation_type->label(),
            'status' => $this->status->value,
            'status_label' => $this->status->label(),
            'expires_at' => $this->expires_at,
            'created_at' => $this->created_at,
        ];
    }
}
