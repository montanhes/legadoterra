<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\ClinicController;
use App\Http\Controllers\ClinicRegistrationController;
use App\Http\Controllers\ContactRequestController;
use App\Http\Controllers\DonationRequestController;
use App\Http\Controllers\DonorProfileController;
use App\Http\Controllers\DonorSearchController;
use App\Http\Controllers\PetController;
use App\Http\Controllers\PetTypingCodeController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\TypingConfirmationController;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [RegisteredUserController::class, 'store']);
Route::post('/login', [AuthenticatedSessionController::class, 'store']);
Route::post('/clinics/register', [ClinicRegistrationController::class, 'store']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy']);

    Route::get('/user', fn (Request $request) => UserResource::make($request->user()->load('clinic')));

    Route::apiResource('pets', PetController::class);
    Route::post('/pets/{pet}/donor-profile', [DonorProfileController::class, 'store']);
    Route::patch('/pets/{pet}/donor-profile', [DonorProfileController::class, 'update']);

    Route::get('/donors', [DonorSearchController::class, 'index']);

    Route::get('/donation-requests', [DonationRequestController::class, 'index']);
    Route::post('/donation-requests', [DonationRequestController::class, 'store']);
    Route::patch('/donation-requests/{donation_request}', [DonationRequestController::class, 'update']);

    Route::post('/donor-profiles/{donor_profile}/reports', [ReportController::class, 'store']);

    Route::get('/contact-requests', [ContactRequestController::class, 'index']);
    Route::post('/contact-requests', [ContactRequestController::class, 'store']);
    Route::patch('/contact-requests/{contact_request}', [ContactRequestController::class, 'update']);

    Route::get('/clinics', [ClinicController::class, 'index']);

    Route::post('/pets/{pet}/typing-code', [PetTypingCodeController::class, 'store']);
    Route::post('/typing-confirmations', [TypingConfirmationController::class, 'store']);
});
