<?php
// SupplierSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Supplier;
use App\Models\Company;

class SupplierSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Dados fictícios para os fornecedores em uma cidade do interior de Minas Gerais
        $suppliers = [
            [
                'name' => 'Comercial Oliveira',
                'category' => 'Atacado',
                'contacts' => json_encode([
                    ['type' => 'primary_phone', 'value' => '+55 35 3221-1234', 'category' => 'phone'],
                    ['type' => 'secondary_phone', 'value' => '+55 35 98877-6655', 'category' => 'phone'],
                    ['type' => 'whatsapp', 'value' => '+55 35 99988-7766', 'category' => 'phone']
                ]),
                'address' => 'Rua Principal, 45 - Centro',
                'state' => 'MG',
                'notes' => 'Fornecedor confiável para produtos agrícolas.',
                'status' => true,
            ],
            [
                'name' => 'Distribuidora Minas Gerais',
                'category' => 'Varejo',
                'contacts' => json_encode([
                    ['type' => 'primary_phone', 'value' => '+55 35 3244-5678', 'category' => 'phone'],
                    ['type' => 'fax', 'value' => '+55 35 3244-1234', 'category' => 'phone']
                ]),
                'address' => 'Av. das Palmeiras, 123 - Bairro das Flores',
                'state' => 'MG',
                'notes' => 'Especializada em materiais de construção.',
                'status' => true,
            ],
            [
                'name' => 'Mercadinho São José',
                'category' => 'Varejo',
                'contacts' => json_encode([
                    ['type' => 'primary_phone', 'value' => '+55 35 3332-9090', 'category' => 'phone'],
                    ['type' => 'secondary_phone', 'value' => '+55 35 99877-5566', 'category' => 'phone'],
                    ['type' => 'email', 'value' => 'contato@mercadinhojose.com', 'category' => 'string']
                ]),
                'address' => 'Rua das Laranjeiras, 89 - Bairro do Carmo',
                'state' => 'MG',
                'notes' => 'Pequeno mercado que atende a comunidade local.',
                'status' => true,
            ],
        ];

        // Inserir os fornecedores no banco de dados
        foreach ($suppliers as $supplierData) {
            // Adiciona o company_id ao array de dados do fornecedor
            $supplierData['company_id'] = 1; // Certifique-se de que a empresa com ID 1 existe

            // Cria o registro do fornecedor no banco de dados
            Supplier::create($supplierData);
        }
    }
}
