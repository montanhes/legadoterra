<?php

namespace App\Enums;

enum TypingStatus: int
{
    case NaoTestado = 1;
    case Autoinformado = 2;
    case ConfirmadoClinica = 3;

    public function label(): string
    {
        return match ($this) {
            self::NaoTestado => 'Não testado',
            self::Autoinformado => 'Autoinformado (não confirmado)',
            self::ConfirmadoClinica => 'Confirmado em clínica',
        };
    }
}
