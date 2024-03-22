<?php

namespace App\Repository\Eloquent\GanttChart\Programs;

use App\Models\Program;
use App\Models\User;
use Illuminate\Support\Collection;

interface ProgramRepositoryInterface
{
    public function createProgram(string $programName, bool $isReview, User $user) : Program;

    public function getProgramsByUserId(int $userId): Collection;

    public function updateProgramName(
        string $uuid,
        string $programName,
        User $user) : Program;
}