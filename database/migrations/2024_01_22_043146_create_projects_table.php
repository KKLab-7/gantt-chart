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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid');
            $table->string('name', 255)->comment('Project Name');
            $table->foreignId('program_id')->constrained('programs')->comment('Program Id');
            $table->boolean('hide_children')->comment('Hide child tasks');
            // system common columns
            $table->systemColumns();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
