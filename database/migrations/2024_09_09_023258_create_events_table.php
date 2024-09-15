<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEventsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('categoria_id')->index();
            $table->string('title');
            $table->text('descricao')->nullable();
            $table->integer('status');
            $table->timestamp('start'); // Usar timestamp para facilitar com o big-calendar
            $table->timestamp('end')->nullable();
            $table->unsignedBigInteger('user_id')->nullable(); // Adiciona a coluna user_id

            // Definir as chaves estrangeiras corretamente
            $table->foreign('categoria_id')->references('id')->on('events_categories')->onDelete('cascade'); // Supondo que categoria_id se refere a uma tabela 'categorias'
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade'); // Chave estrangeira para a tabela users

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
        Schema::table('events', function (Blueprint $table) {
            // Remover todas as chaves estrangeiras antes de remover a tabela
            if (Schema::hasColumn('events', 'categoria_id')) {
                $table->dropForeign(['categoria_id']);
            }
            if (Schema::hasColumn('events', 'user_id')) {
                $table->dropForeign(['user_id']);
            }
        });
    
        // Agora é seguro remover a tabela
        Schema::dropIfExists('events');
    }
    
}
