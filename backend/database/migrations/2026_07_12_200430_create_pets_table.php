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
        Schema::create('pets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tutor_id')->constrained('users')->cascadeOnDelete();
            $table->string('name');
            $table->tinyInteger('species')->unsigned();
            $table->tinyInteger('sex')->unsigned();
            $table->string('breed')->nullable();
            $table->decimal('weight', 5, 2)->nullable();
            $table->date('birthdate')->nullable();
            $table->string('photo_path')->nullable();
            $table->boolean('castrado')->default(false);
            $table->decimal('lat', 10, 7);
            $table->decimal('lng', 10, 7);
            $table->geometry('location', subtype: 'point', srid: 4326);
            $table->timestamps();

            $table->index('species');
            $table->spatialIndex('location');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pets');
    }
};
