<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transaction_categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->onDelete('cascade'); // Chave estrangeira para empresa
            $table->foreignId('payment_method_fees_id')->nullable()->constrained('payment_method_fees')->onDelete('cascade'); // Chave estrangeira para empresa

            $table->string('name'); // Nome da categoria
            $table->enum('type', ['income', 'expense']); // Tipo da categoria
            $table->foreignId('parent_id')->nullable()->constrained('transaction_categories')->onDelete('cascade'); // Autorreferência para categoria pai

            $table->timestamps();
        });
        
        
    }

    public function down(): void
    {
        Schema::dropIfExists('transaction_categories');
    }
};
