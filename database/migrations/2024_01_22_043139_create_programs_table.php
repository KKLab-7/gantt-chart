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
        Schema::create('programs', function (Blueprint $table) {
            $table->id();
            $table->uuid();
            $table->string('name', 255)->comment('Program Name');
            $table->boolean('is_review')->comment('Review tasks');
            $table->foreignId('user_id')->constrained('users')->comment('User Id');
            // system common columns
            $table->systemColumns();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('programs');
    }
};
