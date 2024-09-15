<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFormFieldsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('form_fields', function (Blueprint $table) {
            $table->id();
            $table->foreignId('form_id')->constrained()->onDelete('cascade'); // Relacionamento com a tabela forms
            $table->string('label'); // Rótulo do campo (ex.: Nome, Email, etc.)
            $table->string('type'); // Tipo do campo (ex.: text, email, number, etc.)
            $table->boolean('required')->default(false); // Se o campo é obrigatório ou não
            $table->json('options')->nullable(); // Opções adicionais (por exemplo, para campos select ou radio)
            $table->integer('order')->default(0); // Ordem do campo no formulário
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('form_fields');
    }
}
