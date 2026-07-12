<?php

namespace App\Http\Controllers;

use App\Http\Requests\Clinic\RegisterClinicRequest;
use App\Http\Resources\ClinicResource;
use App\Models\Clinic;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class ClinicRegistrationController extends Controller
{
    public function store(RegisterClinicRequest $request): JsonResponse
    {
        $clinic = DB::transaction(function () use ($request) {
            $user = User::create([
                'name' => $request->validated('owner_name'),
                'email' => $request->validated('email'),
                'password' => Hash::make($request->validated('password')),
                'phone' => $request->validated('phone'),
                'cep' => $request->validated('cep'),
                'city' => $request->validated('city'),
                'lat' => $request->validated('lat'),
                'lng' => $request->validated('lng'),
            ]);

            return Clinic::create([
                'user_id' => $user->id,
                'name' => $request->validated('clinic_name'),
                'cep' => $request->validated('cep'),
                'city' => $request->validated('city'),
                'lat' => $request->validated('lat'),
                'lng' => $request->validated('lng'),
                'phone' => $request->validated('phone'),
                'verified' => false,
            ]);
        });

        Auth::login($clinic->user);

        return ClinicResource::make($clinic)->response()->setStatusCode(201);
    }
}
