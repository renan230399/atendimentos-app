<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Transaction;
use App\Models\Account;
use App\Models\TransactionCategory;
use App\Models\Company;
use App\Models\User;
use App\Models\Consultation;
use Faker\Factory as Faker;

class TransactionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker::create();

        // Buscar todas as contas, categorias, empresas, usuários e consultas
        $accounts = Account::all();
        $categories = TransactionCategory::all();
        $companies = Company::all();
        $users = User::all(); // Usuários para a categoria "funcionarios"
        $consultations = Consultation::all(); // Consultas para a categoria "receitas de consultas"

        foreach (range(1, 50) as $index) {
            // Escolher uma categoria aleatória
            $category = $categories->random();
            $related = null;

            // Lógica de associação com base na categoria
            if ($category->name == 'funcionarios') {
                // Associar a um usuário se a categoria for "funcionarios"
                $related = $users->random();
            } elseif ($category->name == 'receitas de consultas') {
                // Associar a uma consulta se a categoria for "receitas de consultas"
                $related = $consultations->random();
            }

            // Criar a transação
            $transaction = Transaction::create([
                'account_id' => $accounts->random()->id,
                'category_id' => $category->id,
                'company_id' => $companies->random()->id,
                'type' => $faker->randomElement(['income', 'expense', 'transfer']),
                'amount' => $faker->randomFloat(2, 100, 10000),
                'description' => $related ? null : $faker->sentence(), // Apenas transações sem relação terão uma descrição
                'transaction_date' => $faker->dateTimeBetween('2024-10-01', '2024-10-30')->format('Y-m-d'),
                'status' => $faker->boolean(),
            ]);

            // Associar a transação ao modelo relacionado (usuário ou consulta), se aplicável
            if ($related) {
                $transaction->related()->associate($related);
                $transaction->save();
            }
        }
    }
}
