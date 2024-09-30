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
            $table->unsignedBigInteger('company_id'); // Chave estrangeira para empresa
            $table->unsignedBigInteger('product_id'); // Chave estrangeira para empresa

            $table->decimal('quantity', 10, 2)->default(0)->comment('Quantidade disponível no estoque');
            $table->date('entry_date')->comment('Data de entrada no estoque');
            $table->date('expiration_date')->nullable()->comment('Data de validade (se aplicável)');
            $table->string('location')->nullable()->comment('Localização do estoque, como um depósito ou loja específica');
            $table->decimal('cost_price', 10, 2)->nullable()->comment('Preço de custo do produto para controle interno');
            $table->timestamps();

            // Foreign keys
            $table->foreign('company_id')->references('id')->on('companies')->onDelete('cascade');
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');

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
