<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use OwenIt\Auditing\Auditable;
use OwenIt\Auditing\Contracts\Auditable as AuditableContract;

#[Fillable(['name', 'email', 'google_id', 'password', 'phone', 'cep', 'city', 'state', 'lat', 'lng'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable implements AuditableContract
{
    /** @use HasFactory<UserFactory> */
    use Auditable, HasApiTokens, HasFactory, Notifiable;

    /**
     * Excluídos da auditoria por segurança — nunca guardar hash de senha,
     * token de sessão persistente ou o id do Google em old_values/new_values.
     */
    protected $auditExclude = ['password', 'remember_token', 'google_id'];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'lat' => 'decimal:7',
            'lng' => 'decimal:7',
        ];
    }

    public function pets(): HasMany
    {
        return $this->hasMany(Pet::class, 'tutor_id');
    }

    public function clinic(): HasOne
    {
        return $this->hasOne(Clinic::class);
    }

    public function isVerifiedClinic(): bool
    {
        return $this->clinic()->where('verified', true)->exists();
    }
}
