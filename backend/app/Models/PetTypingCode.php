<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PetTypingCode extends Model
{
    public const int TTL_MINUTES = 30;

    protected $fillable = [
        'pet_id',
        'code',
        'expires_at',
        'used_at',
        'used_by_clinic_id',
    ];

    protected function casts(): array
    {
        return [
            'expires_at' => 'datetime',
            'used_at' => 'datetime',
        ];
    }

    public function pet(): BelongsTo
    {
        return $this->belongsTo(Pet::class);
    }

    public function usedByClinic(): BelongsTo
    {
        return $this->belongsTo(Clinic::class, 'used_by_clinic_id');
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->whereNull('used_at')->where('expires_at', '>', now());
    }

    /**
     * Um código ativo por pet — gerar um novo invalida o anterior.
     */
    public static function generateFor(Pet $pet): self
    {
        static::where('pet_id', $pet->id)->active()->update(['used_at' => now()]);

        do {
            $code = (string) random_int(100000, 999999);
        } while (static::where('code', $code)->active()->exists());

        return static::create([
            'pet_id' => $pet->id,
            'code' => $code,
            'expires_at' => now()->addMinutes(self::TTL_MINUTES),
        ]);
    }
}
