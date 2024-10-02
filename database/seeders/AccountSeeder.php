<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Account;
use App\Models\Company;
use Faker\Factory as Faker;

class AccountSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
            
        // Campos para o formulário de Procedimentos
        $accounts = [
            [
                'company_id' => 1,
                'name' => 'Maquininha da Ton',
                'type' => 'bank',
                'balance' => 0,
            ],
            [
                'company_id' => 1,
                'name' => 'Caixa Físico',
                'type' => 'cash',
                'balance' => 0,
            ],
            [
                'company_id' => 1,
                'name' => 'Conta Sicoob',
                'type' => 'bank',
                'balance' => 0,
            ],
        ];

        // Adicionar os campos do formulário de Procedimentos
        foreach ($accounts as $account) {
            Account::create($account);
        }

        
    }
}
