<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\LieuController;
use App\Http\Controllers\RecenserBureauController;
use App\Http\Controllers\SupervisorController;
use App\Models\Bureau;
use App\Models\Recensement;
use App\Models\Role;
use App\Models\User;
use App\Models\Zone;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// CONNEXION
Route::middleware('guest')->group(function () {

    Route::get('/', [AuthController::class, 'showLogin'])
        ->name('login');
});

// ADMIN ROUTES

Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {

    Route::get('/', function () {
        return Inertia::render('AdminDashboard', [
            'roles' => Role::all(),
            'users' => User::all(),
        ]);
    })->name('admin.dashboard');

    Route::post('admin/register-user', [AdminController::class, 'registerUser']);
    Route::post('admin/reset-password/{user}', [AdminController::class, 'resetPassword']);

    Route::prefix('api')->group(function () {

        Route::get('users', [AdminController::class, 'getUsersList']);
        Route::post('users', [AdminController::class, 'store']);
    });
});

// SUPERVISOR ROUTES

Route::middleware([''])->get('supervisor', [SupervisorController::class, 'index'])->name('supervisor.dashboard');

require __DIR__ . '/auth.php';

Route::middleware(['auth'])->prefix('supervisor')->group(function () {
    // Metrics, stats, zones, etc.
    Route::get('metrics', [SupervisorController::class, 'metrics']);
    Route::get('centers', [SupervisorController::class, 'centers']);
    Route::get('zones/{center}', [SupervisorController::class, 'zones']);
    Route::get('places/{zone}', [SupervisorController::class, 'places']);
    Route::get('recensements', [SupervisorController::class, 'recensements']);
    Route::get('anomalies', [SupervisorController::class, 'anomalies']);
    Route::get('results', [SupervisorController::class, 'results']);
    Route::get('lieux', [LieuController::class, 'index'])->name('supervisor.lieux');

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
Route::middleware(['auth', 'agent_bureau'])->get('/dashboard', [RecenserBureauController::class, 'index']);

Route::middleware(['auth', 'agent_bureau'])->prefix('agent_bureau')->group(function () {

    Route::post('store', [RecenserBureauController::class, 'storeRecensement']);
    Route::get('lastCumule/{bureau}', [RecenserBureauController::class, 'lastCumuleByBureau']);

});
