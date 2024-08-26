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
use Illuminate\Support\Facades\Log;

class GanttChartService extends ParentChartsService
{
    public function __construct(
        ProgramRepository $programRepository,
        ProjectRepository $projectRepository,
        TaskRepository $taskRepository
    ) {
        parent::__construct($programRepository, $projectRepository, $taskRepository);
    }

    /**
     * Create program
     * @param string $programName
     * @return Program
     */
    public function createProgram(string $programName, bool $isReview) : Program
    {
        $user = Auth::user();
        return $this->programRepository->createProgram($programName, $isReview, $user);
    }

    /**
     * @param string $programUuid
     * @return bool
     */
    public function deleteProgramByUuid(string $programUuid): bool
    {
        return $this->programRepository->delete($programUuid);
    }

    /**
     * @param string $projectUuid
     * @return Project
     */
    public function getProjectByUuid(string $projectUuid): Project
    {
        return $this->projectRepository->findByUuid($projectUuid);
    }

    /**
     * Create project
     * @param string $projectName
     * @return Project
     */
    public function createProject(
        int $projectId,
        string $projectName,
    ) : Project {
        $user = Auth::user();
        return $this->projectRepository->createProject($projectId, $projectName, false, $user);
    }

    /**
     * Get Program list
     */
    public function getProgramsByUserId() : Collection
    {
        $user = Auth::user();
        return $this->programRepository->getProgramsByUserId($user->id);
    }

    public function getPeriod(Program $program) : array
    {
        $projects = $program->projects()->get();
        return [
            $this->programRepository->getStartDate($projects),
            $this->programRepository->getEndDate($projects),
        ];
    }

    /**
     * Format the data so that it can be displayed on a Gantt chart
     * @param Program $program
     * @return array
     */
    public function shapeProjectData(Program $program) : array
    {
        $data = [];
        $totalTime = 0;
        $totalProgress = 0;
        $projects = $program->projects()->get();
        foreach ($projects as $project) {
            $tasks = $project->tasks()->get();
            foreach ($tasks as $task) {
                [$period, $progressTime] = $this->projectRepository->calculateProgress($task);
                $totalTime += $period;
                $totalProgress += $progressTime;
            }
            $projectArr = $project->toArray();
            $projectArr['progress'] = round($totalProgress / $totalTime * 100);
            $data[] = $projectArr;
            $data = array_merge($data, $tasks->toArray());

            // reset
            $totalTime = 0;
            $totalProgress = 0;
        }
        return $data;
    }

    /**
     * Format the data so that it can be displayed on a Gantt chart
     * @param Program $program
     * @return int todayProgress
     */
    public function calculateTodayTaskProgress(Collection $tasks): int
    {
        if($tasks->isEmpty()) return 0;
        $totalTime = 0;
        $totalProgress = 0;
        foreach ($tasks as $task) {
            [$period, $progressTime] = $this->projectRepository->calculateProgress($task);
            $totalTime += $period;
            $totalProgress += $progressTime;
        }
        $todayProgress = round($totalProgress / $totalTime);
        return $todayProgress;
    }

    /**
     * Create task
     * @param string $taskName
     * @param int $projectId
     * @param Carbon $start
     * @param Carbon $end
     * @param int $parentTaskId
     * @return Task
     */
    public function createTask(string $taskName, int $projectId, Carbon $start, Carbon $end, ?int $parentTaskId = null, ?int $order = null): Task
    {
        $user = Auth::user();
        return $this->taskRepository->createTask($taskName, $projectId, $start, $end, $user, $parentTaskId, $order);
    }

    /**
     * Create review task
     * @param string $taskName
     * @param int $projectId
     * @param Carbon $start
     * @param Carbon $end
     * @param int $parentTaskId
     * @return Task
     */
    public function createReviewTask(string $taskName, int $projectId, Carbon $start, Carbon $end, int $parentTaskId)
    {
        foreach (PortfolioConst::REVIEW_PERIOD as $key => $value) {
            $this->createTask(
                "$taskName($key)",
                $projectId,
                $start->addDays($value),
                $end->addDays($value),
                $parentTaskId
            );
        }
    }

    public function updateTask(string $taskUuid, array $data) : Task
    {
        return $this->taskRepository->updateTask($taskUuid, $data);
    }

    public function deleteTask(string $taskUuid)
    {
        return $this->taskRepository->delete($taskUuid);
    }

    public function getTodayTasks() : Collection
    {
       return $this->taskRepository->getTodayTasks();
    }
}