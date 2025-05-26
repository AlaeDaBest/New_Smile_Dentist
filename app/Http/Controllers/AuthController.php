<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
// use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // dd($request->all());
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);
        // dd($request->all());
        $user = User::with('roleable')->where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        $allowedRoles = ['App\\Models\\Infermier', 'App\\Models\\Dentist'];
        if (! in_array($user->roleable_type, $allowedRoles)) {
            return response()->json(['error' => 'Access denied'], 403);
        }

        return response()->json([
            'token' => $user->createToken('authToken')->plainTextToken,
            'user' => $user
        ]);
    }
    
    // public function logout(Request $request)
    // {
    //     $request->user()->currentAccessToken()->delete();
    //     return response()->json(['message' => 'Logged out']);
    // }
    public function users()
    {
        $users=User::with('roleable')
        ->where('roleable_type', 'App\Models\Infermier')
        ->orWhere('roleable_type', 'App\Models\Dentist')
        ->get();  
        return response()->json($users);
    }
}
