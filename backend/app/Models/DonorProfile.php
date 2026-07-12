<?php

namespace App\Models;

use App\Enums\BloodType;
use App\Enums\DonationType;
use App\Enums\EligibilityStatus;
use App\Enums\TypingStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class DonorProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'pet_id',
        'blood_type',
        'typing_status',
        'eligibility_status',
        'last_donation_at',
        'opted_in_notifications',
    ];

    protected function casts(): array
    {
        return [
            'blood_type' => BloodType::class,
            'typing_status' => TypingStatus::class,
            'eligibility_status' => EligibilityStatus::class,
            'last_donation_at' => 'date',
            'opted_in_notifications' => 'boolean',
        ];
    }

    public function pet(): BelongsTo
    {
        return $this->belongsTo(Pet::class);
    }

    public function reports(): HasMany
    {
        return $this->hasMany(Report::class);
    }

    /**
     * @return Collection<int, DonationType>
     */
    public function donationTypes(): Collection
    {
        return DB::table('donor_profile_donation_type')
            ->where('donor_profile_id', $this->id)
            ->pluck('donation_type')
            ->map(fn (int $value) => DonationType::from($value));
    }

    public function syncDonationTypes(array $types): void
    {
        $rows = collect($types)
            ->map(fn (DonationType $type) => [
                'donor_profile_id' => $this->id,
                'donation_type' => $type->value,
            ]);

        DB::table('donor_profile_donation_type')
            ->where('donor_profile_id', $this->id)
            ->delete();

        DB::table('donor_profile_donation_type')->insert($rows->all());
    }
}
