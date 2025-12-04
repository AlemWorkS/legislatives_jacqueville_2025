<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

class CreateAgent extends Command
{
    protected $signature = 'make:agent
                            {nom}
                            {prenom}
                            {num}
                            {password}
                            {--key=}';

    protected $description = 'Créer un utilisateur agent';

    public function handle()
    {
        if (app()->environment('production')) {
            $this->error('Cette commande est désactivée en production.');
            return;
        }


        if (User::where('num', $this->argument('num'))->exists()) {
            $this->error("Un utilisateur avec ce numéro existe déjà.");
            return;
        }

        $role = Role::where('lib_role', 'agent')->first();

        if (!$role) {
            $role = Role::create([
                'lib_role' => 'agent'
            ]);
        }

        User::create([
            'nom' => $this->argument('nom'),
            'prenom' => $this->argument('prenom'),
            'num' => $this->argument('num'),
            'password' => Hash::make($this->argument('password')),
            'role_id' => $role->id,
            'is_admin' => false
        ]);

        $this->info("Agent créé avec succès !");
    }
}
