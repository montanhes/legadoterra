<?php

namespace App\Enums;

enum ContactRequestStatus: int
{
    case Pendente = 1;
    case Aceita = 2;
    case Recusada = 3;

    public function label(): string
    {
        return match ($this) {
            self::Pendente => 'Pendente',
            self::Aceita => 'Aceita',
            self::Recusada => 'Recusada',
        };
    }
}
