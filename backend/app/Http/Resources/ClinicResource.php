<?php

namespace App\Http\Resources;

use App\Models\Clinic;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Clinic */
class ClinicResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'city' => $this->city,
            'lat' => $this->lat,
            'lng' => $this->lng,
            'phone' => $this->phone,
            'verified' => $this->verified,
        ];
    }
}
