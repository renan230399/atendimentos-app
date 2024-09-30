<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Consultation;
use App\Models\Company;
use App\Models\Patient;
use Faker\Factory as Faker;

class ConsultationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker::create();

        // Supondo que você já tenha empresas e pacientes na sua base de dados
        $companies = Company::all(); // Buscar todas as empresas
        $patients = Patient::all(); // Buscar todos os pacientes

        foreach (range(1, 50) as $index) {
            Consultation::create([
                'company_id' => 1, // Seleciona uma empresa fixa ou aleatória
                'patient_id' => $patients->random()->id, // Seleciona um paciente aleatório
                'date' => $faker->dateTimeBetween('2024-07-01', '2024-12-31')->format('Y-m-d'), // Data entre 1º de julho e 31 de dezembro de 2024
                'start_time' => $faker->time(), // Hora de início aleatória
                'end_time' => $faker->time(), // Hora de fim aleatória
                'professional' => $faker->name(), // Nome de profissional fictício
                'notes' => $faker->sentence(), // Notas da consulta aleatórias
                'price' => '150.90',
                'status' => $faker->randomElement(['pending', 'completed', 'cancelled']), // Status aleatório
            ]);
        }
    }
}
