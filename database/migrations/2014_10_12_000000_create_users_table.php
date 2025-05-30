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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('CIN');
            $table->string('firstname');
            $table->string('lastname');
            $table->string('gender');
            $table->date('birthdate');
            $table->string('email')->unique();
            $table->string('tel');
            $table->string('address');
            $table->string('photo');
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->nullableMorphs('roleable');
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
