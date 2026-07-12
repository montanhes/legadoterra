<?php

namespace App\Http\Resources;

use App\Models\Pet;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Pet */
class DonorSearchResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'species' => $this->species->value,
            'species_label' => $this->species->label(),
            'breed' => $this->breed,
            'photo_path' => $this->photo_path,
            'distance_km' => round((float) $this->distance_km, 1),
            'donor_profile' => DonorProfileResource::make($this->donorProfile),
            'tutor' => [
                'name' => $this->tutor->name,
                'phone' => $this->tutor->phone,
            ],
        ];
    }
}
