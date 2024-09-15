<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cash_flows', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('account_id'); // Conta associada
            $table->unsignedBigInteger('transaction_id'); // Transação associada
            $table->unsignedBigInteger('empresa_id'); // Chave estrangeira para empresa
            $table->decimal('balance_before', 15, 2); // Saldo antes da transação
            $table->decimal('balance_after', 15, 2); // Saldo depois da transação
            $table->timestamps();

            // Foreign keys
            $table->foreign('account_id')->references('id')->on('accounts')->onDelete('cascade');
            $table->foreign('transaction_id')->references('id')->on('transactions')->onDelete('cascade');
            $table->foreign('empresa_id')->references('id')->on('empresas')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cash_flows');
    }
};
