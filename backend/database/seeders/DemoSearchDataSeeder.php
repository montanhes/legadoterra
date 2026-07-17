<?php

namespace Database\Seeders;

use App\Enums\BloodType;
use App\Enums\DonationRequestStatus;
use App\Enums\DonationType;
use App\Enums\EligibilityStatus;
use App\Enums\Sex;
use App\Enums\Species;
use App\Enums\TypingStatus;
use App\Models\DonationRequest;
use App\Models\DonorProfile;
use App\Models\Pet;
use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * Doadores e pedidos SOS pra simular a busca no mapa localmente.
 * Nao roda em producao (DatabaseSeeder so chama isso em ambiente local).
 */
class DemoSearchDataSeeder extends Seeder
{
    private const CENTER_LAT = -5.7311232;

    private const CENTER_LNG = -35.2518144;

    public function run(): void
    {
        $donors = [
            ['name' => 'Rex', 'species' => Species::Cao, 'sex' => Sex::Macho, 'breed' => 'Labrador', 'blood_type' => BloodType::DEA11Positivo],
            ['name' => 'Luna', 'species' => Species::Gato, 'sex' => Sex::Femea, 'breed' => 'SRD', 'blood_type' => BloodType::TipoA],
            ['name' => 'Thor', 'species' => Species::Cao, 'sex' => Sex::Macho, 'breed' => 'Vira-lata', 'blood_type' => BloodType::DEA11Negativo],
            ['name' => 'Mia', 'species' => Species::Gato, 'sex' => Sex::Femea, 'breed' => 'Siamês', 'blood_type' => BloodType::TipoB],
            ['name' => 'Bolt', 'species' => Species::Cao, 'sex' => Sex::Macho, 'breed' => 'Border Collie', 'blood_type' => BloodType::DEA11Positivo],
            ['name' => 'Nina', 'species' => Species::Gato, 'sex' => Sex::Femea, 'breed' => 'Persa', 'blood_type' => BloodType::TipoAB],
        ];

        foreach ($donors as $donor) {
            [$lat, $lng] = $this->randomPointNear(15);

            $tutor = User::factory()->create([
                'phone' => $this->fakePhone(),
                'lat' => $lat,
                'lng' => $lng,
            ]);

            $pet = Pet::factory()->create([
                'tutor_id' => $tutor->id,
                'name' => $donor['name'],
                'species' => $donor['species'],
                'sex' => $donor['sex'],
                'breed' => $donor['breed'],
                'castrado' => true,
                'lat' => $lat,
                'lng' => $lng,
            ]);

            DonorProfile::factory()->create([
                'pet_id' => $pet->id,
                'blood_type' => $donor['blood_type'],
                'typing_status' => TypingStatus::ConfirmadoClinica,
                'eligibility_status' => EligibilityStatus::Apto,
            ]);
        }

        $sosRequests = [
            ['name' => 'Fred', 'species' => Species::Cao, 'blood_type_needed' => BloodType::DEA11Positivo],
            ['name' => 'Amora', 'species' => Species::Gato, 'blood_type_needed' => BloodType::TipoA],
        ];

        foreach ($sosRequests as $sos) {
            [$lat, $lng] = $this->randomPointNear(15);

            $requester = User::factory()->create([
                'phone' => $this->fakePhone(),
                'lat' => $lat,
                'lng' => $lng,
            ]);

            $pet = Pet::factory()->create([
                'tutor_id' => $requester->id,
                'name' => $sos['name'],
                'species' => $sos['species'],
                'lat' => $lat,
                'lng' => $lng,
            ]);

            DonationRequest::create([
                'requester_id' => $requester->id,
                'pet_id' => $pet->id,
                'species' => $sos['species'],
                'blood_type_needed' => $sos['blood_type_needed'],
                'donation_type' => DonationType::SangueTotal,
                'status' => DonationRequestStatus::Aberta,
                'lat' => $lat,
                'lng' => $lng,
                'expires_at' => now()->addDays(5),
            ]);
        }
    }

    /**
     * @return array{0: float, 1: float}
     */
    private function randomPointNear(float $radiusKm): array
    {
        $radiusDeg = $radiusKm / 111;
        $u = mt_rand() / mt_getrandmax();
        $v = mt_rand() / mt_getrandmax();
        $w = $radiusDeg * sqrt($u);
        $t = 2 * M_PI * $v;

        $lat = self::CENTER_LAT + $w * cos($t);
        $lng = self::CENTER_LNG + ($w * sin($t)) / cos(deg2rad(self::CENTER_LAT));

        return [$lat, $lng];
    }

    private function fakePhone(): string
    {
        return sprintf('(84) 9%04d-%04d', random_int(0, 9999), random_int(0, 9999));
    }
}
