<?php

namespace App\Http\Controllers;

use App\Models\Candidat;
use App\Models\Lieu;
use App\Models\Resultat;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DeliberationController extends Controller
{
    //
    public function index()
    {
        /** @var User*/

        $user = Auth::user();
        $lieu = Lieu::where('user_id', $user->id)->first();

        if (!$lieu) {

            return Inertia::render("Agent/Bureau/DeliberationDashboard", [
                "lieu" => null,
                "candidats" => null,
                "resultats" => null,
            ]);
        }

        return Inertia::render("Agent/Bureau/DeliberationDashboard", [
            "lieu" => $lieu,
            "candidats" => Candidat::all(),
            "resultats" => Resultat::where("lieu_id", $lieu->id)->pluck("nb_vote", "candidat_id"),
            "isFinish" => $lieu->deliberation_fini
        ]);
    }

    public function save(Request $request)
    {
        foreach ($request->scores as $candidat_id => $voix) {
            Resultat::create(
                [
                    'lieu_id' => $request->lieu_id,
                    'candidat_id' => $candidat_id,
                    'user_id' => $request->user_id,
                    'date_resultat' => date('Y-m-d H:i:s'),
                    'nb_vote' => $voix
                ],
            );
        }

        return response()->json(["message" => "OK"]);
    }
}
