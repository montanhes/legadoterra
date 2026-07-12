<?php

namespace App\Http\Resources;

use App\Models\Pet;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Pet */
class PetResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'species' => $this->species->value,
            'species_label' => $this->species->label(),
            'sex' => $this->sex->value,
            'sex_label' => $this->sex->label(),
            'breed' => $this->breed,
            'weight' => $this->weight,
            'birthdate' => $this->birthdate?->toDateString(),
            'photo_path' => $this->photo_path,
            'castrado' => $this->castrado,
            'lat' => $this->lat,
            'lng' => $this->lng,
            'donor_profile' => DonorProfileResource::make($this->whenLoaded('donorProfile')),
            'created_at' => $this->created_at,
        ];
    }
}
