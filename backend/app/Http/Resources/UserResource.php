<?php

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin User */
class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'cep' => $this->cep,
            'city' => $this->city,
            'state' => $this->state,
            'lat' => $this->lat,
            'lng' => $this->lng,
            'clinic' => $this->whenLoaded('clinic', fn () => [
                'id' => $this->clinic->id,
                'name' => $this->clinic->name,
                'verified' => $this->clinic->verified,
            ]),
        ];
    }
}
