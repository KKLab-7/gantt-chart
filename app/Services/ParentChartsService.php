<?php

namespace App\Services;

use App\Consts\PortfolioConst;
use App\Models\Program;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use App\Repository\Eloquent\GanttChart\Programs\ProgramRepository;
use App\Repository\Eloquent\GanttChart\Projects\ProjectRepository;
use App\Repository\Eloquent\GanttChart\Tasks\TaskRepository;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;

class ParentChartsService
{
    protected ProgramRepository $programRepository;
    protected ProjectRepository $projectRepository;
    protected TaskRepository $taskRepository;

    public function __construct(
        ProgramRepository $programRepository,
        ProjectRepository $projectRepository,
        TaskRepository $taskRepository
    ) {
        $this->programRepository = $programRepository;
        $this->projectRepository = $projectRepository;
        $this->taskRepository = $taskRepository;
    }

    /**
     * @return Collection Program
     */
    public function getProgramsByUserId(): Collection
    {
        $user = Auth::user();
        return $this->programRepository->getProgramsByUserId($user->id);
    }

    /**
     * @param string $programUuid
     * @return Program
     */
    public function getProgramByUuid(string $programUuid): Program
    {
        return $this->programRepository->getProgramByUuid($programUuid);
    }
}