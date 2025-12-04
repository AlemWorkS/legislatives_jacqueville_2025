<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('zones', function (Blueprint $table) {
            $table->id();
            $table->string('lib_zone', 60);
            $table->unsignedBigInteger('centre_id');
            $table->unsignedBigInteger('ethnie_id');

            $table->integer('nb_inscrits')->default(0);
            $table->integer('nb_bur')->default(0);

            $table->foreign('centre_id')->references('id')->on('centres')->cascadeOnDelete();
            $table->foreign('ethnie_id')->references('id')->on('ethnies')->cascadeOnDelete();

            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('zones');
    }
};

