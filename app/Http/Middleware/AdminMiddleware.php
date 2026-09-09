<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            return redirect()->route('login');
        }

        // If user is a client, prevent admin access and redirect to client portal
        if ($user->isClient()) {
            return redirect()->route('client.dashboard')->with('error', 'Access restricted to customer portal.');
        }

        // Staff and Admin members are permitted
        if (! $user->isStaff() && ! $user->isAdmin()) {
            abort(403, 'Unauthorized access to administrative area.');
        }

        return $next($request);
    }
}
