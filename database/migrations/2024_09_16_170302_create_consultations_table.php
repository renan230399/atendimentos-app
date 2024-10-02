<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateConsultationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('consultations', function (Blueprint $table) {
            $table->id();

            // Foreign key for the company
            $table->unsignedBigInteger('company_id'); // Renamed from empresa_id to company_id
            $table->foreign('company_id')->references('id')->on('companies')->onDelete('cascade');

            // Foreign key for the patient
            $table->unsignedBigInteger('patient_id'); // Renamed from pacient_id to patient_id
            $table->foreign('patient_id')->references('id')->on('patients')->onDelete('cascade');

            // Consultation information
            $table->date('date');              // Consultation date (renamed from data)
            $table->time('start_time');        // Consultation start time (renamed from hora_inicio)
            $table->time('end_time');          // Consultation end time (renamed from hora_fim)
            $table->string('professional');    // Professional responsible for the consultation
            $table->text('notes')->nullable(); // Consultation notes (renamed from observacoes)
            $table->integer('price')->comment('Preço em centavos');

            $table->enum('status', ['pending', 'completed', 'cancelled'])->default('pending'); // Consultation status (renamed values)

            // Control columns
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
        Schema::dropIfExists('consultations');
    }
}
