<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

class CreateAdminUser extends Command
{
    protected $signature = 'make:admin
                            {nom}
                            {prenom}
                            {num}
                            {password}
                            {--key=}';

    protected $description = 'Créer un utilisateur administrateur';

    public function handle()
    {
        if (app()->environment('production')) {
            $this->error('Cette commande est désactivée en production.');
            return;
        }

        $secret = env('ADMIN_CREATION_KEY');

        if ($this->option('key') !== $secret) {
            $this->error('Clé secrète invalide !');
            return;
        }

        if (User::where('num', $this->argument('num'))->exists()) {
            $this->error("Un utilisateur avec ce numéro existe déjà.");
            return;
        }

        $role = Role::where('lib_role', 'admin')->first();

        if (!$role) {
            $role = Role::create([
                'lib_role' => 'admin'
            ]);
        }

        User::create([
            'nom' => $this->argument('nom'),
            'prenom' => $this->argument('prenom'),
            'num' => $this->argument('num'),
            'password' => Hash::make($this->argument('password')),
            'role_id' => $role->id,
            'is_admin' => true
        ]);

        $this->info("Administrateur créé avec succès !");
    }
}
