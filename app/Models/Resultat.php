<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Resultat extends Model
{
    protected $fillable = [
        'candidat_id',
        'user_id',
        'nb_vote',
        'date_resultat',
        'lieu_id',
        'deliberation_fini'
    ];

    public function candidat()
    {
        return $this->belongsTo(Candidat::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function lieu() {
        return $this->belongsTo(Lieu::class);
    }
}
