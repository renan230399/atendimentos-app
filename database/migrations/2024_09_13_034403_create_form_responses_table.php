<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFormResponsesTable extends Migration
{
    public function up()
    {
        Schema::create('form_responses', function (Blueprint $table) {
            $table->id();
            // Relaciona com a tabela 'forms' e define a deleção em cascata
            $table->foreignId('form_id')->constrained('forms')->onDelete('cascade');
            // Relaciona com a tabela 'companies'
            $table->foreignId('company_id')->constrained('companies')->onDelete('cascade');
            // Relaciona com a tabela 'patients'
            $table->foreignId('patient_id')->constrained('patients')->onDelete('cascade');
            $table->string('status')->default('incompleto'); // Status do preenchimento (ex: incomplete, completed)
            $table->timestamp('completed_at')->nullable(); // Data e hora de conclusão, se aplicável

            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('form_responses');
    }
}
