<?php

namespace App\Http\Middleware;

use App\Roles;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;


class EnsureAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
                /** @var User */
        $user = Auth::user();
        $userRole = $user->role()->pluck('lib_role')->first();

        if (!$user && !$userRole === Roles::ADMIN) {
            Log::warning('Unauthorized access attempt to admin route.', ['user' => Auth::user()]);

            abort(403, 'Oups ! La page demandé est inaccessible.');
        }

        return $next($request);
    }
}
