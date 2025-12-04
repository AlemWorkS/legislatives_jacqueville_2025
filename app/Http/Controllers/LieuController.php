<?php

namespace App\Http\Controllers;

use App\Models\Bureau;
use App\Models\Ethnie;
use Illuminate\Http\Request;
use App\Models\Lieu;
use App\Models\Recensement;
use App\Models\Zone;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log as FacadesLog;
use Inertia\Inertia;

class LieuController extends Controller
{
    // Render Inertia page (front will call API endpoints)
    public function index(Request $request)
    {
        // Optionally pass centers for filters
        $centers = DB::table('centres')->select('id', 'lib_cen')->orderBy('lib_cen')->get();
        $zones = DB::table('zones')->select('id', 'lib_zone')->orderBy('lib_zone')->get();

        $nb_bureaux = Bureau::count() ?? 0;
        $nb_inscrits = Lieu::sum('nb_inscrits') ?? 0;

        // total votants (recensements)
        $votants = Recensement::whereIn('id', function ($query) {
            $query->select(DB::raw('MAX(id)')) // ou MAX(created_at) si id n'est pas séquentiel
                ->from('recensements')
                ->groupBy('lieu_id');
        })->sum('nb_vote_cumule') ?? 0;

        $progress = ($nb_inscrits > 0) ? round(100 * ($votants / $nb_inscrits), 2) : 0;


        return Inertia::render('Supervisor/Lieux', [
            'totalLieux' => Lieu::count(),
            'nb_bureaux' => $nb_bureaux,
            'totalEthnies' => Ethnie::count(),
            'nb_inscrits' => $nb_inscrits,
            'votants' => (int) $votants,
            'totalZones' => Zone::count(),
            'centers' => $centers,
            'progress_percent' => $progress,
            'zones' => $zones,
        ]);
    }

    // API: list lieux paginated with filters
    public function list(Request $request)
    {
        FacadesLog::info('PARAMS: ', $request->all()); // debug

        $query = Lieu::query()->withCount('bureaux');

        // filters
        if ($request->filled('centre_id')) {
            $query->where('centre_id', $request->centre_id);
        }
        if ($request->filled('zone_id')) {
            $query->where('zone_id', $request->zone_id);
        }
        if ($request->filled('q')) {
            $q = $request->q;
            $query->where(function ($qrx) use ($q) {
                $qrx->where('lib_lieu', 'like', "%{$q}%");
            });
        }

        $perPage = $request->get('per_page', 20);
        $list = $query->orderBy('lib_lieu')->paginate($perPage);

        return response()->json($list);
    }

    // API: show lieu detail
    public function show(Lieu $lieu)
    {
        // load bureaux count, inscrits, optional relations
        $lieu->loadCount('bureaux');

        // geet the last recensement's nb_vote_cumule
        $votes = Recensement::where('lieu_id', $lieu->id)
            ->orderByDesc('created_at') // ou 'id' si plus simple
            ->first()
            ->nb_vote_cumule ?? 0;

        return response()->json([
            'lieu' => $lieu,
            'votes_cumules' => $votes,
        ]);
    }

    // API: metrics for a single lieu
    public function metrics(Lieu $lieu)
    {
        $nb_bureaux = $lieu->bureaux()->count();
        $nb_inscrits = $lieu->nb_inscrits ?? 0;

        // total votants (recensements)
        $votants = Recensement::where('lieu_id', $lieu->id)
            ->orderByDesc('created_at') // ou 'id' si plus simple
            ->first()
            ->nb_vote_cumule ?? 0;

        $progress = $nb_bureaux && $nb_inscrits
            ? round(100 * ($votants / $nb_inscrits), 2) // or based on bureaux completed / total
            : ($nb_bureaux ? round(100 * (Recensement::where('lieu_id', $lieu->id)->distinct('id_bur')->count('id_bur') / $nb_bureaux), 2) : 0);

        return response()->json([
            'nb_bureaux' => $nb_bureaux,
            'nb_inscrits' => $nb_inscrits,
            'votants' => $votants,
            'progress_percent' => $progress,
        ]);
    }
}
