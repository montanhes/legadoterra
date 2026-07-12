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
            $table->string('phone')->nullable()->after('email');
            $table->string('cep', 9)->nullable()->after('phone');
            $table->string('city')->nullable()->after('cep');
            $table->string('state', 2)->nullable()->after('city');
            $table->decimal('lat', 10, 7)->nullable()->after('state');
            $table->decimal('lng', 10, 7)->nullable()->after('lat');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['phone', 'cep', 'city', 'state', 'lat', 'lng']);
        });
    }
};
