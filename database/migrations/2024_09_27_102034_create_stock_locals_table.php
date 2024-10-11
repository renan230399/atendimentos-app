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
        Schema::create('stock_locals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->nullable()->constrained('companies')->onDelete('cascade'); // Autorreferência para categoria pai
            $table->foreignId('parent_id')->nullable()->constrained('stock_locals')->onDelete('cascade'); // Autorreferência para categoria pai
            $table->string('name'); // Conta associada
            $table->string('description')->nullable(); // Conta associada
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_locals');
    }
};
