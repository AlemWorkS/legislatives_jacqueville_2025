<?php

namespace App\Http\Controllers;

use App\Models\Bureau;
use App\Models\Lieu;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Str;

class AdminController extends Controller
{
    public function dashboard()
    {
        return Inertia::render('Admin/Dashboard', [
            'users' => User::all(),
            'lieux' => Lieu::with('bureaux')
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string',
            'prenoms' => 'string',
            'num' => 'required|unique:users',
            'role' => 'required|string',
            //'id_bureau' => 'number'
        ]);

        $password = Str::random(12);

        $user = User::create([
            'name' => $request->nom,
            'num' => $request->num,
            'prenom' => $request->prenoms,
            'role_id' => $request->role,
            'password' => Hash::make($password),
        ]);

        //Bureau::where('id', $request->id_bureau)->user_id = $user->id;


        return response()->json([
            'user' => $user,
            'password' => $password,
        ]);
    }

    /**
     * Réinitialise le mot de passe d'un utilisateur et retourne le nouveau mot de passe temporaire.
     * * @param User $user L'utilisateur à réinitialiser (via Route Model Binding).
     * @return \Illuminate\Http\JsonResponse
     */
    public function resetPassword(Request $request)
    {
        // 1. Générer un mot de passe temporaire clair et sécurisé (ex: 10 caractères)
        // Ceci est le mot de passe que l'utilisateur devra utiliser immédiatement.
        $newClearPassword = Str::random(12);

        // 2. Hacher le mot de passe pour le stockage dans la base de données
        $user = User::where('id',$request->id)->first();
        $user->update([
            'password' => Hash::make($newClearPassword),
        ]);

        // 3. Retourner le mot de passe clair via JSON au frontend
        return response()->json([
            'password' => $newClearPassword,
            'message' => 'Mot de passe réinitialisé avec succès.',
        ]);
    }

    public function getUsersList()
    {
        return User::all();
    }

    public function deleteUser(Request $request)
    {

        User::delete('id', $request->id);
    }
}
