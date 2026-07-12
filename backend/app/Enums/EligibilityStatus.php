<?php

namespace App\Enums;

enum EligibilityStatus: int
{
    case Apto = 1;
    case EmCarencia = 2;
    case AbaixoPeso = 3;
    case AguardandoConfirmacao = 4;
    case Inativo = 5;

    public function label(): string
    {
        return match ($this) {
            self::Apto => 'Apto',
            self::EmCarencia => 'Em carência',
            self::AbaixoPeso => 'Abaixo do peso mínimo',
            self::AguardandoConfirmacao => 'Aguardando confirmação',
            self::Inativo => 'Inativo',
        };
    }
}
