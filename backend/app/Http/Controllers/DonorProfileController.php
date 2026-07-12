<?php

namespace App\Http\Controllers;

use App\Actions\DetermineDonorEligibility;
use App\Enums\DonationType;
use App\Enums\TypingStatus;
use App\Http\Requests\DonorProfile\StoreDonorProfileRequest;
use App\Http\Requests\DonorProfile\UpdateDonorProfileRequest;
use App\Http\Resources\DonorProfileResource;
use App\Models\Pet;

class DonorProfileController extends Controller
{
    public function store(
        StoreDonorProfileRequest $request,
        Pet $pet,
        DetermineDonorEligibility $determineEligibility,
    ): DonorProfileResource {
        $typingStatus = TypingStatus::from(
            $request->validated('typing_status', TypingStatus::NaoTestado->value)
        );

        $profile = $pet->donorProfile()->create([
            'blood_type' => $request->validated('blood_type'),
            'typing_status' => $typingStatus,
            'eligibility_status' => $determineEligibility->handle($pet->species, $typingStatus),
        ]);

        $profile->syncDonationTypes(
            collect($request->validated('donation_types'))->map(fn ($value) => DonationType::from($value))->all()
        );

        return DonorProfileResource::make($profile);
    }

    public function update(
        UpdateDonorProfileRequest $request,
        Pet $pet,
        DetermineDonorEligibility $determineEligibility,
    ): DonorProfileResource {
        $profile = $pet->donorProfile;

        $typingStatus = TypingStatus::from(
            $request->validated('typing_status', $profile->typing_status->value)
        );

        $profile->update([
            'blood_type' => $request->has('blood_type') ? $request->validated('blood_type') : $profile->blood_type,
            'typing_status' => $typingStatus,
            'eligibility_status' => $determineEligibility->handle($pet->species, $typingStatus),
        ]);

        if ($request->has('donation_types')) {
            $profile->syncDonationTypes(
                collect($request->validated('donation_types'))->map(fn ($value) => DonationType::from($value))->all()
            );
        }

        return DonorProfileResource::make($profile->fresh());
    }
}
