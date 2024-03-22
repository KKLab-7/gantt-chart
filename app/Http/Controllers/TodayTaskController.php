<?php

namespace App\Http\Controllers;

use App\Consts\PortfolioConst;
use App\Services\GanttChartService;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Inertia\Response;
use Inertia\Inertia;

class TodayTaskController extends Controller
{
    private GanttChartService $ganttChartService;

    public function __construct(GanttChartService $ganttChartService)
    {
        $this->ganttChartService = $ganttChartService;
    }

    /**
     * Show Today Task list
     * @return Response
     */
    public function index() : Response
    {
        $todayTasks = $this->ganttChartService->getTodayTasks();
        $progress = $this->ganttChartService->calculateTodayTaskProgress($todayTasks);
        return Inertia::render('TodayTasks/Index',[
            'todayTasks' => $todayTasks,
            'progress' => $progress,
        ]);
    }
}
