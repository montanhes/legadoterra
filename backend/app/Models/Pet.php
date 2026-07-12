<?php

namespace App\Models;

use App\Concerns\HasPointLocation;
use App\Enums\Sex;
use App\Enums\Species;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Pet extends Model
{
    use HasFactory, HasPointLocation;

    protected $fillable = [
        'tutor_id',
        'name',
        'species',
        'sex',
        'breed',
        'weight',
        'birthdate',
        'photo_path',
        'castrado',
        'lat',
        'lng',
    ];

    protected function casts(): array
    {
        return [
            'species' => Species::class,
            'sex' => Sex::class,
            'castrado' => 'boolean',
            'birthdate' => 'date',
            'weight' => 'decimal:2',
            'lat' => 'decimal:7',
            'lng' => 'decimal:7',
        ];
    }

    public function tutor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'tutor_id');
    }

    public function donorProfile(): HasOne
    {
        return $this->hasOne(DonorProfile::class);
    }

    public function donationRequests(): HasMany
    {
        return $this->hasMany(DonationRequest::class);
    }

    public function badges(): BelongsToMany
    {
        return $this->belongsToMany(Badge::class, 'pet_badges')->withPivot('awarded_at');
    }

    /**
     * Filtra por raio (km) a partir de um ponto, usando bounding box pra
     * acionar o SPATIAL INDEX de `location` (validado via EXPLAIN) e
     * refinando a distância exata com ST_Distance_Sphere.
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
            ->selectRaw('pets.*, ST_Distance_Sphere(location, ST_PointFromText(?, 4326)) / 1000 as distance_km', [
                "POINT($lng $lat)",
            ])
            ->whereRaw('MBRContains(ST_GeomFromText(?, 4326), location)', [$polygon])
            ->having('distance_km', '<=', $radiusKm)
            ->orderBy('distance_km');
    }
}
