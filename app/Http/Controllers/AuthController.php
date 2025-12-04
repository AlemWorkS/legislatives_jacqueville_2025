<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AuthController extends Controller
{
    // Middleware pour empêcher un utilisateur connecté d'accéder au login
    public function __construct()
    {
        $this->middleware('guest')->only('showLogin', 'login');
        $this->middleware('auth')->only('logout', 'me');
    }

    // Affiche la page login
    public function showLogin()
    {
        return inertia('Login'); // ton composant React
    }

    // Login via numéro + password
    public function login(Request $request)
    {
        $request->validate([
            'num' => 'required|digits:10',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt(['num' => $request->num, 'password' => $request->password])) {
            return response()->json(['message' => 'Identifiants invalides'], 401);
        }

        /** @var User */
        $user = Auth::user();
        $userRole = $user->role()->pluck('lib_role')->first();

        return response()->json([
            'message' => 'Connecté avec succès',
            'user' => $user->load('role'),
            'role' => $userRole,
        ]);
    }

    // Récupère l'utilisateur connecté
    public function me(Request $request)
    {
        return response()->json($request->user()->load('roles'));
    }

    // Déconnexion
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete(); // supprime tous les tokens
        Auth::logout(); // optionnel si tu gères la session web

        return response()->json(['message' => 'Déconnecté']);
    }
}
