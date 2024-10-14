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
        Schema::create('payment_method_fees', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('payment_method_id'); // Referência ao método de pagamento
            $table->integer('installments'); // Número de parcelas
            $table->decimal('fixed_fee', 10, 2)->default(0); // Taxa fixa por transação
            $table->decimal('percentage_fee', 5, 2)->default(0); // Taxa percentual aplicada ao valor da transação
            $table->boolean('status')->default(1); // status do método de pagamento

            $table->timestamps();
        
            // Chave estrangeira para o método de pagamento
            $table->foreign('payment_method_id')->references('id')->on('payment_methods')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_method_fees');
    }
};
