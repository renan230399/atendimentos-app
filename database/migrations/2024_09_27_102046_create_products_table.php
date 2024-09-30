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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('company_id'); // Chave estrangeira para empresa
            $table->unsignedBigInteger('category_id'); // Chave estrangeira para empresa

            $table->string('name'); // Nome do produto
            $table->string('description');//Descrição do produto
            $table->string('measuring_unit');//Unidade de medida do estoque do produto
            
            $table->timestamps();
            // Foreign keys
            $table->foreign('company_id')->references('id')->on('companies')->onDelete('cascade');
            $table->foreign('category_id')->references('id')->on('category_products')->onDelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
