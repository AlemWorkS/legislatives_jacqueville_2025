<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Recensement extends Model
{
    protected $fillable = [
        'agent_id',
        'moment_recensement',
        'nb_vote_cumule',
        'lieu_id',
        'bureau_id'
    ];

    protected $casts = [
        'data' => 'array',
    ];


    public function agent(): BelongsTo
    {
        return $this->belongsTo(User::class, 'agent_id');
    }

    public function lieu(): BelongsTo
    {
        return $this->belongsTo(Lieu::class, 'lieu_id');
    }
}
