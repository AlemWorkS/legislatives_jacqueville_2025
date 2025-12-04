<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Bureau extends Model
{
    protected $fillable = [];

    protected $table = 'bureaux';


    public function lieu()
    {
        return $this->belongsTo(Lieu::class);
    }

    public function user() { return $this->belongsTo(User::class); }

}
