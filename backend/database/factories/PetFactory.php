<?php

namespace Database\Factories;

use App\Enums\Sex;
use App\Enums\Species;
use App\Models\Pet;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Pet>
 */
class PetFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'tutor_id' => User::factory(),
            'name' => fake()->firstName(),
            'species' => fake()->randomElement(Species::cases()),
            'sex' => fake()->randomElement(Sex::cases()),
            'breed' => fake()->optional()->word(),
            'weight' => fake()->randomFloat(2, 1, 45),
            'birthdate' => fake()->optional()->date(),
            'castrado' => fake()->boolean(),
            'lat' => fake()->latitude(-33, 5),
            'lng' => fake()->longitude(-73, -34),
        ];
    }
}
