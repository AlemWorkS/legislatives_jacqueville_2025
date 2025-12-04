<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('centres', function (Blueprint $table) {
            $table->id();
            $table->string('lib_cen', 60);
            $table->unsignedBigInteger('region_id');
            $table->unsignedBigInteger('type_centre_id');
            $table->integer('pop_cen')->default(0);
            $table->integer('nb_inscrits')->default(0);
            $table->integer('nb_bureau')->default(0);

            $table->foreign('region_id')->references('id')->on('regions')->cascadeOnDelete();
            $table->foreign('type_centre_id')->references('id')->on('type_centre')->cascadeOnDelete();

            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('centres');
    }
};
