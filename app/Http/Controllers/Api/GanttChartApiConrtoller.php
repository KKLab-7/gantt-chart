<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\GanttChartService;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;

class GanttChartApiConrtoller extends Controller
{
    private GanttChartService $ganttChartService;

    public function __construct(GanttChartService $ganttChartService)
    {
        $this->ganttChartService = $ganttChartService;
    }

    /**
     * @param string $programUuid
     * @return Collection Project List
     */
    public function getProjectList(string $programUuid) : Collection
    {
        $program = $this->ganttChartService->getProgramByUuid($programUuid);
        return $program->projects()->get();
    }

    public function updateTask(Request $request, string $programUuid, string $projectUuid, string $taskUuid)
    {
        $this->ganttChartService->updateTask($taskUuid, $request->all());
        return response('success');
    }
}
