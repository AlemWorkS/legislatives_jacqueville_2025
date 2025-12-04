<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('stats_daily', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->integer('total_candidats')->default(0);
            $table->integer('total_recensements')->default(0);
            $table->integer('nouveaux_agents')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stats_daily');
    }
};
