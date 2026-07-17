<?php

namespace App\Models;

use App\Concerns\HasPointLocation;
use App\Enums\BloodType;
use App\Enums\DonationRequestStatus;
use App\Enums\DonationType;
use App\Enums\Species;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use OwenIt\Auditing\Auditable;
use OwenIt\Auditing\Contracts\Auditable as AuditableContract;

class DonationRequest extends Model implements AuditableContract
{
    use Auditable, HasFactory, HasPointLocation;

    protected $fillable = [
        'requester_id',
        'pet_id',
        'species',
        'blood_type_needed',
        'donation_type',
        'status',
        'share_phone',
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
            'share_phone' => 'boolean',
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

    public function scopeOpen(Builder $query): Builder
    {
        return $query
            ->where('status', DonationRequestStatus::Aberta)
            ->where('expires_at', '>', now());
    }

    /**
     * Mesma técnica de bounding box + spatial index usada em Pet::scopeNearby.
     */
    public function scopeNearby(Builder $query, float $lat, float $lng, float $radiusKm): Builder
    {
        $latDelta = $radiusKm / 111.0;
        $lngDelta = $radiusKm / (111.320 * max(cos(deg2rad($lat)), 0.01));

        $minLat = $lat - $latDelta;
        $maxLat = $lat + $latDelta;
        $minLng = $lng - $lngDelta;
        $maxLng = $lng + $lngDelta;

        $polygon = sprintf(
            'POLYGON((%F %F, %F %F, %F %F, %F %F, %F %F))',
            $minLng, $minLat,
            $maxLng, $minLat,
            $maxLng, $maxLat,
            $minLng, $maxLat,
            $minLng, $minLat,
        );

        return $query
            ->selectRaw('donation_requests.*, ST_Distance_Sphere(location, ST_PointFromText(?, 4326)) / 1000 as distance_km', [
                "POINT($lng $lat)",
            ])
            ->whereRaw('MBRContains(ST_GeomFromText(?, 4326), location)', [$polygon])
            ->having('distance_km', '<=', $radiusKm)
            ->orderBy('distance_km');
    }
}
