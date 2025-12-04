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
        Schema::table('lieux', function (Blueprint $table) {
            // add a foreign key to centres table
             $table->foreignId('centre_id')->constrained('centres');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('lieux', function (Blueprint $table) {
            //
            $table->dropForeign(['centre_id']);
            $table->dropColumn('centre_id');
        });
    }
};
