<?php

namespace App\Enums;

enum DonationType: int
{
    case SangueTotal = 1;

    public function label(): string
    {
        return match ($this) {
            self::SangueTotal => 'Sangue total',
        };
    }
}
