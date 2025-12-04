<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('recensements', function (Blueprint $table) {
            if (!Schema::hasColumn('recensements', 'bureau_id')) {
                $table->foreignId('bureau_id')
                      ->after('id')
                      ->constrained('bureaux')
                      ->cascadeOnDelete();
            }
        });
    }

    public function down(): void
    {
        Schema::table('recensements', function (Blueprint $table) {
            if (Schema::hasColumn('recensements', 'bureau_id')) {
                $table->dropForeign(['bureau_id']);
                $table->dropColumn('bureau_id');
            }
        });
    }
};
