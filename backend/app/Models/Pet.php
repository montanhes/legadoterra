<?php

namespace App\Models;

use App\Concerns\HasPointLocation;
use App\Enums\Sex;
use App\Enums\Species;
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
}
