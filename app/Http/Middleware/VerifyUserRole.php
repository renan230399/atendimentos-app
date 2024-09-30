<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class VerifyUserRole
{
    public function handle(Request $request, Closure $next, ...$roles) // Múltiplos roles
    {

        if (Auth::check()) {
            if (in_array(Auth::user()->role, $roles)) {
                return $next($request);
            } else {
                abort(403, 'Acesso negado');
            }
        }

        return redirect()->route('login');
    }
}
