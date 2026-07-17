<?php

namespace App\Http\Resources;

use App\Concerns\JittersCoordinates;
use App\Enums\ContactRequestStatus;
use App\Models\Pet;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Pet */
class DonorSearchResource extends JsonResource
{
    use JittersCoordinates;

    public function toArray(Request $request): array
    {
        $location = $this->jitteredCoordinate((float) $this->lat, (float) $this->lng);
        $contactStatus = $this->contactRequests->first()?->status;

        return [
            'id' => $this->id,
            'name' => $this->name,
            'species' => $this->species->value,
            'species_label' => $this->species->label(),
            'breed' => $this->breed,
            'photo_path' => $this->photo_path,
            'distance_km' => round((float) $this->distance_km, 1),
            'lat' => $location['lat'],
            'lng' => $location['lng'],
            'donor_profile' => DonorProfileResource::make($this->donorProfile),
            'contact_status' => $contactStatus?->value,
            'contact_status_label' => $contactStatus?->label(),
            'tutor' => [
                'name' => $this->tutor->name,
                'phone' => $contactStatus === ContactRequestStatus::Aceita ? $this->tutor->phone : null,
            ],
        ];
    }
}
