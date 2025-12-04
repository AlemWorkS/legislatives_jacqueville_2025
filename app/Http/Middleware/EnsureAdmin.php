<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;


class EnsureAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!Auth::user() || !Auth::user()->is_admin) {
            Log::warning('Unauthorized access attempt to admin route.', ['user' => Auth::user()]);

            abort(403, 'Oups ! La page demandé est inaccessible.');
        }

        return $next($request);
    }
}
