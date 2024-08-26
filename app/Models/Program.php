<?php

namespace App\Models;

use App\Repository\Eloquent\GanttChart\Projects\ProjectRepository;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Program extends Model
{
    use HasFactory;
    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'uuid',
        'name',
        'user_id',
        'is_review',
        'created_by',
        'updated_at',
        'updated_by',
        'deleted_at',
        'deleted_by',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = ['progress'];

    public function projects() : HasMany
    {
        return $this->hasMany(Project::class);
    }

    public function getProgressAttribute()
    {
        $totalTime = 0;
        $totalProgress = 0;
        $projects = $this->projects()->get();
        foreach ($projects as $project) {
            $projectRepository = new ProjectRepository($project);
            $tasks = $project->tasks()->get();
            foreach ($tasks as $task) {
                [$period, $progressTime] = $projectRepository->calculateProgress($task);
                $totalTime += $period;
                $totalProgress += $progressTime;
            }
        }
        return round($totalProgress / $totalTime * 100);
    }

}
