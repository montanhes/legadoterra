<?php

namespace App\Actions;

use App\Enums\EligibilityStatus;
use App\Enums\Species;
use App\Enums\TypingStatus;

class DetermineDonorEligibility
{
    /**
     * Gato tem anticorpo natural (sistema AB) — transfusão incompatível pode
     * matar já na primeira vez. Só libera "apto" com tipagem confirmada em
     * clínica. Cão (DEA) tolera melhor a incerteza, então fica apto mesmo
     * sem tipagem — a UI deve avisar que tipagem é recomendada.
     */
    public function handle(Species $species, TypingStatus $typingStatus): EligibilityStatus
    {
        if ($species === Species::Gato && $typingStatus !== TypingStatus::ConfirmadoClinica) {
            return EligibilityStatus::AguardandoConfirmacao;
        }

        return EligibilityStatus::Apto;
    }
}
