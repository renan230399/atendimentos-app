<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Empresa;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Cria uma empresa fictícia
        $empresa = Empresa::factory()->create();

        // Usuários específicos com cargo como inteiro
        $usuariosEspecificos = [
            [
                'name' => 'Carlos da Silva',
                'email' => 'carlos@example.com',
                'password' => Hash::make('password'), // Senha padrão
                'empresa_id' => $empresa->id,
                'cargo' => 1, // Cargo fictício como inteiro
            ],
            [
                'name' => 'Ana Pereira',
                'email' => 'ana@example.com',
                'password' => Hash::make('password'),
                'empresa_id' => $empresa->id,
                'cargo' => 2,
            ],
            [
                'name' => 'João Souza',
                'email' => 'joao@example.com',
                'password' => Hash::make('password'),
                'empresa_id' => $empresa->id,
                'cargo' => 3,
            ],
            [
                'name' => 'Maria Oliveira',
                'email' => 'maria@example.com',
                'password' => Hash::make('password'),
                'empresa_id' => $empresa->id,
                'cargo' => 4,
            ],
            [
                'name' => 'Lucas Mendes',
                'email' => 'lucas@example.com',
                'password' => Hash::make('password'),
                'empresa_id' => $empresa->id,
                'cargo' => 5,
            ],
        ];

        // Inserir usuários específicos
        foreach ($usuariosEspecificos as $usuario) {
            User::create($usuario);
        }
    }
}
