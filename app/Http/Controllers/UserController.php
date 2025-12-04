<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Supprime un utilisateur.
     * * NOTE: La fonction deleteUser dans votre front-end envoie une requête DELETE 
     * à une route qui devrait idéalement inclure l'ID de l'utilisateur (ex: /users/{id}).
     * Si l'ID est dans l'URL de la route (méthode RESTful recommandée),
     * la signature de la fonction devrait utiliser le "Route Model Binding" (User $user)
     * au lieu d'utiliser $request.
     */
    public function destroy(User $user)
    {
        // Si vous utilisez le Route Model Binding (Route::delete('/users/{user}', ...)):
        // L'instance $user est déjà trouvée ou une 404 est automatiquement levée.
        $user->delete();

        // Répondre avec un statut 204 No Content (succès de suppression)
        return response()->noContent();
    }
    
    // Si vous tenez à récupérer l'ID via la requête comme dans votre brouillon :
    public function deleteUserFromRequest(Request $request)
    {
        // 1. Assurez-vous d'utiliser l'ID pour trouver l'utilisateur.
        // On utilise findOrFail pour s'assurer que si l'ID n'existe pas, 
        // une erreur 404 est levée (comportement souhaitable pour une API).
        $user = User::findOrFail($request->id);

        // 2. Appeler la méthode d'instance delete() sur l'objet trouvé.
        $user->delete();

        return response()->noContent();
    }
}