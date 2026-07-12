<?php

namespace App\Models;

use App\Concerns\HasPointLocation;
use App\Enums\BloodType;
use App\Enums\DonationRequestStatus;
use App\Enums\DonationType;
use App\Enums\Species;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DonationRequest extends Model
{
    use HasPointLocation;

    protected $fillable = [
        'requester_id',
        'pet_id',
        'species',
        'blood_type_needed',
        'donation_type',
        'status',
        'lat',
        'lng',
        'expires_at',
    ];

    protected function casts(): array
    {
        return [
            'species' => Species::class,
            'blood_type_needed' => BloodType::class,
            'donation_type' => DonationType::class,
            'status' => DonationRequestStatus::class,
            'lat' => 'decimal:7',
            'lng' => 'decimal:7',
            'expires_at' => 'datetime',
        ];
    }

    public function requester(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requester_id');
    }

    public function pet(): BelongsTo
    {
        return $this->belongsTo(Pet::class);
    }
}
