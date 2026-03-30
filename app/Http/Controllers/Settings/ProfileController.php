<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileDeleteRequest;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\ShopProfile;
use App\Models\DistributorProfile;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
        ]);

        $user = $request->user();

        // Update basic user info
        $user->name = $validated['name'];
        $user->save();

        // Update phone in appropriate profile table
        if ($user->isRetailer()) {
            $shopProfile = $user->shopProfile;
            if (!$shopProfile) {
                $shopProfile = new ShopProfile();
                $shopProfile->user_id = $user->id;
            }
            $shopProfile->shop_phone = $validated['phone'] ?? null;
            $shopProfile->save();
        } elseif ($user->isDistributor()) {
            $distributorProfile = $user->distributorProfile;
            if (!$distributorProfile) {
                $distributorProfile = new DistributorProfile();
                $distributorProfile->user_id = $user->id;
            }
            $distributorProfile->company_phone = $validated['phone'] ?? null;
            $distributorProfile->save();
        }

        return redirect()->route('user.profile');
    }

    /**
     * Delete the user's profile.
     */
    public function destroy(ProfileDeleteRequest $request): RedirectResponse
    {
        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
