<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transfers', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('from_account_id'); // Conta de origem
            $table->unsignedBigInteger('to_account_id'); // Conta de destino
            $table->unsignedBigInteger('empresa_id'); // Chave estrangeira para empresa
            $table->decimal('amount', 15, 2); // Valor transferido
            $table->date('transfer_date'); // Data da transferência
            $table->text('description')->nullable(); // Descrição adicional
            $table->timestamps();

            // Foreign keys
            $table->foreign('from_account_id')->references('id')->on('accounts')->onDelete('cascade');
            $table->foreign('to_account_id')->references('id')->on('accounts')->onDelete('cascade');
            $table->foreign('empresa_id')->references('id')->on('empresas')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transfers');
    }
};
