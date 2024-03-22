<?php

namespace App\Repository\Eloquent;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;

class BaseRepository
{

    /**
     * @var Model
     */
    protected $model;

    /**
     * BaseRepository constractor
     *
     * @param Model $model
     */
    public function __construct(Model $model)
    {
        $this->model = $model;
    }

    /**
     * @return Collection
     */
    public function all() : Collection
    {
        return $this->model->all();
    }

    /**
     * @param int $id
     *
     * @return Model
     */
    public function create(array $attributes): Model
    {
        return $this->model->create($attributes);
    }

    /**
     * @param array $attributes
     *
     * @return Model
     */
    public function find(int $id): Model
    {
        return $this->model->find($id);
    }

    /**
     * @param string $uuid
     *
     * @return Model
     */
    public function findByUuid(string $uuid): Model
    {
        return $this->model->where('uuid', $uuid)->first();
    }

    /**
     * @param string $uuid
     * @param array $data
     * @return Model
     */
    public function update(string $uuid, array $data): Model
    {
        $row = $this->model->where('uuid', $uuid)->first();
        $row->fill([
            ...$data,
            'update' => Carbon::now(),
        ])->save();
        return $row;
    }

    /**
     * @param array $search
     * @param array $value
     *
     * @return Model
     */
    public function updateOrCreate(array $search, array $value): Model
    {
        return $this->model->updateOrCreate($search, $value);
    }

    /**
     * @param array $search
     * @param array $value
     *
     * @return bool|null
     */
    public function delete(string $uuid)
    {
        return $this->findByUuid($uuid)->delete();
    }
}