<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('stocks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->nullable()->constrained('companies')->onDelete('cascade');// Chave estrangeira para empresa
            $table->foreignId('product_id')->nullable()->constrained('products')->onDelete('cascade'); // Chave estrangeira para produtos
            $table->foreignId('order_id')->nullable()->constrained('orders')->onDelete('cascade'); // Chave estrangeira para produtos
            $table->foreignId('order_item_id')->nullable()->constrained('order_items')->onDelete('cascade'); // Chave estrangeira para produtos

            $table->foreignId('local_id')->nullable()->constrained('stock_locals')->onDelete('cascade'); // Chave estrangeira para locais de estoque

            $table->decimal('quantity', 10, 3)->default(0)->comment('Quantidade disponível no estoque');
            $table->date('entry_date')->comment('Data de entrada no estoque');
            $table->date('expiration_date')->nullable()->comment('Data de validade (se aplicável)');
            $table->integer('cost_price')->nullable()->comment('Preço de custo do produto para controle interno');
            $table->timestamps();
            $table->boolean('status');


        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stocks');
    }
};
