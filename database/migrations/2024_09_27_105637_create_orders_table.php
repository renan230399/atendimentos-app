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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->onDelete('cascade'); // Chave estrangeira para companies
            $table->foreignId('supplier_id')->nullable()->constrained('suppliers')->onDelete('cascade'); // Chave estrangeira para suppliers

            $table->string('order_number')->unique()->comment('Número único do pedido');
            $table->date('order_date')->comment('Data do pedido');
            $table->decimal('total_amount', 10, 2)->default(0)->comment('Valor total do pedido');
            $table->text('notes')->nullable()->comment('Observações adicionais sobre o pedido');
            $table->date('delivery_date')->nullable()->comment('Data de entrega do pedido, se aplicável');

            $table->timestamps();


        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
