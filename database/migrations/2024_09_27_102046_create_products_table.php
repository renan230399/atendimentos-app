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
            $table->string('name'); // Nome do produto
            $table->string('description');//Descrição do produto
            $table->string('measuring_unit');//Unidade de medida do estoque do produto
            $table->string('photo')->nullable();
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
