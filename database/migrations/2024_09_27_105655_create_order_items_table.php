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
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade')->comment('Referência para o pedido');
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade')->comment('Referência para o produto');
            $table->integer('quantity')->comment('Quantidade do produto');
            $table->decimal('unit_price', 10, 2)->comment('Preço unitário do produto');
            $table->decimal('total_price', 10, 2)->comment('Preço total (quantidade * preço unitário)');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
