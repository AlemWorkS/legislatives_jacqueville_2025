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
        Schema::table('users', function (Blueprint $table) {
            //
            $table->string('nom')->default('')->change();
            $table->string('prenom')->default('')->change();
            $table->string('is_admin')->default(false)->change();
            $table->unsignedBigInteger('role_id')->default(4)->change();
            $table->string('role')->default('guest')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            //
        });
    }
};
