<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class VerifyUserRole
{
    public function handle(Request $request, Closure $next, $role)
    {
        dd('Middleware chamado');
        if (Auth::check()) {
            if (Auth::user()->cargo == $role) {
                return $next($request);
            } else {
                abort(403, 'Acesso negado');
            }
        }

        return redirect()->route('login');
    }
}

