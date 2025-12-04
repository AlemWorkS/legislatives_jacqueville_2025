<?php

namespace App\Models;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = ['name', 'prenom', 'num', 'password', 'role_id'];

    protected $hidden = ['password', 'remember_token'];


    public function role()
    {
        return $this->belongsTo(Role::class);
    }


    public function hasRole($roleName)
    {
        return $this->role && $this->role->lib_role === $roleName;
    }

    public function isAdmin(): bool
    {
        return $this->role && $this->role->lib_role === 'admin';
    }

    public function agent()
    {
        return $this->hasOne(User::class); // un bureau possède un agent
    }
}
