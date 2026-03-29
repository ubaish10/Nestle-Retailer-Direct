<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;

class AccountsController extends Controller
{
    /**
     * Display accounts dashboard.
     */
    public function index()
    {
        // Get all registered users (non-admin)
        $accounts = User::where('role', 'user')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'created_at' => $user->created_at->diffForHumans(),
                    'created_date' => $user->created_at->format('M d, Y'),
                ];
            });

        return Inertia::render('dashboard/accounts', [
            'accounts' => $accounts,
            'stats' => [
                'total_accounts' => User::where('role', 'user')->count(),
            ],
        ]);
    }
}
