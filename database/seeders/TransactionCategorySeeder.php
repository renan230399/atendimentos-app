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
            // Criar categorias de nível 1 (categorias principais)
            TransactionCategory::create([
                'name' => 'Vendas',
                'type' => 'income',
                'company_id' => $company->id,
                'parent_id' => null, // Categoria raiz
            ]);
            TransactionCategory::create([
                'name' => 'Consultas',
                'type' => 'income',
                'company_id' => $company->id,
                'parent_id' => null, // Categoria raiz
            ]);
            TransactionCategory::create([
                'name' => 'Compras',
                'type' => 'expense',
                'company_id' => $company->id,
                'parent_id' => null, // Categoria raiz
            ]);
            TransactionCategory::create([
                'name' => 'Compras Esporádicas',
                'type' => 'expense',
                'company_id' => $company->id,
                'parent_id' => null, // Categoria raiz
            ]);
            TransactionCategory::create([
                'name' => 'Correção de caixa - Adicionar',
                'type' => 'income',
                'company_id' => $company->id,
                'parent_id' => null, // Categoria raiz
            ]);
            TransactionCategory::create([
                'name' => 'Correção de caixa - Subtrair',
                'type' => 'expense',
                'company_id' => $company->id,
                'parent_id' => null, // Categoria raiz
            ]);
  
            $fixedCosts = TransactionCategory::create([
                'name' => 'Gastos Fixos',
                'type' => 'expense',
                'company_id' => $company->id,
                'parent_id' => null, // Categoria raiz
            ]);

            // Subcategorias de Gastos Fixos - Nível 2
            $employeeExpenses = TransactionCategory::create([
                'name' => 'Despesas com Funcionários',
                'type' => 'expense',
                'company_id' => $company->id,
                'parent_id' => $fixedCosts->id,
            ]);

            $operationalExpenses = TransactionCategory::create([
                'name' => 'Despesas Operacionais',
                'type' => 'expense',
                'company_id' => $company->id,
                'parent_id' => $fixedCosts->id,
            ]);

            $administrativeExpenses = TransactionCategory::create([
                'name' => 'Despesas Administrativas',
                'type' => 'expense',
                'company_id' => $company->id,
                'parent_id' => $fixedCosts->id,
            ]);

            $marketingExpenses = TransactionCategory::create([
                'name' => 'Marketing e Publicidade',
                'type' => 'expense',
                'company_id' => $company->id,
                'parent_id' => $fixedCosts->id,
            ]);

            $technologyExpenses = TransactionCategory::create([
                'name' => 'Equipamentos e Tecnologia',
                'type' => 'expense',
                'company_id' => $company->id,
                'parent_id' => $fixedCosts->id,
            ]);

            $transportExpenses = TransactionCategory::create([
                'name' => 'Despesas com Transporte e Logística',
                'type' => 'expense',
                'company_id' => $company->id,
                'parent_id' => $fixedCosts->id,
            ]);

            $otherFixedCosts = TransactionCategory::create([
                'name' => 'Outros Custos Fixos',
                'type' => 'expense',
                'company_id' => $company->id,
                'parent_id' => $fixedCosts->id,
            ]);

            $licensesExpenses = TransactionCategory::create([
                'name' => 'Despesas com Licenças e Autorizações',
                'type' => 'expense',
                'company_id' => $company->id,
                'parent_id' => $fixedCosts->id,
            ]);

            // Subcategorias de Despesas com Funcionários - Nível 3
            TransactionCategory::create([
                'name' => 'Salários e Encargos Sociais',
                'type' => 'expense',
                'company_id' => $company->id,
                'parent_id' => $employeeExpenses->id,
            ]);

            TransactionCategory::create([
                'name' => 'Benefícios',
                'type' => 'expense',
                'company_id' => $company->id,
                'parent_id' => $employeeExpenses->id,
            ]);

            TransactionCategory::create([
                'name' => 'Contratação de Terceiros',
                'type' => 'expense',
                'company_id' => $company->id,
                'parent_id' => $employeeExpenses->id,
            ]);

            // Subcategorias de Despesas Operacionais - Nível 3
            TransactionCategory::create([
                'name' => 'Aluguel',
                'type' => 'expense',
                'company_id' => $company->id,
                'parent_id' => $operationalExpenses->id,
            ]);

            TransactionCategory::create([
                'name' => 'Energia Elétrica',
                'type' => 'expense',
                'company_id' => $company->id,
                'parent_id' => $operationalExpenses->id,
            ]);

            TransactionCategory::create([
                'name' => 'Água e Esgoto',
                'type' => 'expense',
                'company_id' => $company->id,
                'parent_id' => $operationalExpenses->id,
            ]);

            TransactionCategory::create([
                'name' => 'Internet',
                'type' => 'expense',
                'company_id' => $company->id,
                'parent_id' => $operationalExpenses->id,
            ]);

            TransactionCategory::create([
                'name' => 'Telefonia',
                'type' => 'expense',
                'company_id' => $company->id,
                'parent_id' => $operationalExpenses->id,
            ]);

            TransactionCategory::create([
                'name' => 'Serviços de Limpeza e Manutenção',
                'type' => 'expense',
                'company_id' => $company->id,
                'parent_id' => $operationalExpenses->id,
            ]);

            // Subcategorias de Despesas Administrativas - Nível 3
            TransactionCategory::create([
                'name' => 'Licenças e Taxas Governamentais',
                'type' => 'expense',
                'company_id' => $company->id,
                'parent_id' => $administrativeExpenses->id,
            ]);

            TransactionCategory::create([
                'name' => 'Impostos',
                'type' => 'expense',
                'company_id' => $company->id,
                'parent_id' => $administrativeExpenses->id,
            ]);

            TransactionCategory::create([
                'name' => 'Contabilidade',
                'type' => 'expense',
                'company_id' => $company->id,
                'parent_id' => $administrativeExpenses->id,
            ]);

            TransactionCategory::create([
                'name' => 'Consultoria e Honorários Advocatícios',
                'type' => 'expense',
                'company_id' => $company->id,
                'parent_id' => $administrativeExpenses->id,
            ]);

            TransactionCategory::create([
                'name' => 'Despesas Bancárias',
                'type' => 'expense',
                'company_id' => $company->id,
                'parent_id' => $administrativeExpenses->id,
            ]);

            // Outras categorias podem ser adicionadas da mesma forma...
        }
    }
}
