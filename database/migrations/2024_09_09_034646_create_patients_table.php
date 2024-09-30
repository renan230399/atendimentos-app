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
        Schema::create('patients', function (Blueprint $table) {
            $table->id();
            
            // Foreign key to the companies table (empresa_id)
            $table->unsignedBigInteger('company_id')->index();

            // Patient information
            $table->string('patient_name');
            $table->string('phone')->nullable(); // Patient's phone

            // Birth information
            $table->date('birth_date'); // Patient's birth date
            
            // Address information
            $table->string('neighborhood')->nullable(); // Neighborhood
            $table->string('street')->nullable(); // Street
            $table->string('house_number')->nullable(); // House number
            $table->string('address_complement')->nullable(); // Complement (e.g., apt, block)
            $table->string('city')->nullable(); // City
            $table->string('state')->nullable(); // State

            // Documents
            $table->string('cpf')->nullable(); // Patient's CPF

            // Contacts - Stores multiple responsible persons in JSON format
            $table->jsonb('contacts')->nullable(); // JSON column for multiple contacts

            // Main complaints - Stores multiple complaints in JSON format
            $table->jsonb('complaints')->nullable(); // JSON column for multiple complaints
            
            // Other fields
            $table->text('notes')->nullable(); // Field for additional notes

            // Profile picture field
            $table->string('profile_picture')->nullable(); // Path to the patient's profile picture

            $table->boolean('status')->default(true); // Or false, depending on the expected behavior

            // Foreign key constraint
            $table->foreign('company_id')->references('id')->on('companies')->onDelete('cascade'); // Deletes patient if the company is deleted

            // Timestamps
            $table->timestamps(); // Created at and Updated at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patients');
    }
};
