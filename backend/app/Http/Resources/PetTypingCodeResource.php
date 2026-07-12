<?php

namespace App\Http\Resources;

use App\Models\PetTypingCode;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin PetTypingCode */
class PetTypingCodeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'code' => $this->code,
            'expires_at' => $this->expires_at,
        ];
    }
}
