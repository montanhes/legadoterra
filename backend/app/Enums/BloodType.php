<?php

namespace App\Enums;

enum BloodType: int
{
    case DEA11Positivo = 1;
    case DEA11Negativo = 2;

    case TipoA = 21;
    case TipoB = 22;
    case TipoAB = 23;
    case TipoMik = 24;

    public function label(): string
    {
        return match ($this) {
            self::DEA11Positivo => 'DEA 1.1 Positivo',
            self::DEA11Negativo => 'DEA 1.1 Negativo',
            self::TipoA => 'Tipo A',
            self::TipoB => 'Tipo B',
            self::TipoAB => 'Tipo AB',
            self::TipoMik => 'Tipo Mik',
        };
    }

    public function species(): Species
    {
        return match ($this) {
            self::DEA11Positivo, self::DEA11Negativo => Species::Cao,
            self::TipoA, self::TipoB, self::TipoAB, self::TipoMik => Species::Gato,
        };
    }

    /**
     * @return list<self>
     */
    public static function forSpecies(Species $species): array
    {
        return array_values(array_filter(
            self::cases(),
            fn (self $case) => $case->species() === $species,
        ));
    }
}
