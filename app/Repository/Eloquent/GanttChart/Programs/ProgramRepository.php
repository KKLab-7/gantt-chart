<?php

namespace App\Repository\Eloquent\GanttChart\Programs;

use App\Models\Program;
use App\Models\Project;
use App\Models\User;
use App\Repository\Eloquent\BaseRepository;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class ProgramRepository extends BaseRepository implements ProgramRepositoryInterface
{
    /**
     * ProgramRepository constractor
     */
    public function __construct(Program $model)
    {
        parent::__construct($model);
    }

    public function createProgram(string $programName, bool $isReview, User $user): Program
    {
        return $this->create([
            'uuid' => Str::uuid(),
            'name' => $programName,
            'is_review' => $isReview,
            'user_id' => $user->id,
            'created_by' => $user->name,
            'updated_by' => $user->name
        ]);
    }

    public function getProgramsByUserId(int $userId): Collection
    {
        return $this->model->where('user_id', $userId)->get();
    }

    public function getProgramUuidList(int $userId): array
    {
        return $this->model->where('user_id', $userId)->ge;
    }

    public function updateProgramName(string $uuid, string $programName, User $user): Program
    {
        return $this->update($uuid, [
            'name' => $programName,
            'updated_by' => $user->name
        ]);
    }

    /**
     * To retrieve the earliest　start date.
     * @param Collection $projects Projects List
     * @return string Y-m-d H:i:s
     */
    public function getStartDate(Collection $projects) : string
    {
        return $projects->sortBy('start')->first()->start;
    }

    /**
     * To retrieve the latest end date.
     * @param Collection $projects Projects List
     * @return string Y-m-d H:i:s
     */
    public function getEndDate(Collection $projects) : string
    {
        return $projects->sortByDesc('end')->first()->end;
    }

    /**
     * @param string $programUuid
     * @return Program
     */
    public function getProgramByUuid(string $programUuid) : Program
    {
        /** @var \App\Models\User */
        $user = Auth::user();
        return $user->programs()->where('uuid', $programUuid)->first();
    }

}