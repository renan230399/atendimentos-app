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
        Schema::create('files', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id'); // ID do usuário que enviou o arquivo
            $table->unsignedBigInteger('form_response_detail_id'); // ID do detalhe da resposta do formulário
            $table->string('filename'); // Nome original do arquivo
            $table->string('path'); // Caminho no S3 ou URL do arquivo
            $table->string('type'); // Tipo MIME do arquivo
            $table->unsignedBigInteger('size'); // Tamanho do arquivo em bytes
            $table->timestamps(); // Datas de criação e atualização
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('form_response_detail_id')->references('id')->on('form_response_details')->onDelete('cascade');
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('files');
    }
};
