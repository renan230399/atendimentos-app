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
        $fictionalPatients = [
            [
                'patient_name' => 'Kelly Braga Ferreira',
                'birth_date' => '2003-07-01',
                'neighborhood' => 'Centro',
                'street' => 'Rua das Flores',
                'house_number' => '123',
                'address_complement' => 'Apto 101',
                'city' => 'São Paulo',
                'state' => 'SP',
                'cpf' => '123.456.789-01',
                'personal_contacts' => [ // Sem json_encode, fornecemos diretamente o array

                        [
                            'type' => 1,
                            'value' => '35999923631',
                            'category' => 'phone',
                        ],
                        [
                            'type' => 1,
                            'value' => 'https://www.instagram.com/',
                            'category' => 'link',
                        ],
                        [
                            'type' => 2,
                            'value' => 'https://www.facebook.com/',
                            'category' => 'link',
                        ],

                ],
                'contacts' => [ // Sem json_encode, fornecemos diretamente o array
                    [
                        'name' => 'Rosely',
                        'relation' => 'Mãe',
                        'contacts' => [
                            [
                                'type' => 1,
                                'value' => '35999923631',
                                'category' => 'phone',
                            ],
                            [
                                'type' => 1,
                                'value' => 'https://www.instagram.com/',
                                'category' => 'link',
                            ],
                        ],
                    ],
                ],
                'notes' => 'Paciente de teste',
                'profile_picture' => 'https://keyar-atendimentos.s3.amazonaws.com/patient_photos/GjJLGhThB8j6vhRQu2elg1YOk7BiA8FKV3F2odnr.png',
                'status' => true,
            ],
        
            [
                'patient_name' => 'Renan',
                'birth_date' => '1975-06-30',
                'neighborhood' => 'Copacabana',
                'street' => 'Avenida Atlântica',
                'house_number' => '1500',
                'address_complement' => 'Penthouse 02',
                'city' => 'Rio de Janeiro',
                'state' => 'RJ',
                'cpf' => '987.654.321-00',
                'notes' => 'Patient has high blood pressure.',
                'profile_picture' => null,
                'status' => true,
            ],
        ];
        
        // Seleciona um paciente fictício aleatório
        $fictionalPatient = $this->faker->randomElement($fictionalPatients);
        
        return array_merge($fictionalPatient, [
            'company_id' => 1, // Associação com uma empresa fictícia
        ]);
    }
}
