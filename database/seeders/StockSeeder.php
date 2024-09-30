<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Stock;
use Carbon\Carbon;

class StockSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Lista de entradas de estoque predefinidas
        $stocks = [
            ['company_id' => 1, 'product_id' => 1, 'quantity' => 100, 'entry_date' => Carbon::now(), 'expiration_date' => null, 'location' => 'Depósito A', 'cost_price' => 5.00],
            ['company_id' => 1, 'product_id' => 2, 'quantity' => 50, 'entry_date' => Carbon::now(), 'expiration_date' => null, 'location' => 'Depósito B', 'cost_price' => 8.00],
            ['company_id' => 1, 'product_id' => 3, 'quantity' => 1, 'entry_date' => Carbon::now(), 'expiration_date' => null, 'location' => 'Sala de TI', 'cost_price' => 3000.00],
            ['company_id' => 1, 'product_id' => 4, 'quantity' => 200, 'entry_date' => Carbon::now(), 'expiration_date' => Carbon::now()->addYears(1), 'location' => 'Farmácia', 'cost_price' => 0.50],
        ];

        // Inserir entradas de estoque no banco de dados
        foreach ($stocks as $stock) {
            Stock::create($stock);
        }
    }
}
