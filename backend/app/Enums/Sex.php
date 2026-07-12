<?php

namespace App\Enums;

enum Sex: int
{
    case Macho = 1;
    case Femea = 2;

    public function label(): string
    {
        return match ($this) {
            self::Macho => 'Macho',
            self::Femea => 'Fêmea',
        };
    }
}
