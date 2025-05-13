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
            $table->string('CIN')->nullable()->change();
            $table->string('gender')->nullable()->change();
            $table->date('birthdate')->nullable()->change();
            $table->string('email')->nullable()->change();
            $table->string('tel')->nullable()->change();
            $table->string('address')->nullable()->change();
            $table->string('photo')->nullable()->change();
            $table->string('password')->nullable()->change();
            $table->rememberToken()->nullable()->change();
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
