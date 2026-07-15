<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Throwable;

class GoogleAuthController extends Controller
{
    public function redirect(): RedirectResponse
    {
        return Socialite::driver('google')->redirect();
    }

    public function callback(Request $request): RedirectResponse
    {
        $frontendUrl = rtrim(env('FRONTEND_URL', 'http://localhost:5173'), '/');

        try {
            $googleUser = Socialite::driver('google')->user();
        } catch (Throwable) {
            return redirect()->away("{$frontendUrl}/entrar?erro=google");
        }

        $user = User::where('google_id', $googleUser->getId())
            ->orWhere('email', $googleUser->getEmail())
            ->first();

        if ($user) {
            if (! $user->google_id) {
                $user->forceFill(['google_id' => $googleUser->getId()])->save();
            }
        } else {
            $user = User::create([
                'name' => $googleUser->getName() ?? $googleUser->getEmail(),
                'email' => $googleUser->getEmail(),
                'google_id' => $googleUser->getId(),
                'password' => Hash::make(Str::random(40)),
            ]);
        }

        Auth::login($user, remember: true);
        $request->session()->regenerate();

        return redirect()->away("{$frontendUrl}/painel");
    }
}
