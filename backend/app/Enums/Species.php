<?php

namespace App\Enums;

enum Species: int
{
    case Cao = 1;
    case Gato = 2;

    public function label(): string
    {
        return match ($this) {
            self::Cao => 'Cão',
            self::Gato => 'Gato',
        };
    }
}
