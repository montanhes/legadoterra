<?php

namespace App\Http\Controllers;

use App\Enums\DonationRequestStatus;
use App\Http\Requests\DonationRequest\SearchDonationRequestsRequest;
use App\Http\Requests\DonationRequest\StoreDonationRequestRequest;
use App\Http\Requests\DonationRequest\UpdateDonationRequestStatusRequest;
use App\Http\Resources\DonationRequestResource;
use App\Http\Resources\DonationRequestSearchResource;
use App\Models\DonationRequest;
use App\Models\Pet;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class DonationRequestController extends Controller
{
    public function index(SearchDonationRequestsRequest $request): AnonymousResourceCollection
    {
        $requests = DonationRequest::query()
            ->open()
            ->nearby(
                $request->float('lat'),
                $request->float('lng'),
                $request->float('radius_km', 25),
            )
            ->when($request->filled('species'), fn ($query) => $query->where('species', $request->integer('species')))
            ->with(['pet', 'requester'])
            ->get();

        return DonationRequestSearchResource::collection($requests);
    }

    public function store(StoreDonationRequestRequest $request): DonationRequestResource
    {
        $pet = Pet::findOrFail($request->validated('pet_id'));

        $donationRequest = DonationRequest::create([
            'requester_id' => $request->user()->id,
            'pet_id' => $pet->id,
            'species' => $pet->species,
            'blood_type_needed' => $request->validated('blood_type_needed'),
            'donation_type' => $request->validated('donation_type'),
            'status' => DonationRequestStatus::Aberta,
            'lat' => $request->validated('lat'),
            'lng' => $request->validated('lng'),
            'expires_at' => now()->addDays($request->integer('expires_in_days', 7)),
        ]);

        return DonationRequestResource::make($donationRequest->load('pet'));
    }

    public function update(UpdateDonationRequestStatusRequest $request, DonationRequest $donationRequest): DonationRequestResource
    {
        $donationRequest->update(['status' => $request->validated('status')]);

        return DonationRequestResource::make($donationRequest->fresh('pet'));
    }
}
