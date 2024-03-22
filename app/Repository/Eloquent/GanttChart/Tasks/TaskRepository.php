<?php

namespace App\Repository\Eloquent\GanttChart\Tasks;

use App\Models\Program;
use App\Models\Task;
use App\Models\User;
use App\Repository\Eloquent\BaseRepository;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class TaskRepository extends BaseRepository implements TaskRepositoryInterface
{
    /**
     * TaskRepository constractor
     */
    public function __construct(Task $model)
    {
        parent::__construct($model);
    }

    public function createTask(string $taskName, int $projectId, Carbon $start, Carbon $end, User $user, ?int $parentTaskId = null, int $order = null): Task
    {
        return $this->create([
            'uuid' => Str::uuid(),
            'name' => $taskName,
            'project_id' => $projectId,
            'start' => $start->startOfDay(),
            'end' => $end->endOfDay(),
            'display_order' => $order,
            'parent_task_id' => $parentTaskId,
            'created_by' => $user->name,
            'updated_by' => $user->name
        ]);
    }

    public function updateTask(string $taskUuid, array $data): Task
    {
        $task = $this->update($taskUuid, $data);
        return $task;
    }

    public function deleteTask(): Task
    {
        
    }

    public function calculateTasksProgress(): int
    {
        
    }

    public function getTodayTasks(): Collection
    {
        /** @var \App\Model\User */
        $user = Auth::user();
        $today = Carbon::now()->today()->format('Y-m-d H:i:s');
        return Task::join('projects', 'projects.id', '=', 'tasks.project_id')
            ->join('programs', 'programs.id', '=', 'projects.program_id')
            ->where('programs.user_id', '=', $user->id)
            ->where('tasks.start', '<=', $today)
            ->where('tasks.end', '>=', $today)
            ->select(
                'tasks.*',
                'projects.name as project',
                'projects.uuid as projectUuid',
                'programs.name as program',
                'programs.uuid as programUuid',
            )
            ->get();
    }
}