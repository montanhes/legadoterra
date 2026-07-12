<?php

namespace App\Enums;

enum ReportReason: int
{
    case TutorNaoResponde = 1;
    case InformacaoFalsa = 2;
    case PetNaoEhMaisDoador = 3;
    case Outro = 4;

    public function label(): string
    {
        return match ($this) {
            self::TutorNaoResponde => 'Tutor não responde',
            self::InformacaoFalsa => 'Informação falsa',
            self::PetNaoEhMaisDoador => 'Pet não é mais doador',
            self::Outro => 'Outro',
        };
    }
}
