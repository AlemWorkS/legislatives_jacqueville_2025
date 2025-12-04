<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DeliberationController;
use App\Http\Controllers\LieuController;
use App\Http\Controllers\RecenserController;
use App\Http\Controllers\SupervisorController;
use App\Http\Controllers\UserController;
use App\Models\Bureau;
use App\Models\Lieu;
use App\Models\Role;
use App\Models\User;
use App\Models\Zone;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

require __DIR__ . '/auth.php';


// CONNEXION
Route::middleware('guest')->group(function () {
    Route::get('/', [AuthController::class, 'showLogin'])
        ->name('login');
    Route::get('login', [AuthController::class, 'showLogin'])
        ->name('login');
});

// ADMIN ROUTES

Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {

    Route::get('/', function () {
        return Inertia::render('AdminDashboard', [
            'roles' => Role::all(),
            'users' => User::all(),
            'lieux' => Lieu::all(),
            'bureaux' => Bureau::all(),
        ]);
    })->name('admin.dashboard');

    Route::post('register-user', [AdminController::class, 'registerUser']);

    Route::prefix('api')->group(function () {

        Route::get('users', [AdminController::class, 'getUsersList']);
        Route::post('users', [AdminController::class, 'store']);
        Route::delete('users/{user}', [UserController::class, 'destroy']);
        Route::post('reset-password', [AdminController::class, 'resetPassword']);
    });
});

// SUPERVISOR ROUTES



Route::middleware(['auth'])->prefix('supervisor')->group(function () {
    // Metrics, stats, zones, etc.
    Route::get('/', [SupervisorController::class, 'index'])->name('supervisor.dashboard');
    Route::get('metrics', [SupervisorController::class, 'metrics']);
    Route::get('centers', [SupervisorController::class, 'centers']);
    Route::get('zones/{center}', [SupervisorController::class, 'zones']);
    Route::get('places/{zone}', [SupervisorController::class, 'places']);
    Route::get('recensements', [SupervisorController::class, 'recensements']);
    Route::get('anomalies', [SupervisorController::class, 'anomalies']);
    Route::get('results', [SupervisorController::class, 'results']);
    Route::get('lieux', [LieuController::class, 'index'])->name('supervisor.lieux');
    Route::get('dash/recensements',function () {
        return Inertia::render('Supervisor/Recensements');
    });

    Route::prefix('api')->group(function () {

        Route::get('lieux', [LieuController::class, 'list']);
        Route::get('lieux/{lieu}', [LieuController::class, 'show']);
        Route::get('lieux/{lieu}/metrics', [LieuController::class, 'metrics']);

        Route::get('centers/{centreId}/zones', function ($centreId) {
            return Zone::where('centre_id', $centreId)->get();
        });
    });
});

// AGENT BUREAU ROUTES

Route::middleware(['auth', 'agent_bureau'])->prefix('agent_bureau')->group(function () {

    Route::get('/dashboard', [RecenserController::class, 'index']);
    Route::post('store', [RecenserController::class, 'storeRecensement']);
    Route::get('lastCumule/{bureau}', [RecenserController::class, 'lastCumuleByBureau']);

    Route::get("/deliberation", [DeliberationController::class, "index"]);
    Route::post("/save_deliberation", [DeliberationController::class, "save"]);

});
