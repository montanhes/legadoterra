<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Badge extends Model
{
    protected $fillable = [
        'code',
        'label',
    ];

    public function pets(): BelongsToMany
    {
        return $this->belongsToMany(Pet::class, 'pet_badges')->withPivot('awarded_at');
    }
}
