<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Stock;
use App\Models\Order;
use App\Models\OrderItem;
use Carbon\Carbon;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Lista de produtos predefinidos com as respectivas categorias
        $products = [
            // Produtos da categoria 'Limpeza e Higiene Pessoal' (category_id = 1)
            ['company_id' => 1, 'category_id' => 1, 'name' => 'Sabonete Líquido', 'description' => 'Sabonete líquido para higiene pessoal.', 'measuring_unit' => 'ml'],
            ['company_id' => 1, 'category_id' => 1, 'name' => 'Detergente Neutro', 'description' => 'Detergente para limpeza geral.', 'measuring_unit' => 'L'],
            ['company_id' => 1, 'category_id' => 1, 'name' => 'Água Sanitária', 'description' => 'Água sanitária para limpeza pesada.', 'measuring_unit' => 'L'],
            ['company_id' => 1, 'category_id' => 1, 'name' => 'Desinfetante Floral', 'description' => 'Desinfetante com fragrância floral.', 'measuring_unit' => 'L'],
            ['company_id' => 1, 'category_id' => 1, 'name' => 'Sabão em Pó', 'description' => 'Sabão em pó para roupas.', 'measuring_unit' => 'kg'],
            ['company_id' => 1, 'category_id' => 1, 'name' => 'Amaciante de Roupas', 'description' => 'Amaciante para roupas delicadas.', 'measuring_unit' => 'L'],

            // Produtos da categoria 'Inventário Empresa' (category_id = 2)
            ['company_id' => 1, 'category_id' => 2, 'name' => 'Cadeiras de Escritório', 'description' => 'Cadeiras ergonômicas para escritório.', 'measuring_unit' => 'unidade'],
            ['company_id' => 1, 'category_id' => 2, 'name' => 'Mesas de Reunião', 'description' => 'Mesas grandes para reuniões.', 'measuring_unit' => 'unidade'],
            ['company_id' => 1, 'category_id' => 2, 'name' => 'Armários Arquivadores', 'description' => 'Armários para arquivamento de documentos.', 'measuring_unit' => 'unidade'],
            ['company_id' => 1, 'category_id' => 2, 'name' => 'Projetor de Mídia', 'description' => 'Projetor para apresentações multimídia.', 'measuring_unit' => 'unidade'],
            ['company_id' => 1, 'category_id' => 2, 'name' => 'Luminárias de Mesa', 'description' => 'Luminárias de mesa para leitura.', 'measuring_unit' => 'unidade'],

            // Produtos da categoria 'Equipamentos' (category_id = 3)
            ['company_id' => 1, 'category_id' => 3, 'name' => 'Notebook Dell XPS', 'description' => 'Notebook para uso empresarial.', 'measuring_unit' => 'unidade'],
            ['company_id' => 1, 'category_id' => 3, 'name' => 'Impressora Multifuncional', 'description' => 'Impressora, scanner e copiadora.', 'measuring_unit' => 'unidade'],
            ['company_id' => 1, 'category_id' => 3, 'name' => 'Monitores de 24"', 'description' => 'Monitores para estações de trabalho.', 'measuring_unit' => 'unidade'],
            ['company_id' => 1, 'category_id' => 3, 'name' => 'Teclados Mecânicos', 'description' => 'Teclados mecânicos para maior durabilidade.', 'measuring_unit' => 'unidade'],
            ['company_id' => 1, 'category_id' => 3, 'name' => 'Mouses sem Fio', 'description' => 'Mouses sem fio ergonômicos.', 'measuring_unit' => 'unidade'],

            // Produtos da categoria 'Medicamentos e Utensílios' (category_id = 4)
            ['company_id' => 1, 'category_id' => 4, 'name' => 'Paracetamol 500mg', 'description' => 'Medicamento para alívio de dores e febre.', 'measuring_unit' => 'mg'],
            ['company_id' => 1, 'category_id' => 4, 'name' => 'Ibuprofeno 400mg', 'description' => 'Anti-inflamatório e analgésico.', 'measuring_unit' => 'mg'],
            ['company_id' => 1, 'category_id' => 4, 'name' => 'Álcool em Gel', 'description' => 'Álcool em gel 70% para desinfecção.', 'measuring_unit' => 'ml'],
            ['company_id' => 1, 'category_id' => 4, 'name' => 'Curativos Adesivos', 'description' => 'Curativos para pequenos cortes.', 'measuring_unit' => 'unidade'],
            ['company_id' => 1, 'category_id' => 4, 'name' => 'Termômetro Digital', 'description' => 'Termômetro digital de precisão.', 'measuring_unit' => 'unidade'],
        ];

        // Inserir produtos no banco de dados e gerar estoques fictícios e pedidos
        foreach ($products as $productData) {
            $product = Product::create($productData);

            // Criar um pedido para justificar o estoque
            $order = Order::create([
                'company_id' => $product->company_id,
                'order_number' => 'ORD-' . strtoupper(uniqid()),
                'order_date' => Carbon::now()->subDays(rand(1, 30)),
                'supplier' => rand(1, 5), // Fornecedor fictício
                'total_amount' => rand(100, 10000) / 10, // Valor total fictício
                'notes' => 'Pedido gerado automaticamente para justificar estoque',
                'delivery_date' => Carbon::now(),
            ]);

            // Criar itens do pedido para o produto
            $quantity = rand(10, 500); // Quantidade aleatória entre 10 e 500
            $unit_price = rand(1, 1000) / 10; // Preço unitário aleatório entre R$0,10 e R$100,00
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $product->id,
                'quantity' => $quantity,
                'unit_price' => $unit_price,
                'total_price' => $quantity * $unit_price,
            ]);

            // Criar estoque fictício para o produto
            Stock::create([
                'company_id' => $product->company_id,
                'product_id' => $product->id,
                'quantity' => $quantity,
                'entry_date' => Carbon::now()->subDays(rand(1, 30)),
                'expiration_date' => in_array($product->category_id, [1, 4]) ? Carbon::now()->addMonths(rand(6, 12)) : null, // Data de validade para produtos perecíveis
                'location' => 'Depósito ' . chr(rand(65, 67)), // Localização aleatória 'Depósito A', 'B' ou 'C'
                'cost_price' => $unit_price, // Usar o preço de custo do pedido
            ]);
        }
    }
}
