<?php

namespace App\Models;

use App\Consts\PortfolioConst;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Project extends Model
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
        'program_id',
        'hide_children',
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
    protected $appends = ['type', 'start', 'end'];

    public function getTypeAttribute()
    {
        return PortfolioConst::PROJECT;
    }

    public function getStartAttribute()
    {
        return $this->tasks()->orderBy('start')->first()->start;
    }

    public function getEndAttribute()
    {
        return $this->tasks()->orderBy('end', 'desc')->first()->end;
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }

    public function program(): BelongsTo
    {
        return $this->belongsTo(Program::class);
    }
}
