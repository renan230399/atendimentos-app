<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Limpa todas as tabelas do banco de dados
        $tables = Schema::getConnection()->getSchemaBuilder()->getAllTables();
        
        foreach ($tables as $table) {
            DB::table($table)->truncate(); // Limpa cada tabela
        }

        // Chama os seeders de usuário, paciente e formulário de anamnese
        $this->call([
            UserSeeder::class,
            PatientSeeder::class, // Adiciona o PatientSeeder aqui
            FormFieldSeeder::class, // Adiciona o FormFieldSeeder aqui
            CategoryProductSeeder::class,
            SupplierSeeder::class,
            StockLocalSeeder::class,
            //ProductSeeder::class,
            TransactionCategorySeeder::class,
            AccountSeeder::class,
            ConsultationSeeder::class,
            PaymentMethodSeeder::class,
        ]);
    }
}
