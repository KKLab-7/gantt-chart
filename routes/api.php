<?php

use App\Http\Controllers\Api\ChartApiConrtoller;
use App\Http\Controllers\Api\GanttChartApiConrtoller;
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

Route::middleware('auth:sanctum')->name('api.')->group(function () {
    Route::prefix('/gantt_chart')->name('gantt.chart.')->group(function () {
        Route::prefix('/program/{programUuid}')->name('program.')->group(function () {
            Route::get('/', [GanttChartApiConrtoller::class, 'getProjectList'])->name('list');
            Route::prefix('/project/{projectUuid}')->name('project.')->group(function () {
                Route::prefix('/task/{taskUuid}')->name('task.')->group(function () {
                    Route::post('/update', [GanttChartApiConrtoller::class, 'updateTask'])->name('update');
                });
            });
        });
    });

    Route::prefix('/chart')->name('chart.')->group(function () {
        Route::prefix('/program/{programUuid}')->name('program.')->group(function () {
            Route::post('/', [ChartApiConrtoller::class, 'getProgramProgress'])->name('rate');
        });
    });
});
