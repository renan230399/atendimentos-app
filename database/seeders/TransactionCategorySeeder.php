<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\TransactionCategory;
use App\Models\Company;
use Faker\Factory as Faker;

class TransactionCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker::create();

        // Supondo que você já tenha empresas na sua base de dados
        $companies = Company::all(); // Buscar todas as empresas

        foreach ($companies as $company) {
            // Criar categorias de transação para cada empresa
            $categories = [
                [
                    'name' => 'Vendas',
                    'type' => 'income', // Tipo: receita
                    'company_id' => $company->id,
                ],
                [
                    'name' => 'Consultas',
                    'type' => 'income', // Tipo: despesa
                    'company_id' => $company->id,
                ],
                [
                    'name' => 'Salários',
                    'type' => 'expense', // Tipo: despesa
                    'company_id' => $company->id,
                ],
                [
                    'name' => 'Gastos Fixos',
                    'type' => 'expense', // Tipo: despesa
                    'company_id' => $company->id,
                ],
                [
                    'name' => 'Compras',
                    'type' => 'expense', // Tipo: receita
                    'company_id' => $company->id,
                ],
                [
                    'name' => 'Compras Esporádicas',
                    'type' => 'income', // Tipo: despesa
                    'company_id' => $company->id,
                ],
                [
                    'name' => 'Correção de caixa - Adicionar',
                    'type' => 'income', // Tipo: receita
                    'company_id' => $company->id,
                ],
                [
                    'name' => 'Correção de caixa - Subtrair',
                    'type' => 'expense', // Tipo: receita
                    'company_id' => $company->id,
                ],
            ];

            // Adicionar as categorias para a empresa
            foreach ($categories as $category) {
                TransactionCategory::create($category);
            }
        }
    }
}
