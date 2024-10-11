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
        // Criação das categorias principais
        $categories = [
            ['company_id' => 1, 'name' => 'Limpeza e Higiene Pessoal'],
            ['company_id' => 1, 'name' => 'Inventário Empresa'],
            ['company_id' => 1, 'name' => 'Equipamentos'],
            ['company_id' => 1, 'name' => 'Medicamentos e Utensílios'],
        ];

        $parentCategories = [];

        // Inserir as categorias principais e salvar seus IDs
        foreach ($categories as $category) {
            $parentCategories[$category['name']] = CategoryProduct::create($category);
        }

        // Criar subcategorias para cada categoria principal
        $subcategories = [
            // Subcategorias de Limpeza e Higiene Pessoal
            ['company_id' => 1, 'parent_id' => $parentCategories['Limpeza e Higiene Pessoal']->id, 'name' => 'Produtos de Limpeza'],
            ['company_id' => 1, 'parent_id' => $parentCategories['Limpeza e Higiene Pessoal']->id, 'name' => 'Sabonetes'],
            ['company_id' => 1, 'parent_id' => $parentCategories['Limpeza e Higiene Pessoal']->id, 'name' => 'Desinfetantes'],

            // Subcategorias de Inventário Empresa
            ['company_id' => 1, 'parent_id' => $parentCategories['Inventário Empresa']->id, 'name' => 'Móveis de Escritório'],
            ['company_id' => 1, 'parent_id' => $parentCategories['Inventário Empresa']->id, 'name' => 'Material de Escritório'],

            // Subcategorias de Equipamentos
            ['company_id' => 1, 'parent_id' => $parentCategories['Equipamentos']->id, 'name' => 'Ferramentas Elétricas'],
            ['company_id' => 1, 'parent_id' => $parentCategories['Equipamentos']->id, 'name' => 'Equipamentos de Segurança'],

            // Subcategorias de Medicamentos e Utensílios
            ['company_id' => 1, 'parent_id' => $parentCategories['Medicamentos e Utensílios']->id, 'name' => 'Analgésicos'],
            ['company_id' => 1, 'parent_id' => $parentCategories['Medicamentos e Utensílios']->id, 'name' => 'Equipamentos Médicos'],
        ];

        $subCategoriesData = [];

        // Inserir subcategorias e salvar seus IDs
        foreach ($subcategories as $subcategory) {
            $subCategoriesData[$subcategory['name']] = CategoryProduct::create($subcategory);
        }

        // Criar sub-subcategorias (nível mais profundo) para algumas subcategorias
        $subSubcategories = [
            // Sub-subcategorias de Produtos de Limpeza
            ['company_id' => 1, 'parent_id' => $subCategoriesData['Produtos de Limpeza']->id, 'name' => 'Detergentes'],
            ['company_id' => 1, 'parent_id' => $subCategoriesData['Produtos de Limpeza']->id, 'name' => 'Limpadores Multiuso'],

            // Sub-subcategorias de Equipamentos de Segurança
            ['company_id' => 1, 'parent_id' => $subCategoriesData['Equipamentos de Segurança']->id, 'name' => 'Capacetes de Proteção'],
            ['company_id' => 1, 'parent_id' => $subCategoriesData['Equipamentos de Segurança']->id, 'name' => 'Luvas de Segurança'],

            // Sub-subcategorias de Equipamentos Médicos
            ['company_id' => 1, 'parent_id' => $subCategoriesData['Equipamentos Médicos']->id, 'name' => 'Estetoscópios'],
            ['company_id' => 1, 'parent_id' => $subCategoriesData['Equipamentos Médicos']->id, 'name' => 'Termômetros Digitais'],
        ];

        // Inserir as sub-subcategorias
        foreach ($subSubcategories as $subSubcategory) {
            CategoryProduct::create($subSubcategory);
        }
    }
}
