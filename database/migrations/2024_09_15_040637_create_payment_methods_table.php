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
        Schema::create('payment_methods', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->onDelete('cascade'); // Chave estrangeira para empresa
            $table->foreignId('account_id')->constrained('accounts')->onDelete('cascade'); // Chave estrangeira para empresa
            $table->string('name'); // Nome do método de pagamento (ex: Cartão de Crédito, Dinheiro, Transferência Bancária)
            $table->string('type'); // Tipo do método de pagamento (ex: Dinheiro, Cartão de Crédito, Cartão de Débito, Boleto)

            $table->timestamps();
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_methods');
    }
};
