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

use App\Http\Controllers\AppointmentController ;
Route::resource('/appointments', AppointmentController::class);
Route::patch('/appointments/toggleStatus/{id}',[AppointmentController::class,'toggleStatus']);

use App\Http\Controllers\UserController ;
Route::resource('/users', UserController::class);

use App\Http\Controllers\PatientController ;
Route::resource('/patients', PatientController::class);
Route::get('/patients/{id}/appointments', [PatientController::class,'GetAppointments']);

use App\Http\Controllers\DentistController ;
Route::resource('/dentists', DentistController::class);

use App\Http\Controllers\TypeController ;
Route::resource('/types', TypeController::class);

use App\Http\Controllers\TypeAnalyseController;
Route::resource('/type_analyses', TypeAnalyseController::class);

use App\Http\Controllers\EstimateController;
Route::resource('/estimates', EstimateController::class);
Route::get('/estimates/{estimate}/download', [EstimateController::class, 'download'])->name('estimates.download');

use App\Http\Controllers\InvoiceController;
Route::resource('/invoices', InvoiceController::class);
Route::get('/invoices/{invoice}/download', [InvoiceController::class, 'download'])->name('invoices.download');

use App\Http\Controllers\PaymentController;
Route::resource('/payments', PaymentController::class);