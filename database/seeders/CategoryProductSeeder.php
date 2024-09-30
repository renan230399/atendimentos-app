<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CategoryProduct;

class CategoryProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Lista de categorias predefinidas
        $categories = [
            ['company_id' => 1, 'name' => 'Limpeza e Higiene Pessoal'],
            ['company_id' => 1, 'name' => 'Inventário Empresa'],
            ['company_id' => 1, 'name' => 'Equipamentos'],
            ['company_id' => 1, 'name' => 'Medicamentos e Utensílios'],
        ];

        // Inserir categorias específicas no banco de dados
        foreach ($categories as $category) {
            CategoryProduct::create($category);
        }
    }
}
