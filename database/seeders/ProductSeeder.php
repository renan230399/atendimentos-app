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
            ['company_id' => 1, 'category_id' => 1, 'name' => 'Sabonete Líquido', 'description' => 'Sabonete líquido para higiene pessoal.', 'measuring_unit' => 'volume', 'quantities_per_unit' => 500, 'measuring_unit_of_unit' => 'ml','status' => true],
            ['company_id' => 1, 'category_id' => 1, 'name' => 'Detergente Neutro', 'description' => 'Detergente para limpeza geral.', 'measuring_unit' => 'volume', 'quantities_per_unit' => 2, 'measuring_unit_of_unit' => 'L','status' => true],
            ['company_id' => 1, 'category_id' => 1, 'name' => 'Água Sanitária', 'description' => 'Água sanitária para limpeza pesada.', 'measuring_unit' => 'volume', 'quantities_per_unit' => 1, 'measuring_unit_of_unit' => 'L','status' => true],
            // Corrigido para usar um valor inteiro
            ['company_id' => 1, 'category_id' => 1, 'name' => 'Desinfetante Floral', 'description' => 'Desinfetante com fragrância floral.', 'measuring_unit' => 'volume', 'quantities_per_unit' => 1, 'measuring_unit_of_unit' => 'L','status' => true],
            ['company_id' => 1, 'category_id' => 1, 'name' => 'Sabão em Pó', 'description' => 'Sabão em pó para roupas.', 'measuring_unit' => 'peso', 'quantities_per_unit' => 2, 'measuring_unit_of_unit' => 'kg','status' => true],
            ['company_id' => 1, 'category_id' => 1, 'name' => 'Amaciante de Roupas', 'description' => 'Amaciante para roupas delicadas.', 'measuring_unit' => 'volume', 'quantities_per_unit' => 3, 'measuring_unit_of_unit' => 'L','status' => true],
        
            // Produtos da categoria 'Inventário Empresa' (category_id = 2)
            ['company_id' => 1, 'category_id' => 2, 'name' => 'Cadeiras de Escritório', 'description' => 'Cadeiras ergonômicas para escritório.', 'measuring_unit' => 'unidade', 'quantities_per_unit' => 1, 'measuring_unit_of_unit' => 'unidade','status' => true],
            ['company_id' => 1, 'category_id' => 2, 'name' => 'Mesas de Reunião', 'description' => 'Mesas grandes para reuniões.', 'measuring_unit' => 'unidade', 'quantities_per_unit' => 1, 'measuring_unit_of_unit' => 'unidade','status' => true],
            ['company_id' => 1, 'category_id' => 2, 'name' => 'Armários Arquivadores', 'description' => 'Armários para arquivamento de documentos.', 'measuring_unit' => 'unidade', 'quantities_per_unit' => 1, 'measuring_unit_of_unit' => 'unidade','status' => true],
        
            // Produtos da categoria 'Equipamentos' (category_id = 3)
            ['company_id' => 1, 'category_id' => 3, 'name' => 'Notebook Dell XPS', 'description' => 'Notebook para uso empresarial.', 'measuring_unit' => 'unidade', 'quantities_per_unit' => 1, 'measuring_unit_of_unit' => 'unidade','status' => true],
            ['company_id' => 1, 'category_id' => 3, 'name' => 'Impressora Multifuncional', 'description' => 'Impressora, scanner e copiadora.', 'measuring_unit' => 'unidade', 'quantities_per_unit' => 1, 'measuring_unit_of_unit' => 'unidade','status' => true],
        
            // Produtos da categoria 'Medicamentos e Utensílios' (category_id = 4)
            ['company_id' => 1, 'category_id' => 4, 'name' => 'Paracetamol 500mg', 'description' => 'Medicamento para alívio de dores e febre.', 'measuring_unit' => 'peso', 'quantities_per_unit' => 500, 'measuring_unit_of_unit' => 'mg','status' => true],
            ['company_id' => 1, 'category_id' => 4, 'name' => 'Ibuprofeno 400mg', 'description' => 'Anti-inflamatório e analgésico.', 'measuring_unit' => 'peso', 'quantities_per_unit' => 400, 'measuring_unit_of_unit' => 'mg','status' => true],
            ['company_id' => 1, 'category_id' => 4, 'name' => 'Álcool em Gel', 'description' => 'Álcool em gel 70% para desinfecção.', 'measuring_unit' => 'volume', 'quantities_per_unit' => 200, 'measuring_unit_of_unit' => 'ml','status' => true],
        ];
        
        

        // Inserir produtos no banco de dados e gerar estoques fictícios e pedidos
        foreach ($products as $productData) {
            $product = Product::create($productData);

            // Criar um pedido para justificar o estoque
            $order = Order::create([
                'company_id' => $product->company_id,
                'order_date' => Carbon::now()->subDays(rand(1, 30)),
                'supplier_id' => 1, // Fornecedor fictício
                'total_amount' => rand(100, 10000000), // Valor total fictício
                'notes' => 'Pedido gerado automaticamente para justificar estoque',
                'delivery_date' => Carbon::now(),
                'delivery_status' => false, // Inicializando com status de não entregue
                'file' => null, // Inicialmente sem arquivo associado
            ]);
            

            // Criar itens do pedido para o produto
            $quantity = rand(10, 500); // Quantidade aleatória entre 10 e 500
            $unit_price = rand(1, 100000); // Preço unitário aleatório entre R$0,10 e R$100,00
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
                'cost_price' => $unit_price, // Usar o preço de custo do pedido
                'status' =>true,
            ]);
        }
    }
}
