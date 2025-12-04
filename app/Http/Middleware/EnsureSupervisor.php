<?php

namespace App\Http\Middleware;

use App\Roles;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

class EnsureSupervisor
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // 1. Assurez-vous d'abord que l'utilisateur est bien l'utilisateur actuellement connecté
        /** @var \App\Models\User|null $user */
        $user = Auth::user();

        // Déterminer le rôle
        $userRole = $user ? $user->role()->pluck('lib_role')->first() : null;

        // 2. Vérification de l'accès
        // Si l'utilisateur n'est pas connecté OU si le rôle ne correspond pas au rôle autorisé
        if ($user === null || $userRole !== Roles::SUPERVISOR->value) {

            // Enregistrement du debug
            Log::warning('Tentative d\'accès non autorisée à la route recenser.', [
                'user_id' => $user ? $user->id : 'Non-connecté',
                'attempted_role' => $userRole,
            ]);

            // Déconnexion de l'utilisateur (si l'objet user existe)
            if ($user !== null) {
                Auth::logout(); // <-- CORRECTION : C'est la bonne méthode de déconnexion
            }

            // Abandonne la requête et renvoie une erreur 403 Forbidden
            // Utilisez AccessDeniedHttpException pour plus de clarté
            throw new AccessDeniedHttpException('Oups ! La page demandée est inaccessible.');
        }

        // ... Si l'exécution arrive ici,

        return $next($request);
    }
}
