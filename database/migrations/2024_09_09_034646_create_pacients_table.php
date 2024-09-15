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
        Schema::create('pacients', function (Blueprint $table) {
            $table->id();
            
            // Campo user_id obrigatório (não nullable)
            $table->unsignedBigInteger('empresa_id')->index();

            // Informações do paciente
            $table->string('nome_paciente');
            $table->string('telefone')->nullable(); // Telefone do paciente

            // Informações de nascimento
            $table->date('data_nascimento'); // Data de nascimento do paciente
            
            // Informações de endereço
            $table->string('bairro')->nullable(); // Bairro
            $table->string('rua')->nullable(); // Rua
            $table->string('numero')->nullable(); // Número da residência
            $table->string('complemento')->nullable(); // Complemento (ex: apto, bloco)
            $table->string('cidade')->nullable(); // Cidade
            $table->string('estado')->nullable(); // Estado

            // Documentos
            $table->string('cpf')->nullable(); // CPF do paciente

            // Responsáveis - Armazena múltiplos responsáveis em formato JSON
            $table->jsonb('responsaveis')->nullable(); // Coluna JSON para múltiplos responsáveis

            // Outros campos
            $table->text('observacoes')->nullable(); // Campo para observações adicionais

            // Novo campo para foto de perfil
            $table->string('foto_perfil')->nullable(); // Caminho da foto de perfil do paciente

            $table->boolean('status')->default(true); // Ou false, dependendo do comportamento esperado

            // Chave estrangeira para a tabela users
            $table->foreign('empresa_id')->references('id')->on('empresas')->onDelete('cascade'); // Deleta o paciente se o usuário for excluído

            // Timestamps
            $table->timestamps(); // Criado em e Atualizado em
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pacients');
    }
};
