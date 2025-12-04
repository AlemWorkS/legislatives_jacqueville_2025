<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use LDAP\Result;

class Lieu extends Model
{
    use HasFactory;

    protected $table = 'lieux';

    protected $fillable = [
        'lib_lieu',
        'zone_id',
        'ethnie_id',
        'nb_inscrit',
        'nb_bureau',
        'centre_id',
        'agent_responsable_id'
    ];

    protected $casts = [
        'zone_id'    => 'integer',
        'ethnie_id'  => 'integer',
        'nb_inscrit' => 'integer',
        'nb_bureau'  => 'integer',
    ];

    /*
    |--------------------------------------------------------------------------
    | RELATIONS
    |--------------------------------------------------------------------------
    */

    // Un lieu appartient à une zone
    public function zone()
    {
        return $this->belongsTo(Zone::class);
    }

    // Un lieu a une ethnie dominante
    public function ethnie()
    {
        return $this->belongsTo(Ethnie::class);
    }

    // Un lieu appartient à un centre
    public function centre(){
        return $this->belongsTo(Centre::class);
    }

    // Un lieu contient plusieurs bureaux
    public function bureaux()
    {
        return $this->hasMany(Bureau::class);
    }

    // Un lieu possède des recensements effectués par l’agent assigné
    public function recensements()
    {
        return $this->hasMany(Recensement::class);
    }

    public function resultat(){
        return $this->hasOne(Resultat::class);
    }

    /*
    |--------------------------------------------------------------------------
    | ACCESSORS UTILES POUR TABLEAUX DE BORD
    |--------------------------------------------------------------------------
    */

    public function getTotalVotesAttribute()
    {
        return $this->recensements->sum('nb_vote');
    }

    public function getHasAgentAttribute()
    {
        return $this->user != null;
    }

    /*
    |--------------------------------------------------------------------------
    | RELATION AVEC LES UTILISATEURS (L'AGENT DU LIEU)
    |--------------------------------------------------------------------------
    |
    | Chaque lieu possède UN SEUL agent assigné par l'administrateur.
    | On garde un champ user_id dans la table lieux (à créer si pas encore).
    |
    */

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /*
    |--------------------------------------------------------------------------
    | SCOPES POUR FILTRAGE
    |--------------------------------------------------------------------------
    */

    public function scopeSearch($query, $term)
    {
        if (!$term) return $query;

        return $query->where('lib_lieu', 'like', "%$term%");
    }


}
