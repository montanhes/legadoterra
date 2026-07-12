<?php

namespace App\Http\Controllers;

use App\Http\Requests\Pet\StorePetRequest;
use App\Http\Requests\Pet\UpdatePetRequest;
use App\Http\Resources\PetResource;
use App\Models\Pet;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Gate;

class PetController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $pets = $request->user()->pets()->with('donorProfile')->latest()->get();

        return PetResource::collection($pets);
    }

    public function store(StorePetRequest $request): PetResource
    {
        $pet = $request->user()->pets()->create($request->validated());

        return PetResource::make($pet);
    }

    public function show(Pet $pet): PetResource
    {
        Gate::authorize('view', $pet);

        return PetResource::make($pet->load('donorProfile'));
    }

    public function update(UpdatePetRequest $request, Pet $pet): PetResource
    {
        $pet->update($request->validated());

        return PetResource::make($pet->fresh('donorProfile'));
    }

    public function destroy(Pet $pet): Response
    {
        Gate::authorize('delete', $pet);

        $pet->delete();

        return response()->noContent();
    }
}
