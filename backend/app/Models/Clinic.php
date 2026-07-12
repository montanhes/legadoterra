<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Clinic extends Model
{
    protected $fillable = [
        'name',
        'cep',
        'city',
        'lat',
        'lng',
        'phone',
        'verified',
    ];

    protected function casts(): array
    {
        return [
            'lat' => 'decimal:7',
            'lng' => 'decimal:7',
            'verified' => 'boolean',
        ];
    }
}
