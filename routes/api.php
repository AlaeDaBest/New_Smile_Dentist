<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
// Route::middleware('auth:sanctum')->group(function () {
//     Route::get('/messages/{user}', [MessageController::class, 'index']);
//     Route::post('/messages', [MessageController::class, 'store']);
//     Route::patch('/messages/{message}/read', [MessageController::class, 'markAsRead']);
// });
// Route::get('/messages/{user_id}', [MessageController::class, 'index']);

use App\Http\Controllers\AppointmentController ;
Route::middleware('auth:sanctum')->resource('/appointments', AppointmentController::class);
Route::patch('/appointments/toggleStatus/{id}',[AppointmentController::class,'toggleStatus']);

use App\Http\Controllers\PatientController ;
Route::resource('/patients', PatientController::class);
Route::get('/patients/{id}/appointments', [PatientController::class,'GetAppointments']);

use App\Http\Controllers\InvoiceController;
Route::resource('/invoices', InvoiceController::class);
Route::get('/invoices/{invoice}/download', [InvoiceController::class, 'download'])->name('invoices.download');


use App\Http\Controllers\PaymentController;
Route::resource('/payments', PaymentController::class);

use App\Http\Controllers\EstimateController;
Route::resource('/estimates', EstimateController::class);
Route::get('/estimates/{estimate}/download', [EstimateController::class, 'download'])->name('estimates.download');

use App\Http\Controllers\AuthController;

Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->get('/me', function (Request $request) {
    return $request->user();
});
Route::get('/users', [AuthController::class, 'users']);

use Illuminate\Http\Request as HttpRequest;
Route::middleware('auth:sanctum')->get('/protected-route', function (HttpRequest $request) {
    return response()->json(['message' => 'Authenticated!', 'user' => $request->user()]);
});

Route::middleware('auth:sanctum')->post('/logout', function (HttpRequest $request) {
    $request->user()->currentAccessToken()->delete();
    return response()->json(['message' => 'Logged out']);
});

use App\Http\Controllers\GroupChatController;
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/group-chats', [GroupChatController::class, 'index']);
    Route::get('/group-chats/{id}/messages', [GroupChatController::class, 'messages']);
    Route::post('/group-chats/{id}/messages', [GroupChatController::class, 'storeMessage']);
});
use App\Http\Controllers\UserController;
Route::middleware('auth:sanctum')->resource('/users', UserController::class);

use App\Http\Controllers\DashboardController;
Route::middleware('auth:sanctum')->get('/dashboard-stats', [DashboardController::class, 'stats']);