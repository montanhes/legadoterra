<?php

namespace App\Http\Resources;

use App\Enums\ContactRequestStatus;
use App\Models\ContactRequest;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin ContactRequest */
class ContactRequestResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $isRequester = $request->user()->id === $this->requester_id;

        return [
            'id' => $this->id,
            'direction' => $isRequester ? 'sent' : 'received',
            'status' => $this->status->value,
            'status_label' => $this->status->label(),
            'pet' => [
                'id' => $this->pet->id,
                'name' => $this->pet->name,
                'species_label' => $this->pet->species->label(),
            ],
            'requester_name' => $this->requester->name,
            'target_phone' => $isRequester && $this->status === ContactRequestStatus::Aceita
                ? $this->target->phone
                : null,
            'created_at' => $this->created_at,
        ];
    }
}
