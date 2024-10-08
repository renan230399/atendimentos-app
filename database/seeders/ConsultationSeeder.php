<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Consultation;
use App\Models\Company;
use App\Models\Patient;
use App\Models\Transaction;
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

        foreach (range(1, 1000) as $index) {
            // Criar uma consulta
            $consultation = Consultation::create([
                'company_id' => 1, // Seleciona uma empresa fixa ou aleatória
                'patient_id' => $patients->random()->id, // Seleciona um paciente aleatório
                'date' => $faker->dateTimeBetween('2024-07-01', '2024-12-31')->format('Y-m-d'), // Data entre 1º de julho e 31 de dezembro de 2024
                'start_time' => $startTime = $faker->dateTimeBetween('07:00', '18:00')->format('H:i:s'), // Hora de início aleatória a partir das 7:00 AM
                'end_time' => \Carbon\Carbon::createFromFormat('H:i:s', $startTime)->addMinutes(rand(40, 60))->format('H:i:s'), // Adiciona de 40 a 60 minutos ao horário de início
                'professional' => $faker->name(), // Nome de profissional fictício
                'notes' => $faker->sentence(), // Notas da consulta aleatórias
                'price' => 15090, // Preço em centavos (R$ 150,90)
                'status' => $faker->randomElement(['pending', 'completed', 'cancelled']), // Status aleatório
            ]);
            

            // Criar uma transação associada à consulta
            Transaction::create([
                'account_id' => 2, // Exemplo de ID de conta (ajuste conforme necessário)
                'category_id' => 1, // Exemplo de ID de categoria (ajuste conforme necessário)
                'company_id' => $consultation->company_id, // Usar o mesmo company_id da consulta
                'type' => 'income', // Supondo que seja uma receita
                'amount' => $consultation->price, // Converte para reais
                'description' => "Receita de consulta para o paciente:", // Descrição com detalhes da consulta
                'transaction_date' => $consultation->date, // Usa a data da consulta como data da transação
                'status' => false, // Status da transação (por exemplo, pago)
                'related_id' => $consultation->id, // ID da consulta associada
                'related_type' => Consultation::class, // Tipo de entidade relacionada (Consulta)
            ]);
        }
    }
}
