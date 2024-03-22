<?php

namespace App\Providers;

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\ServiceProvider;

class BlueprintServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        Blueprint::macro('systemColumns', function () {
            $this->timestamp('created_at')->nullable();
            $this->string('created_by', 255)->nullable();
            $this->timestamp('updated_at')->nullable();
            $this->string('updated_by', 255)->nullable();
            $this->timestamp('deleted_at')->nullable();
            $this->string('deleted_by', 255)->nullable();
        });
    }
}
