<?php

namespace App\Http\Controllers;

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
            'users' => User::all()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string',
            'prenoms' => 'string',
            'num' => 'required|unique:users',
            'role' => 'required|string',
        ]);

        $password = Str::random(12);

        $user = User::create([
            'name' => $request->nom,
            'num' => $request->num,
            'prenom' => $request->prenoms,
            'role_id' => $request->role,
            'password' => Hash::make($password),
        ]);

        return response()->json([
            'user' => $user,
            'password' => $password,
        ]);
    }

    public function resetPassword(User $user)
    {
        $user->password = Hash::make('default123');
        $user->save();

        return redirect()->back()->with('success', 'Mot de passe réinitialisé');
    }

    public function getUsersList()
    {
        return User::all();
    }
}
