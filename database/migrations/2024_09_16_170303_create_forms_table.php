<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFormsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('forms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->nullable()->constrained('companies')->onDelete('cascade'); // Chave estrangeira para produtos

            $table->integer('category')->nullable();
            $table->string('name'); // Nome do formulário
            $table->text('description')->nullable(); // Descrição do formulário
            $table->boolean('active')->default(true); // Status do formulário (ativo ou não)
            $table->string('icon')->nullable();
            $table->boolean('is_wizard')->default(false); // Define se o formulário é um wizard
            $table->json('wizard_structure')->nullable(); 
            $table->timestamps(); // Colunas created_at e updated_at

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('forms');
    }
}
