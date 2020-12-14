<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware('auth:api')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::post('/createStudent', [App\Http\Controllers\StudentController::class, 'create'])->name('student.create');
Route::get('/student', [App\Http\Controllers\StudentController::class, 'index'])->name('student.index');
Route::get('/student/{id}', [App\Http\Controllers\StudentController::class, 'detail'])->name('student.detail');
Route::delete('/student/{id}', [App\Http\Controllers\StudentController::class, 'delete'])->name('student.delete');
