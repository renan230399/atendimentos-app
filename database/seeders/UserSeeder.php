<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Company; // Substituído de Empresa para Company
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {


        $stockLocals = [
            'Depósito A',
            'Depósito B',
            'Sala de Estoque 1'
        ];

        // Cadastrar uma empresa com fornecedores categorizados e locais de estoque
        $company = Company::create([
            'company_name' => 'Empresa Exemplo Ltda.',
            'company_logo' => 'https://keyar-atendimentos.s3.amazonaws.com/logos_empresas/Z1z2yPHQj7ps6gDoIFBS1WeE3GA2FhUPpaD7nMbU.png', 
            'stock_locals' => json_encode($stockLocals),
        ]);

        // Usuários específicos com cargo como inteiro
        $specificUsers = [
            [
                'name' => 'Ana Flávia',
                'email' => 'ana@example.com',
                'password' => Hash::make('password'), // Senha padrão
                'company_id' => $company->id,  // Substituído empresa_id para company_id
                'role' => 1, // Cargo fictício como inteiro 
            ],
            [
                'name' => 'Maria Fernanda',
                'email' => 'mariafernanda@example.com',
                'password' => Hash::make('password'),
                'company_id' => $company->id,
                'role' => 2,
            ],
        ];

        // Inserir usuários específicos
        foreach ($specificUsers as $user) {
            User::create($user);
        }
    }
}
