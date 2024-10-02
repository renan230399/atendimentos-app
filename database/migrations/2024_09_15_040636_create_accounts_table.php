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
        Schema::create('accounts', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('company_id'); // Chave estrangeira para a tabela empresas
            $table->string('name'); // Nome da conta (ex: Caixa, Banco)
            $table->enum('type', ['bank', 'cash', 'investment']); // Tipo da conta
            $table->integer('balance')->default(0)->comment('Valor da transação');

            $table->timestamps();

            // Define a chave estrangeira que referencia a tabela de empresas
            $table->foreign('company_id')->references('id')->on('companies')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('accounts');
    }
};
