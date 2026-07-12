<?php

namespace App\Http\Controllers;

use App\Http\Requests\TypingCode\GenerateTypingCodeRequest;
use App\Http\Resources\PetTypingCodeResource;
use App\Models\Pet;
use App\Models\PetTypingCode;

class PetTypingCodeController extends Controller
{
    public function store(GenerateTypingCodeRequest $request, Pet $pet): PetTypingCodeResource
    {
        return PetTypingCodeResource::make(PetTypingCode::generateFor($pet));
    }
}
