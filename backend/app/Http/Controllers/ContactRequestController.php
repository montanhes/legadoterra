<?php

namespace App\Http\Controllers;

use App\Enums\ContactRequestStatus;
use App\Http\Requests\ContactRequest\StoreContactRequestRequest;
use App\Http\Requests\ContactRequest\UpdateContactRequestStatusRequest;
use App\Http\Resources\ContactRequestResource;
use App\Models\ContactRequest;
use App\Models\Pet;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ContactRequestController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $contactRequests = ContactRequest::query()
            ->where(function ($query) use ($request) {
                $query->where('requester_id', $request->user()->id)
                    ->orWhere('target_id', $request->user()->id);
            })
            ->with(['requester', 'target', 'pet'])
            ->latest()
            ->get();

        return ContactRequestResource::collection($contactRequests);
    }

    public function store(StoreContactRequestRequest $request): ContactRequestResource
    {
        $pet = Pet::findOrFail($request->validated('pet_id'));

        $contactRequest = ContactRequest::create([
            'requester_id' => $request->user()->id,
            'target_id' => $pet->tutor_id,
            'pet_id' => $pet->id,
            'status' => ContactRequestStatus::Pendente,
        ]);

        return ContactRequestResource::make($contactRequest->load(['requester', 'target', 'pet']));
    }

    public function update(UpdateContactRequestStatusRequest $request, ContactRequest $contactRequest): ContactRequestResource
    {
        $contactRequest->update([
            'status' => $request->validated('status'),
            'responded_at' => now(),
        ]);

        return ContactRequestResource::make($contactRequest->fresh(['requester', 'target', 'pet']));
    }
}
