<?php

namespace App\Services;

use App\Models\Program;
use App\Repository\Eloquent\GanttChart\Programs\ProgramRepository;
use App\Repository\Eloquent\GanttChart\Projects\ProjectRepository;
use App\Repository\Eloquent\GanttChart\Tasks\TaskRepository;
use DateTime;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;

class ChartService extends ParentChartsService
{
    public function __construct(
        ProgramRepository $programRepository,
        ProjectRepository $projectRepository,
        TaskRepository $taskRepository
    ) {
        parent::__construct($programRepository, $projectRepository, $taskRepository);
    }

    /**
     * Format the data so that it can be displayed on a Pie Chart
     * @param Program $program
     * @return array
     */
    public function shapeProjectData(Program $program) : array
    {
        $totalTime = 0;
        $totalProgress = 0;
        $undertaking = 0;
        $projects = $program->projects()->get();
        foreach ($projects as $project) {
            $tasks = $project->tasks()->get();
            foreach ($tasks as $task) {
                [$period, $progressTime] = $this->projectRepository->calculateProgress($task);
                $totalTime += $period;
                $totalProgress += $progressTime;
                if ($progressTime > 0) {
                    $undertaking += $period - $progressTime;
                }
            }
        }
        $projectArr['completed'] = round($totalProgress / $totalTime * 100);
        $projectArr['in_progress'] = round($undertaking / $totalTime * 100);
        // 100%
        $projectArr['not_started'] = 100 - $projectArr['completed'] - $projectArr['in_progress'];
        return $projectArr;
    }

    public function getProgressOfTasks(string $programUuid) : Collection
    {
        $tasks = $this->taskRepository->getProgressOfTasks($programUuid);
        return $tasks->groupBy(function ($row) {
            $date = new DateTime($row->start);
            return $date->format('m/Y');
        });
    }

    public function getTaskCountGroubByYearAndMonth(string $programUuid) : array
    {
        $taskCount = $this->taskRepository->getTaskCountGroubByYearAndMonth($programUuid);
        $monthAndYearList = [];
        $fullProgressList = [];
        $inProgressList = [];
        $notStartedList = [];
        foreach ($taskCount as $value) {
            $monthAndYearList[] = $value->month . "/" . $value->year;
            $fullProgressList[] = $value->full_progress_count;
            $inProgressList[] = $value->in_progress_count;
            $notStartedList[] = $value->zero_progress_count;
        }
        return [
            'month_and_year_list' => $monthAndYearList,
            'full_progress_list' => $fullProgressList,
            'in_progress_list' => $inProgressList,
            'not_started_list' => $notStartedList
        ];
    }

}