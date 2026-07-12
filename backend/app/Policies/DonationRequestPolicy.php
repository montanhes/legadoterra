<?php

namespace App\Policies;

use App\Models\DonationRequest;
use App\Models\User;

class DonationRequestPolicy
{
    public function update(User $user, DonationRequest $donationRequest): bool
    {
        return $user->id === $donationRequest->requester_id;
    }
}
