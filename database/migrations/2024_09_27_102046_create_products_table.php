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
            $table->foreignId('company_id')->nullable()->constrained('companies')->onDelete('cascade'); // Autorreferência para categoria pai
            $table->foreignId('category_id')->nullable()->constrained('category_products')->onDelete('cascade'); // Autorreferência para categoria pai
            $table->string('name')->index(); // Nome do produto
            $table->string('description')->nullable();//Descrição do produto
            $table->enum('measuring_unit', ['unidade', 'peso', 'volume'])->nullable(); // Tipo da transação
            $table->integer('quantities_per_unit')->nullable();;//Unidade de medida do estoque do produto
            $table->string('measuring_unit_of_unit')->nullable();; // Tipo da transação
            $table->boolean('status')->index();
            $table->timestamps();
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
