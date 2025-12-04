<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class AuthController extends Controller
{
    // Affiche la page login — NE PAS LOGOUT ICI
    public function showLogin(Request $request)
    {
        // Ne pas faire Auth::logout() ici. Le middleware 'guest' empêche les users connectés d'accéder.
        //dd($request->user());
        return Inertia::render('Login');
    }

    public function login(Request $request)
    {
        $request->validate([
            'num' => 'required|digits:10',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt(['num' => $request->num, 'password' => $request->password])) {
            throw ValidationException::withMessages([
                'num' => 'Identifiants invalides',
            ]);
        }
        /** @var User */
        $user = Auth::user();
        $userRole = $user->role()->pluck('lib_role')->first();

        $redirectPath = match ($userRole) {
            'admin' => '/admin',
            'agent de bureau' => '/agent_bureau/dashboard',
            'supervisor' => '/supervisor',
            default => '/',
        };

        return redirect()->intended($redirectPath);
    }

    public function me(Request $request)
    {
        return response()->json($request->user()->load('roles'));
    }

    public function logout(Request $request)
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect()->intended('/');
    }
}
