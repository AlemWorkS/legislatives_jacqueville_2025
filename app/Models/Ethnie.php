<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ethnie extends Model
{
    use HasFactory;

    protected $table = 'ethnies';

    protected $fillable = [
        'lib_ethnie'
    ];

    /**
     * Une ethnie possède plusieurs zones
     * (relation 1:N)
     */
    public function zones()
    {
        return $this->hasMany(Zone::class, 'ethnie_id');
    }
}
