<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('account_id'); // Conta associada
            $table->unsignedBigInteger('category_id'); // Categoria da transação
            $table->unsignedBigInteger('company_id'); // Chave estrangeira para empresa
            $table->enum('type', ['income', 'expense', 'transfer']); // Tipo da transação
            $table->decimal('amount', 15, 2); // Valor da transação
            $table->text('description')->nullable(); // Descrição adicional
            $table->date('transaction_date'); // Data da transação
            $table->timestamps();

            // Foreign keys
            $table->foreign('account_id')->references('id')->on('accounts')->onDelete('cascade');
            $table->foreign('category_id')->references('id')->on('transaction_categories')->onDelete('cascade');
            $table->foreign('company_id')->references('id')->on('companies')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
