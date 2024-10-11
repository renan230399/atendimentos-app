<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\StockLocal;

class StockLocalSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Criação dos locais de estoque principais para uma microempresa
        $mainLocations = [
            ['company_id' => 1, 'name' => 'Estoque Principal', 'description' => 'Local principal para armazenamento de produtos.'],
            ['company_id' => 1, 'name' => 'Depósito Pequeno', 'description' => 'Depósito para produtos adicionais ou temporários.'],
            ['company_id' => 1, 'name' => 'Sala de Atendimento', 'description' => 'Sala destinada a consultas e atendimento de clientes.'],
        ];

        $parentLocations = [];

        // Inserir os locais principais e salvar seus IDs
        foreach ($mainLocations as $location) {
            $parentLocations[$location['name']] = StockLocal::create($location);
        }

        // Criação de sublocais para cada local principal, mais detalhados
        $subLocations = [
            // Sublocais de Estoque Principal
            ['company_id' => 1, 'parent_id' => $parentLocations['Estoque Principal']->id, 'name' => 'Prateleira 1', 'description' => 'Prateleira para itens de uso diário.'],
            ['company_id' => 1, 'parent_id' => $parentLocations['Estoque Principal']->id, 'name' => 'Prateleira 2', 'description' => 'Prateleira para produtos de reserva.'],
            ['company_id' => 1, 'parent_id' => $parentLocations['Estoque Principal']->id, 'name' => 'Prateleira 3', 'description' => 'Prateleira para itens volumosos.'],

            // Sublocais de Depósito Pequeno
            ['company_id' => 1, 'parent_id' => $parentLocations['Depósito Pequeno']->id, 'name' => 'Caixa A', 'description' => 'Caixa para materiais de escritório.'],
            ['company_id' => 1, 'parent_id' => $parentLocations['Depósito Pequeno']->id, 'name' => 'Caixa B', 'description' => 'Caixa para produtos em estoque.'],

            // Sublocais de Sala de Atendimento
            ['company_id' => 1, 'parent_id' => $parentLocations['Sala de Atendimento']->id, 'name' => 'Armário de Medicamentos', 'description' => 'Armário para armazenar medicamentos.'],
            ['company_id' => 1, 'parent_id' => $parentLocations['Sala de Atendimento']->id, 'name' => 'Gaveta de Equipamentos', 'description' => 'Gaveta para guardar equipamentos de atendimento.'],
        ];

        $subLocationsData = [];

        // Inserir sublocais e salvar seus IDs
        foreach ($subLocations as $subLocation) {
            $subLocationsData[$subLocation['name']] = StockLocal::create($subLocation);
        }

        // Adicionar mais sub-sublocais para detalhar a organização
        $subSubLocations = [
            // Sub-sublocais de Prateleira 1
            ['company_id' => 1, 'parent_id' => $subLocationsData['Prateleira 1']->id, 'name' => 'Caixa Pequena', 'description' => 'Caixa para pequenos componentes e itens.'],
            ['company_id' => 1, 'parent_id' => $subLocationsData['Prateleira 1']->id, 'name' => 'Caixa Média', 'description' => 'Caixa para itens de tamanho médio.'],

            // Sub-sublocais de Prateleira 2
            ['company_id' => 1, 'parent_id' => $subLocationsData['Prateleira 2']->id, 'name' => 'Gaveta A', 'description' => 'Gaveta para itens frágeis.'],
            ['company_id' => 1, 'parent_id' => $subLocationsData['Prateleira 2']->id, 'name' => 'Gaveta B', 'description' => 'Gaveta para documentos importantes.'],

            // Sub-sublocais de Armário de Medicamentos
            ['company_id' => 1, 'parent_id' => $subLocationsData['Armário de Medicamentos']->id, 'name' => 'Prateleira Superior', 'description' => 'Prateleira para medicamentos de uso urgente.'],
            ['company_id' => 1, 'parent_id' => $subLocationsData['Armário de Medicamentos']->id, 'name' => 'Prateleira Inferior', 'description' => 'Prateleira para medicamentos de uso geral.'],
        ];

        // Inserir as sub-sublocais
        foreach ($subSubLocations as $subSubLocation) {
            StockLocal::create($subSubLocation);
        }
    }
}
