<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('bureaux', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('lieu_id');

            $table->foreign('lieu_id')->references('id')->on('lieux')->cascadeOnDelete();

            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('bureaux');
    }
};
