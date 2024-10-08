<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFormResponseDetailsTable extends Migration
{
    public function up()
    {
        Schema::create('form_response_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('form_response_id')->constrained('form_responses')->onDelete('cascade'); // Referência à resposta do formulário
            $table->foreignId('form_field_id')->constrained('form_fields')->onDelete('cascade'); // Referência ao campo do formulário
            $table->text('response'); // Resposta do campo
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('form_response_details');
    }
}

