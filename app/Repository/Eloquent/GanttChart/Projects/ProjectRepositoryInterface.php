<?php

namespace App\Repository\Eloquent\GanttChart\Projects;

use App\Models\Project;
use App\Models\User;
use Illuminate\Support\Collection;

interface ProjectRepositoryInterface
{
    public function createProject(
        int $projectId,
        string $projectName,
        bool $hideChildren,
        User $user) : Project;

    public function updateProject(
        string $uuid,
        string $projectName,
        int $progress,
        string $start,
        string $end,
        User $user) : Project;

    public function deleteProject(string $uuid);
}