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
            $table->string('name'); // Nome da categoria
            $table->enum('type', ['income', 'expense']); // Tipo da categoria
            $table->unsignedBigInteger('empresa_id'); // Chave estrangeira para empresa
            $table->timestamps();

            // Foreign key for empresa
            $table->foreign('empresa_id')->references('id')->on('empresas')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
