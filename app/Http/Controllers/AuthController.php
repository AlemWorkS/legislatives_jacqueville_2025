<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
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
    public function login(Request $request)
    {
        // 1. La validation des champs est déjà gérée par Laravel (réponse 422 standard)
        $request->validate([
            'num' => 'required|digits:10',
            'password' => 'required|string',
        ]);

        // 2. Échec de la tentative d'authentification
        if (!Auth::attempt(['num' => $request->num, 'password' => $request->password])) {

            // --- CORRECTION CRUCIALE POUR INERTIA ---
            // On lève une ValidationException, qui sera interceptée par le middleware Inertia
            // et convertie en une réponse compatible (avec statut 422).
            // La clé de l'erreur ('num') DOIT correspondre au champ du formulaire à afficher.
            throw ValidationException::withMessages([
                'num' => 'Identifiants invalides', // Le message s'affichera sous errors.num
            ]);
        }

    // 3. Authentification réussie
        /** @var User */
        $user = Auth::user();
        $userRole = $user->role()->pluck('lib_role')->first();

        // --- RECOMMANDATION INERTIA POUR LE SUCCÈS ---
        // En utilisant useForm().post(), la méthode standard est la redirection.
        // Votre logique de redirection par rôle doit être ici ou dans un service.

        $redirectPath = match ($userRole) {
            'admin' => '/admin',
            'agent de bureau' => '/agent_bureau/dashboard',
            'supervisor' => '/supervisor',
            default => '/',
        };

        // Inertia interceptera la redirection 302 et mettra à jour la page React.
        return redirect()->intended($redirectPath);
    }

    // Récupère l'utilisateur connecté
    public function me(Request $request)
    {
        return response()->json($request->user()->load('roles'));
    }

    // Déconnexion
    public function logout(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect()->intended('/');
    }
}
