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
        Schema::create('donor_profile_donation_type', function (Blueprint $table) {
            $table->foreignId('donor_profile_id')->constrained('donor_profiles')->cascadeOnDelete();
            $table->tinyInteger('donation_type')->unsigned();

            $table->primary(['donor_profile_id', 'donation_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('donor_profile_donation_type');
    }
};
