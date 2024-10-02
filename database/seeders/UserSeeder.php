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
        // Definindo fornecedores com categorização em formato JSON
        $suppliers = [
            'nacionais' => [
                [
                    'id' => 1,
                    'name' => 'Mercado Livre',
                    'contact' => 'contato@mercadolivre.com',
                    'phone' => '123456789',
                    'address' => 'Rua Exemplo, 123, São Paulo, SP',  // Adicionando um endereço
                    'product_types' => ['Eletrônicos', 'Roupas']  // Adicionando tipos de produtos fornecidos
                ],
                [
                    'id' => 2,
                    'name' => 'Loja Brasil',
                    'contact' => 'contato@lojabrasil.com',
                    'phone' => '987654321',
                    'address' => 'Avenida Brasil, 456, Rio de Janeiro, RJ',
                    'product_types' => ['Alimentos', 'Utensílios']
                ]
            ],
            'internacionais' => [
                [
                    'id' => 3,
                    'name' => 'Alibaba',
                    'contact' => 'contact@alibaba.com',
                    'phone' => '+86123456789',
                    'address' => '123 Alibaba Road, Hangzhou, China',
                    'product_types' => ['Vestuário', 'Eletrônicos']
                ]
            ]
        ];

        $stockLocals = [
            'Depósito A',
            'Depósito B',
            'Sala de Estoque 1'
        ];

        // Cadastrar uma empresa com fornecedores categorizados e locais de estoque
        $company = Company::create([
            'company_name' => 'Empresa Exemplo Ltda.',
            'company_logo' => null, 
            'suppliers' => json_encode($suppliers), // Armazenando fornecedores categorizados
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
