<?php

use App\Http\Controllers\Api\GanttChartApiConrtoller;
use App\Http\Controllers\ChartController;
use App\Http\Controllers\GanttChartController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TodayTaskController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::prefix('chart')->name('chart.')->group(function () {
        Route::get('/', [ChartController::class, 'index'])->name('index');
    });

    Route::prefix('gantt_chart')->name('gantt.chart.')->group(function () {
        Route::get('/', [GanttChartController::class, 'index'])->name('index');
        Route::post('/create', [GanttChartController::class, 'create'])->name('create');
        Route::prefix('program/{programUuid}')->name('program.')->group(function () {
            Route::delete('/', [GanttChartController::class, 'delete'])->name('delete');
            Route::get('/', [GanttChartController::class, 'show'])->name('show');
            Route::post('/', [GanttChartController::class, 'deleteProgram'])->name('create');
            Route::prefix('project/{projectUuid}')->name('project.')->group(function () {
                Route::delete('/', [GanttChartController::class, 'deleteProject'])->name('delete');
                Route::prefix('task/{taskUuid}')->name('task.')->group(function () {
                    Route::delete('/', [GanttChartController::class, 'deleteTask'])->name('delete');
                });
            });
        });
    });

    Route::prefix('today_task')->name('today.task.')->group(function () {
        Route::get('/', [TodayTaskController::class, 'index'])->name('index');
    });
});

require __DIR__.'/auth.php';
