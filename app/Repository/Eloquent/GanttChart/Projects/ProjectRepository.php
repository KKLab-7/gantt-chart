<?php

namespace App\Repository\Eloquent\GanttChart\Projects;

use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use App\Repository\Eloquent\BaseRepository;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class ProjectRepository extends BaseRepository implements ProjectRepositoryInterface
{
    public function __construct(Project $model)
    {
        parent::__construct($model);
    }

    public function createProject(int $programId, string $projectName, bool $hideChildren, User $user): Project
    {
        return $this->create([
            'uuid' => Str::uuid(),
            'name' => $projectName,
            'program_id' => $programId,
            'hide_children' => $hideChildren,
            'created_by' => $user->name,
            'updated_by' => $user->name
        ]);
    }

    public function updateProject(
        string $uuid,
        string $projectName,
        int $progress,
        string $start,
        string $end,
        User $user
    ): Project {
        return $this->update($uuid, [
            'name' => $projectName,
            'progress' => $progress,
            'start' => $start,
            'end' => $end,
            'updated_by' => $user->name
        ]);
    }

    public function deleteProject(string $uuid)
    {

    }

    /**
     * Pass task data associated with the project in an array
     * @param Project $project
     * @return array
     */
    public function shapeData(Project $project): array
    {
        $data = [];
        $data[] = $project->toArray();
        $tasks = $project->tasks()->get();
        foreach ($tasks as $task) {
            $data[] = $task->toArray();
        }
        return $data;
    }

    /**
     * @param Task $task
     * @return array [$period, $progressTime]
     */
    public function calculateProgress(Task $task) : array
    {
        $period = Carbon::parse($task->end)->getTimestamp() - Carbon::parse($task->start)->getTimestamp();
        $progressTime = $task->progress * $period;
        return [$period, $progressTime];
    }

}