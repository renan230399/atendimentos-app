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
        Schema::create('stock_movimentations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('stock_id'); // Chave estrangeira para a tabela de estoque
            $table->unsignedBigInteger('company_id'); // Chave estrangeira para empresa
            $table->unsignedBigInteger('product_id'); // Chave estrangeira para o produto
            $table->string('name')->comment('Nome descritivo da movimentação');

            $table->enum('movement_type', ['entrada', 'saida', 'ajuste'])->comment('Tipo de movimentação: entrada, saída ou ajuste');
            $table->decimal('quantity', 10, 3)->comment('Quantidade movimentada');
            $table->date('movement_date')->comment('Data da movimentação');
            $table->text('notes')->nullable()->comment('Notas ou observações sobre a movimentação');
            $table->timestamps();

            // Foreign keys
            $table->foreign('stock_id')->references('id')->on('stocks')->onDelete('cascade');
            $table->foreign('company_id')->references('id')->on('companies')->onDelete('cascade');
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_movimentations');
    }
};
