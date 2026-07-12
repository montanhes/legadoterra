<?php

namespace App\Enums;

enum DonationRequestStatus: int
{
    case Aberta = 1;
    case Atendida = 2;
    case Expirada = 3;

    public function label(): string
    {
        return match ($this) {
            self::Aberta => 'Aberta',
            self::Atendida => 'Atendida',
            self::Expirada => 'Expirada',
        };
    }
}
