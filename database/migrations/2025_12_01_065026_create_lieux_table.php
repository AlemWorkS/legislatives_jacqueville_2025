<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('lieux', function (Blueprint $table) {
            $table->id();
            $table->string('lib_lieu', 60);

            $table->unsignedBigInteger('zone_id');
            $table->unsignedBigInteger('ethnie_id');

            $table->integer('nb_inscrits')->default(0);
            $table->integer('nb_bureau')->default(0);

            $table->foreign('zone_id')->references('id')->on('zones')->cascadeOnDelete();
            $table->foreign('ethnie_id')->references('id')->on('ethnies')->cascadeOnDelete();

            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('lieux');
    }
};
