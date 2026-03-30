<?php

namespace App\Actions\Fortify;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'role' => ['required', 'in:retailer,distributor'],
            // Distributor profile fields
            'company_name' => ['nullable', 'string', 'max:255'],
            'company_address' => ['nullable', 'string', 'max:255'],
            'company_city' => ['nullable', 'string', 'max:255'],
            'company_phone' => ['nullable', 'string', 'max:255'],
        ])->validate();

        $user = User::create([
            'name' => $input['name'],
            'email' => $input['email'],
            'password' => Hash::make($input['password']),
            'role' => $input['role'],
            'approval_status' => 'pending',
        ]);

        // Create profile based on role
        if ($input['role'] === 'retailer') {
            $user->shopProfile()->create([]);
        } elseif ($input['role'] === 'distributor') {
            $user->distributorProfile()->create([
                'company_name' => $input['company_name'] ?? null,
                'company_address' => $input['company_address'] ?? null,
                'company_city' => $input['company_city'] ?? null,
                'company_phone' => $input['company_phone'] ?? null,
            ]);
        }

        return $user;
    }
}
