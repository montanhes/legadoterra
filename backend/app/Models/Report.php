<?php

namespace App\Models;

use App\Enums\EligibilityStatus;
use App\Enums\ReportReason;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Report extends Model
{
    public const int AUTO_INACTIVATE_THRESHOLD = 3;

    protected $fillable = [
        'donor_profile_id',
        'reporter_id',
        'reason',
    ];

    protected function casts(): array
    {
        return [
            'reason' => ReportReason::class,
        ];
    }

    protected static function booted(): void
    {
        static::created(function (self $report) {
            $count = static::where('donor_profile_id', $report->donor_profile_id)->count();

            if ($count >= self::AUTO_INACTIVATE_THRESHOLD) {
                $report->donorProfile->update([
                    'eligibility_status' => EligibilityStatus::Inativo,
                ]);
            }
        });
    }

    public function donorProfile(): BelongsTo
    {
        return $this->belongsTo(DonorProfile::class);
    }

    public function reporter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reporter_id');
    }
}
