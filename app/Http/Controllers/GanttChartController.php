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

class GanttChartController extends Controller
{
    private GanttChartService $ganttChartService;

    public function __construct(GanttChartService $ganttChartService)
    {
        $this->ganttChartService = $ganttChartService;
    }

    /**
     * Gantt Chart list
     * @return Response
     */
    public function index() : Response
    {
        $programs = $this->ganttChartService->getProgramsByUserId();
        foreach ($programs as $key => $program) {
            [$start, $end] = $this->ganttChartService->getPeriod($program);
            // [$start, $end] = $this->ganttChartService->calcu($program);
            $programs[$key]['start'] = $start;
            $programs[$key]['end'] = $end;
        }
        return Inertia::render('GanttChart/Index',[
            'programs' => $programs,
        ]);
    }

    /**
     * Store new program & project
     *
     * @param Request $request
     * @return Redirect
     */
    public function create(Request $request)
    {
        $program = $this->ganttChartService->createProgram($request->program, $request->isReview);
        $project = $this->ganttChartService->createProject($program->id, $request->project);
        $startDate = Carbon::parse($request->date['startDate']);
        $endDate = Carbon::parse($request->date['endDate']);
        $task = $this->ganttChartService->createTask(
            $request->task,
            $project->id,
            $startDate,
            $endDate,
        );
        if ($request->isReview) {
            $this->ganttChartService->createReviewTask(
                $request->task,
                $project->id,
                $startDate,
                $endDate,
                $task->id
            );
        }

        return Redirect::route('gantt.chart.program.show', [
            'programUuid' => $program->uuid
        ]);
    }

    /**
     * Show Gantt Chart
     *
     * @param Request $request
     * @param string $programUuid
     * @return Redirect
     */
    public function show(string $programUuid)
    {
        $program = $this->ganttChartService->getProgramByUuid($programUuid);
        $data = $this->ganttChartService->shapeProjectData($program);
        return Inertia::render('GanttChart/Show', [
            'tables' => $data,
            'program' => $program,
        ]);

    }

    public function deletePogram(Request $request)
    {
        Log::debug($request);
    }

    /**
     * Store new project & task
     *
     * @param Request $request
     * @return RedirectResponse
     */
    public function createProject(Request $request, string $programUuid) : RedirectResponse
    {
        $program = $this->ganttChartService->getProgramByUuid($programUuid);
        if ($request->chartType == PortfolioConst::TASK) {
            $project = $this->ganttChartService->getProjectByUuid($request->projectUuid);
        } else if ($request->chartType == PortfolioConst::PROJECT) {
            $project = $this->ganttChartService->createProject($program->id, $request->project, $request->date['startDate'], $request->date['endDate']);
        }
        $startDate = Carbon::parse($request->date['startDate']);
        $endDate = Carbon::parse($request->date['endDate']);
        $task = $this->ganttChartService->createTask(
            $request->task,
            $project->id,
            $startDate,
            $endDate,
        );
        if ($request->isReview || $program->is_review) {
            $this->ganttChartService->createReviewTask(
                $request->task,
                $project->id,
                $startDate,
                $endDate,
                $task->id
            );
        }

        return Redirect::route('gantt.chart.program.show', [
            'programUuid' => $program->uuid
        ]);
    }

    /**
     * Delete Program
     *
     * @param Request $request
     * @return RedirectResponse
     */
    public function delete(string $programUuid) : RedirectResponse
    {
        $this->ganttChartService->deleteProgramByUuid($programUuid);
        return redirect()->route('gantt.chart.index');
    }

    public function deleteTask(Request $request, string $programUuid) : RedirectResponse
    {
        $this->ganttChartService->deleteTask($request->taskUuid);
        return Redirect::route('gantt.chart.program.show', [
            'programUuid' => $programUuid
        ]);
    }
}
