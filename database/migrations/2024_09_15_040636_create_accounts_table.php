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
            $table->unsignedBigInteger('empresa_id'); // Chave estrangeira para a tabela empresas
            $table->string('name'); // Nome da conta (ex: Caixa, Banco)
            $table->enum('type', ['bank', 'cash', 'investment']); // Tipo da conta
            $table->decimal('balance', 15, 2)->default(0); // Saldo inicial da conta
            $table->timestamps();

            // Define a chave estrangeira que referencia a tabela de empresas
            $table->foreign('empresa_id')->references('id')->on('empresas')->onDelete('cascade');
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
