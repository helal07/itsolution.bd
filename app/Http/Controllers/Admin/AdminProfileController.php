<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class AdminProfileController extends Controller
{
    /**
     * Display the Admin & Staff profile edit screen.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();
        
        // Find linked employee profile if exists
        $employee = Employee::where('user_id', $user->id)
            ->orWhere('email', $user->email)
            ->first();

        return Inertia::render('Admin/Profile/Edit', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'role' => $user->role,
                'created_at' => $user->created_at,
            ],
            'employee' => $employee ? [
                'id' => $employee->id,
                'designation' => $employee->designation,
                'department' => $employee->department,
                'status' => $employee->status,
                'salary' => $employee->salary,
                'joined_date' => $employee->joined_date ? $employee->joined_date->toDateString() : null,
                'avatar' => $employee->avatar,
            ] : null,
        ]);
    }

    /**
     * Update the Admin / Staff profile information.
     */
    public function update(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($user->id),
            ],
            'phone' => ['nullable', 'string', 'max:30'],
            'designation' => ['nullable', 'string', 'max:255'],
            'department' => ['nullable', 'string', 'max:100'],
            'avatar' => ['nullable', 'string', 'max:2000'],
            'avatar_file' => ['nullable', 'image', 'max:4096'],
        ]);

        $avatarUrl = $validated['avatar'] ?? null;

        if ($request->hasFile('avatar_file')) {
            $path = $request->file('avatar_file')->store('employees', 'public');
            $avatarUrl = '/storage/' . $path;
        }

        // Update User account
        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->phone = $validated['phone'] ?? null;
        $user->save();

        // Sync or update linked Employee profile
        $employee = Employee::where('user_id', $user->id)
            ->orWhere('email', $user->email)
            ->first();

        if ($employee) {
            $employee->name = $validated['name'];
            $employee->email = $validated['email'];
            $employee->phone = $validated['phone'] ?? null;
            if (!empty($validated['designation'])) {
                $employee->designation = $validated['designation'];
            }
            if (!empty($validated['department'])) {
                $employee->department = $validated['department'];
            }
            if ($avatarUrl) {
                if ($employee->avatar && str_starts_with($employee->avatar, '/storage/employees/') && $request->hasFile('avatar_file')) {
                    $oldPath = str_replace('/storage/', '', $employee->avatar);
                    Storage::disk('public')->delete($oldPath);
                }
                $employee->avatar = $avatarUrl;
            }
            $employee->user_id = $user->id;
            $employee->save();
        } elseif (!empty($validated['designation']) || !empty($validated['department']) || $avatarUrl) {
            Employee::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'] ?? null,
                'designation' => $validated['designation'] ?: ($user->role === 'admin' ? 'System Administrator' : 'Staff Engineer'),
                'department' => $validated['department'] ?: 'Management',
                'status' => 'active',
                'joined_date' => now()->toDateString(),
                'avatar' => $avatarUrl,
                'user_id' => $user->id,
            ]);
        }

        return redirect()->route('admin.profile.edit')->with('success', 'Profile details updated successfully.');
    }

    /**
     * Update the Admin / Staff password.
     */
    public function updatePassword(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', Password::defaults(), 'confirmed'],
        ]);

        $request->user()->update([
            'password' => Hash::make($validated['password']),
        ]);

        return redirect()->route('admin.profile.edit')->with('success', 'Password changed successfully.');
    }
}
