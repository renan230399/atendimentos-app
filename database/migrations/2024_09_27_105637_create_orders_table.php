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
            $table->unsignedBigInteger('company_id'); // Chave estrangeira para empresa

            $table->string('order_number')->unique()->comment('Número único do pedido');
            $table->date('order_date')->comment('Data do pedido');
            $table->integer('supplier')->nullable()->comment('Fornecedor responsável pelo pedido');
            $table->decimal('total_amount', 10, 2)->default(0)->comment('Valor total do pedido');
            $table->text('notes')->nullable()->comment('Observações adicionais sobre o pedido');
            $table->date('delivery_date')->nullable()->comment('Data de entrega do pedido, se aplicável');

            $table->timestamps();

            $table->foreign('company_id')->references('id')->on('companies')->onDelete('cascade');

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
