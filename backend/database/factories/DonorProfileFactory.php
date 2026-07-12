<?php

namespace Database\Factories;

use App\Enums\EligibilityStatus;
use App\Enums\TypingStatus;
use App\Models\DonorProfile;
use App\Models\Pet;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<DonorProfile>
 */
class DonorProfileFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'pet_id' => Pet::factory(),
            'blood_type' => null,
            'typing_status' => TypingStatus::NaoTestado,
            'eligibility_status' => EligibilityStatus::AguardandoConfirmacao,
        ];
    }
}
