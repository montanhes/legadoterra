<?php

namespace App\Http\Resources;

use App\Concerns\JittersCoordinates;
use App\Models\DonationRequest;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin DonationRequest */
class DonationRequestSearchResource extends JsonResource
{
    use JittersCoordinates;

    public function toArray(Request $request): array
    {
        $location = $this->jitteredCoordinate((float) $this->lat, (float) $this->lng);

        return [
            'id' => $this->id,
            'pet' => [
                'name' => $this->pet->name,
                'species' => $this->pet->species->value,
                'species_label' => $this->pet->species->label(),
                'breed' => $this->pet->breed,
                'photo_path' => $this->pet->photo_path,
            ],
            'blood_type_needed' => $this->blood_type_needed?->value,
            'blood_type_needed_label' => $this->blood_type_needed?->label(),
            'donation_type_label' => $this->donation_type->label(),
            'distance_km' => round((float) $this->distance_km, 1),
            'lat' => $location['lat'],
            'lng' => $location['lng'],
            'expires_at' => $this->expires_at,
            'requester' => [
                'name' => $this->requester->name,
                'phone' => $this->share_phone ? $this->requester->phone : null,
            ],
        ];
    }
}
