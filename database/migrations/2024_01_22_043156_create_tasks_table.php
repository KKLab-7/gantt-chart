<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid');
            $table->string('name', 255)->comment('Project Name');
            $table->foreignId('project_id')->constrained('projects')->comment('Project Id');
            $table->integer('progress')->default(0)->comment('Progress rate');
            $table->dateTime('start')->comment('Start date of the program');
            $table->dateTime('end')->comment('Start date of the program');
            $table->integer('display_order')->nullable()->comment('Order of display on Gantt chart');
            $table->foreignId('parent_task_id')->nullable()->constrained('tasks')->comment('Task Id');

            // system common columns
            $table->systemColumns();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
