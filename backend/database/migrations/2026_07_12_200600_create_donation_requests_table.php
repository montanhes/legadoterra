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
        Schema::create('donation_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('requester_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('pet_id')->constrained('pets')->cascadeOnDelete();
            $table->tinyInteger('species')->unsigned();
            $table->tinyInteger('blood_type_needed')->unsigned()->nullable();
            $table->tinyInteger('donation_type')->unsigned();
            $table->tinyInteger('status')->unsigned()->default(1);
            $table->decimal('lat', 10, 7);
            $table->decimal('lng', 10, 7);
            $table->geometry('location', subtype: 'point', srid: 4326);
            $table->timestamp('expires_at');
            $table->timestamps();

            $table->index('species');
            $table->index('status');
            $table->spatialIndex('location');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('donation_requests');
    }
};
