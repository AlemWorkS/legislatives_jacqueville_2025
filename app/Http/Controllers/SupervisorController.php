<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Centre;
use App\Models\Zone;
use App\Models\Lieu;
use App\Models\Bureau;
use App\Models\Recensement;
use App\Models\Resultat;
use App\Http\Resources\CentreResource;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia; // si tu utilises Inertia

class SupervisorController extends Controller
{
    // Render the Inertia page and pass initial props (safe defaults)
    public function index(Request $request)
    {
        // Optionally preload some small sets for filters
        $centers = Centre::select('id', 'lib_cen')->orderBy('lib_cen')->get();

        // Provide basic kpis quickly (not heavy)
        $kpis = Cache::remember('supervisor:kpis:quick', 30, function () {
            return [
                'totalCentres' => Centre::count(),
                'totalZones' => Zone::count(),
                'totalLieux' => Lieu::count(),
                'totalBureaux' => Bureau::count(),
            ];
        });

        // Render Inertia and let the front call API endpoints for heavier data
        return Inertia::render('Supervisor/Dashboard', [
            'kpis' => $kpis,
            'centers' => $centers,
            // we leave recensements empty — front will call /api/supervisor/recensements
            'recensements' => [],
        ]);
    }

    // Aggregated metrics (cached) — supports request filters (dynamic cache key)
    public function metrics(Request $request)
    {
        $key = 'supervisor:metrics:' . md5(json_encode($request->only(['centre_id', 'zone_id', 'lieu_id', 'from', 'to'])));
        $data = Cache::remember($key, 30, function () use ($request) {

            $totalBureaux = Bureau::count();
            $totalLieux = Lieu::count();
            $totalZones = Zone::count();
            $totalCentres = Centre::count();
            $totalInscrits = Lieu::sum('nb_inscrits');
            $totalRecensements = Recensement::count();
            // number of distinct lieux that have at least one recensement
            $lieuxWithData = Recensement::distinct('lieu_id')->count('lieu_id');

            $progress = $totalLieux ? round(100 * $lieuxWithData / $totalLieux, 2) : 0;

            // Top centres by progress (SQL aggregated)
            $topCentres = DB::table('lieux')
                ->leftJoin('recensements', 'lieux.id', '=', 'recensements.lieu_id')
                ->select(
                    'lieux.id',
                    'lieux.lib_lieu as lib_cen',
                    DB::raw('COUNT(DISTINCT recensements.id) as rec_count'),
                    'lieux.nb_bureau',
                    DB::raw('CASE WHEN lieux.nb_bureau > 0 THEN ROUND(100 * COUNT(DISTINCT recensements.id) / lieux.nb_bureau, 2) ELSE 0 END as progress')
                )
                ->groupBy('lieux.id', 'lieux.lib_lieu', 'lieux.nb_bureau')
                ->orderByDesc('progress')
                ->limit(10)
                ->get();

            return [
                'totalBureaux' => $totalBureaux,
                'totalLieux' => $totalLieux,
                'totalZones' => $totalZones,
                'totalCentres' => $totalCentres,
                'totalInscrits' => $totalInscrits,
                'totalRecensements' => $totalRecensements,
                'progress_percent' => $progress,
                'top_centres' => $topCentres,
            ];
        });

        return response()->json($data);
    }

    // Centers listing (paginated) - resource wrapper
    public function centers(Request $request)
    {
        $centers = Centre::withCount('zones', 'lieux', 'bureaux')->paginate(20);
        return CentreResource::collection($centers);
    }

    public function recensements(Request $request)
    {
        $query = Recensement::with(['lieu.zone.centre', 'agent'])
            ->orderBy('created_at', 'desc');

        $query->when($request->centre_id, function ($q) use ($request) {
            $q->whereHas('lieu', function ($sub) use ($request) {
                $sub->where('centre_id', $request->centre_id);
            });
        });

        $query->when($request->zone_id, function ($q) use ($request) {
            $q->whereHas('lieu', function ($sub) use ($request) {
                $sub->where('zone_id', $request->zone_id);
            });
        });

        $query->when($request->lieu_id, function ($q) use ($request) {
            $q->where('lieu_id', $request->lieu_id);
        });

        $query->when(
            $request->from,
            fn($q) =>
            $q->whereDate('created_at', '>=', $request->from)
        );

        $query->when(
            $request->to,
            fn($q) =>
            $q->whereDate('created_at', '<=', $request->to)
        );

        $query->when(
            $request->agent_id,
            fn($q) =>
            $q->where('agent_id', $request->agent_id)
        );

        // Export CSV
        if ($request->boolean('export_csv')) {
            $list = $query->get();
            $filename = 'recensements_export_' . now()->format('Ymd_His') . '.csv';

            return response()->streamDownload(function () use ($list) {
                $handle = fopen('php://output', 'w');
                fputcsv($handle, ['ID', 'Lieu', 'Agent', 'Votants', 'Inscrits', 'Date']);

                foreach ($list as $r) {
                    fputcsv($handle, [
                        $r->id,
                        $r->lieu?->nom ?? '',
                        $r->agent?->name ?? '',
                        $r->nombre_votants,
                        $r->nb_inscrits ?? '',
                        $r->created_at->format('d/m/Y H:i'),
                    ]);
                }

                fclose($handle);
            }, $filename);
        }

        return response()->json(
            $query->paginate(50)
        );
    }


    // Anomalies detection (extendable)
    public function anomalies(Request $request)
    {
        // over votes
        $over = Recensement::query()
            ->join('lieux', 'recensements.lieu_id', '=', 'lieux.id')
            ->whereColumn('recensements.nb_vote_cumule', '>', 'lieux.nb_inscrits')
            ->with(['lieu', 'agent'])
            ->select('recensements.*')
            ->get();

        // duplicates
        $duplicates = Recensement::select('lieu_id', DB::raw('COUNT(*) as n'))
            ->groupBy('lieu_id')
            ->having('n', '>', 1)
            ->get();

        return response()->json([
            'over_votes' => $over,
            'duplicates' => $duplicates,
        ]);
    }

    // Results aggregation
    public function results(Request $request)
    {
        $results = Resultat::selectRaw('id_candidat, sum(voix) as total_voix')
            ->groupBy('id_candidat')
            ->orderByDesc('total_voix')
            ->get();

        return response()->json($results);
    }
}
