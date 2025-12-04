<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('recensements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('agent_id')->references('id')->on('users')->cascadeOnDelete();
            $table->timestamp('moment_recensement');
            $table->integer('nb_vote_cumule');
            $table->json('data')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('recensements');
    }
};
