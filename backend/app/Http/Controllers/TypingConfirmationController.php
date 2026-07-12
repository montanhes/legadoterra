<?php

namespace App\Http\Controllers;

use App\Actions\DetermineDonorEligibility;
use App\Enums\BloodType;
use App\Enums\TypingStatus;
use App\Http\Requests\TypingCode\ConfirmTypingRequest;
use App\Http\Resources\DonorProfileResource;
use Illuminate\Support\Facades\DB;

class TypingConfirmationController extends Controller
{
    public function store(ConfirmTypingRequest $request, DetermineDonorEligibility $determineEligibility): DonorProfileResource
    {
        $typingCode = $request->typingCode();
        $pet = $typingCode->pet;
        $clinic = $request->user()->clinic;

        $profile = DB::transaction(function () use ($request, $typingCode, $pet, $clinic, $determineEligibility) {
            $bloodType = BloodType::from((int) $request->validated('blood_type'));

            $pet->donorProfile->update([
                'blood_type' => $bloodType,
                'typing_status' => TypingStatus::ConfirmadoClinica,
                'eligibility_status' => $determineEligibility->handle($pet->species, TypingStatus::ConfirmadoClinica),
            ]);

            $typingCode->update([
                'used_at' => now(),
                'used_by_clinic_id' => $clinic->id,
            ]);

            return $pet->donorProfile->fresh();
        });

        return DonorProfileResource::make($profile);
    }
}
