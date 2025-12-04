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
    ];

    public function candidat()
    {
        return $this->belongsTo(Candidat::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
