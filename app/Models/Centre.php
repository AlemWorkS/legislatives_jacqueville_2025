<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Centre extends Model
{
    protected $fillable = [
        'name',
        'address',
        'quartier_id',
    ];


    public function recensements(): HasMany
    {
        return $this->hasMany(Recensement::class);
    }

    // Un centre a plusieurs lieux
    public function lieux(): HasMany
    {
        return $this->hasMany(Lieu::class);
    }
}
