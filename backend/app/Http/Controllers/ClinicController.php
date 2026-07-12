<?php

namespace App\Http\Controllers;

use App\Http\Resources\ClinicResource;
use App\Models\Clinic;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ClinicController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return ClinicResource::collection(
            Clinic::query()->where('verified', true)->orderBy('name')->get()
        );
    }
}
