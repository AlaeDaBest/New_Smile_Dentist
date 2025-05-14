<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('app');
});

use App\Http\Controllers\UserController ;
Route::resource('/users', UserController::class);

use App\Http\Controllers\DentistController ;
Route::resource('/dentists', DentistController::class);

use App\Http\Controllers\TypeController ;
Route::resource('/types', TypeController::class);

use App\Http\Controllers\TypeAnalyseController;
Route::resource('/type_analyses', TypeAnalyseController::class);
// Route::middleware('web')->group(function () {
//     Route::post('/login', [AuthController::class, 'login']);
// });


