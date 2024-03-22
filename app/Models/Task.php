<?php

namespace App\Models;

use App\Consts\PortfolioConst;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Task extends Model
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
        'project_id',
        'start',
        'end',
        'display_order',
        'parent_task_id',
        'progress',
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
    protected $appends = ['type', 'project_uuid'];

    public function getTypeAttribute()
    {
        return PortfolioConst::TASK;
    }

    public function getProjectUuidAttribute()
    {
        return $this->project()->first()->uuid;
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

}
