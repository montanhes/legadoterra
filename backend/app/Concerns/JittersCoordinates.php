<?php

namespace App\Concerns;

trait JittersCoordinates
{
    /**
     * Desloca um ponto aleatoriamente (50-400m) só pra exibição pública —
     * evita expor o endereço exato do tutor num resultado de busca. O
     * raio de busca em si usa a coordenada real (Pet::scopeNearby).
     *
     * @return array{lat: float, lng: float}
     */
    private function jitteredCoordinate(float $lat, float $lng): array
    {
        $offsetMeters = random_int(50, 400);
        $angle = random_int(0, 359) * (M_PI / 180);

        $latOffset = ($offsetMeters * cos($angle)) / 111_320;
        $lngOffset = ($offsetMeters * sin($angle)) / (111_320 * cos(deg2rad($lat)));

        return [
            'lat' => $lat + $latOffset,
            'lng' => $lng + $lngOffset,
        ];
    }
}
