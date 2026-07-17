<?php

namespace App\Policies;

use App\Models\ContactRequest;
use App\Models\User;

class ContactRequestPolicy
{
    public function view(User $user, ContactRequest $contactRequest): bool
    {
        return $user->id === $contactRequest->requester_id || $user->id === $contactRequest->target_id;
    }

    public function respond(User $user, ContactRequest $contactRequest): bool
    {
        return $user->id === $contactRequest->target_id;
    }
}
