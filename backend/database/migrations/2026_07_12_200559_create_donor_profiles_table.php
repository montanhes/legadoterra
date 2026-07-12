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
        Schema::create('donor_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pet_id')->unique()->constrained('pets')->cascadeOnDelete();
            $table->tinyInteger('blood_type')->unsigned()->nullable();
            $table->tinyInteger('typing_status')->unsigned()->default(1);
            $table->tinyInteger('eligibility_status')->unsigned();
            $table->date('last_donation_at')->nullable();
            $table->boolean('opted_in_notifications')->default(true);
            $table->timestamps();

            $table->index('eligibility_status');
            $table->index('blood_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('donor_profiles');
    }
};
