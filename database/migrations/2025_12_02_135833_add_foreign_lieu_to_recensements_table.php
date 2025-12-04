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
        Schema::table('recensements', function (Blueprint $table) {
            //
           $table->foreignId('lieu_id')->references('id')->on('lieux')->cascadeOnDelete();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('recensements', function (Blueprint $table) {
            $table->dropForeign(['lieu_id']);
            $table->dropColumn('lieu_id');
        });
    }
};
