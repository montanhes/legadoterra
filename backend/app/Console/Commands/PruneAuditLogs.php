<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use OwenIt\Auditing\Models\Audit;

class PruneAuditLogs extends Command
{
    protected $signature = 'audits:prune';

    protected $description = 'Remove registros de auditoria com mais de 12 meses';

    public function handle(): int
    {
        $deleted = Audit::where('created_at', '<', now()->subMonths(12))->delete();

        $this->info("Removidos {$deleted} registros de auditoria com mais de 12 meses.");

        return self::SUCCESS;
    }
}
