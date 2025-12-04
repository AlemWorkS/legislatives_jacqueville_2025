<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\SupervisorController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| SUPERVISOR API (Protected)
|--------------------------------------------------------------------------
*/




/*
|--------------------------------------------------------------------------
| ADMIN API (Protected + Role)
|--------------------------------------------------------------------------
*/

Route::middleware(['admin'])->prefix('admin')->group(function () {

    Route::get('/dashboard', [AdminController::class,'dashboard']);

    Route::get('/users', [AdminController::class,'index']);
    Route::post('/users', [AdminController::class,'store']);

    Route::post('/register-user', [AdminController::class,'registerUser']);
    Route::post('/reset-password/{user}', [AdminController::class,'resetPassword']);
});
