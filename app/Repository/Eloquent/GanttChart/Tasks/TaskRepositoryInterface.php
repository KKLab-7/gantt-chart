<?php

namespace App\Repository\Eloquent\GanttChart\Tasks;

use App\Models\Task;
use App\Models\User;
use Carbon\Carbon;

interface TaskRepositoryInterface
{
    public function createTask(
        string $taskName,
        int $projectId,
        Carbon $start,
        Carbon $end,
        User $user,
        ?int $parentTaskId,
        ?int $order,
    ) : Task;

    public function updateTask(string $taskUuid, array $data): Task;

}