<?php

namespace App\Http\Controllers;

use App\Enums\EligibilityStatus;
use App\Http\Requests\DonorSearchRequest;
use App\Http\Resources\DonorSearchResource;
use App\Models\Pet;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class DonorSearchController extends Controller
{
    public function index(DonorSearchRequest $request): AnonymousResourceCollection
    {
        $pets = Pet::query()
            ->nearby(
                $request->float('lat'),
                $request->float('lng'),
                $request->float('radius_km', 25),
            )
            ->whereHas('donorProfile', function ($query) use ($request) {
                $query->where('eligibility_status', EligibilityStatus::Apto);

                if ($request->filled('blood_type')) {
                    $query->where('blood_type', $request->integer('blood_type'));
                }
            })
            ->when($request->filled('species'), fn ($query) => $query->where('species', $request->integer('species')))
            ->with([
                'donorProfile',
                'tutor',
                'contactRequests' => fn ($query) => $query->where('requester_id', $request->user()->id),
            ])
            ->get();

        return DonorSearchResource::collection($pets);
    }
}
