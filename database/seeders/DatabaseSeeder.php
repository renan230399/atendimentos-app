<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Chama os seeders de usuário, paciente e formulário de anamnese
        $this->call([
            UserSeeder::class,
            PatientSeeder::class, // Adiciona o PatientSeeder aqui
            FormFieldSeeder::class, // Adiciona o FormFieldSeeder aqui
            CategoryProductSeeder::class,
            ProductSeeder::class,
            ConsultationSeeder::class,
        ]);
    }
}
