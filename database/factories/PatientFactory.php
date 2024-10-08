<?php

namespace Database\Factories;

use App\Models\Patient;
use Illuminate\Database\Eloquent\Factories\Factory;

class PatientFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Patient::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        // Specific fictional patients
        $fictionalPatients = [
            [
                'patient_name' => 'Kelly Braga Ferreira',
                'phone' => '5535999923631',
                'birth_date' => '2003-07-01',
                'neighborhood' => 'Centro',
                'street' => 'Rua das Flores',
                'house_number' => '123',
                'address_complement' => 'Apto 101',
                'city' => 'São Paulo',
                'state' => 'SP',
                'cpf' => '123.456.789-01',
                'contacts' => json_encode([
                    ['name' => 'Rosely', 'relation' => 'Mãe', 'phone' => '5535999923631'],
                ]),
                'notes' => 'PAciente de teste',
                'profile_picture' => 'https://keyar-atendimentos.s3.amazonaws.com/patient_photos/mlAbH5Wsog0z8wsSDOTUHmU9sdM0RDJbty28kxkj.png',
                'status' => true,
            ],
            [
                'patient_name' => 'Renan',
                'phone' => '(21) 91234-5678',
                'birth_date' => '1975-06-30',
                'neighborhood' => 'Copacabana',
                'street' => 'Avenida Atlântica',
                'house_number' => '1500',
                'address_complement' => 'Penthouse 02',
                'city' => 'Rio de Janeiro',
                'state' => 'RJ',
                'cpf' => '987.654.321-00',
                'contacts' => json_encode([
                    ['name' => 'Pedro Lima', 'relation' => 'Son', 'phone' => '(21) 97654-3210'],
                ]),
                'notes' => 'Patient has high blood pressure.',
                'profile_picture' => null,
                'status' => true,
            ],
        ];

        // Select a random fictional patient
        $fictionalPatient = $this->faker->randomElement($fictionalPatients);

        return array_merge($fictionalPatient, [
            'company_id' => 1, // Association with a fake company
        ]);
    }
}
