<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Zone extends Model
{
    use HasFactory;

    protected $table = 'zones';

    protected $fillable = [
        'lib_zone',
        'centre_id',
        'ethnie_id',
        'nb_inscrits',
        'nb_bur',
    ];

    protected $casts = [
        'nb_inscrits' => 'integer',
        'nb_bur'      => 'integer',
        'centre_id'   => 'integer',
        'ethnie_id'   => 'integer',
    ];

    /*
    |--------------------------------------------------------------------------
    | RELATIONS
    |--------------------------------------------------------------------------
    */

    // Une Zone appartient à un Centre
    public function centre()
    {
        return $this->belongsTo(Centre::class);
    }

    // Une Zone appartient à une Ethnie
    public function ethnie()
    {
        return $this->belongsTo(Ethnie::class);
    }

    // Une Zone contient plusieurs Lieux
    public function lieux()
    {
        return $this->hasMany(Lieu::class);
    }

    /*
    |--------------------------------------------------------------------------
    | ACCESSORS (computed attributes)
    |--------------------------------------------------------------------------
    */

    // Total des bureaux vérifiés par les lieux associés
    public function getTotalBureauxAttribute()
    {
        return $this->lieux->sum('nb_bureau');
    }

    // Total des inscrits provenant des lieux
    public function getTotalInscritsAttribute()
    {
        return $this->lieux->sum('nb_inscrit');
    }

    /*
    |--------------------------------------------------------------------------
    | SCOPES (pour tableaux de bord)
    |--------------------------------------------------------------------------
    */

    public function scopeSearch($query, $term)
    {
        if (!$term) return $query;

        return $query->where('lib_zone', 'like', "%$term%");
    }
}
