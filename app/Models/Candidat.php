<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Candidat extends Model
{
    protected $fillable = [
        'nom',
        'sexe',
    ];

    protected $casts = [
        'date_naissance' => 'date',
    ];

    public function centre(): BelongsTo
    {
        return $this->belongsTo(Centre::class);
    }

    public function agent(): BelongsTo
    {
        return $this->belongsTo(User::class, 'agent_id');
    }

    public function resultats()
    {
        return $this->hasMany(Resultat::class);
    }
}
