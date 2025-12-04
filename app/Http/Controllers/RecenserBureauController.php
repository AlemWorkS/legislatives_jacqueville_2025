<?php

namespace App\Http\Controllers;

use App\Models\Bureau;
use App\Models\Recensement;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RecenserBureauController extends Controller
{

    public function index(Request $request)
    {

        $agent = $request->user();
        $bureau = Bureau::where('user_id', $agent->id)->first();

        // Dernier recensement du bureau

        $last = Recensement::where('bureau_id', $bureau->id)
            ->latest('moment_recensement')        // ou latest('created_at') selon ce que tu utilises
            ->value('nb_vote_cumule');

        return Inertia::render('Agent/Bureau/RecenserDashboard', [
            'bureau' => $bureau,
            'lastCumul' => $last ?? 0,
        ]);
    }

    // Render the Inertia page and pass initial props (safe defaults)
    public function storeRecensement(Request $request)
    {
        $request->validate([
            'bureau_id' => 'required|exists:bureaux,id',
            'nombre_recenses' => 'required|integer|min:0',
        ]);

        $bureau = Bureau::findOrFail($request->bureau_id);

        Recensement::create([
            'bureau_id' => $bureau->id,
            'nb_vote_cumule' => $request->nombre_recenses,
            'agent_id' => $request->user()->id,
            'lieu_id' => $bureau->lieu_id,
            'moment_recensement' => date('Y-m-d H:i:s'),

        ]);


        $last = Recensement::where('bureau_id', $bureau->id)
            ->latest('moment_recensement')        // ou latest('created_at') selon ce que tu utilises
            ->value('nb_vote_cumule');

        return response()->json(['success' => true, 'lastCumul' => $last]);
    }


    public function lastCumuleByBureau(Request $request)
    {
        $bureau = $request->input('bureau');

        $last = Recensement::where('bureau_id', $bureau)
            ->latest('id')        // ou latest('created_at') selon ce que tu utilises
            ->value('nb_vote_cumule');

        return $last ?? 0; // Retourne 0 si aucun recensement trouvé

    }
}
