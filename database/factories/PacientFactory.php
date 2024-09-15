<?php

namespace Database\Factories;

use App\Models\Pacient;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class PacientFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Pacient::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        // Pacientes fictícios específicos
        $pacientesFicticios = [
            [
                'nome_paciente' => 'Ana Souza',
                'telefone' => '(11) 98765-4321',
                'data_nascimento' => '1980-02-15',
                'bairro' => 'Centro',
                'rua' => 'Rua das Flores',
                'numero' => '123',
                'complemento' => 'Apto 101',
                'cidade' => 'São Paulo',
                'estado' => 'SP',
                'cpf' => '123.456.789-01',
                'responsaveis' => json_encode([
                    ['nome' => 'Maria Souza', 'relacao' => 'Mãe', 'telefone' => '(11) 99876-5432'],
                ]),
                'observacoes' => 'Paciente com histórico de asma.',
                'foto_perfil' => null,
                'status' => true,
            ],
            [
                'nome_paciente' => 'João Lima',
                'telefone' => '(21) 91234-5678',
                'data_nascimento' => '1975-06-30',
                'bairro' => 'Copacabana',
                'rua' => 'Avenida Atlântica',
                'numero' => '1500',
                'complemento' => 'Cobertura 02',
                'cidade' => 'Rio de Janeiro',
                'estado' => 'RJ',
                'cpf' => '987.654.321-00',
                'responsaveis' => json_encode([
                    ['nome' => 'Pedro Lima', 'relacao' => 'Filho', 'telefone' => '(21) 97654-3210'],
                ]),
                'observacoes' => 'Paciente com pressão alta.',
                'foto_perfil' => null,
                'status' => true,
            ],
        ];

        // Seleciona um paciente fictício aleatório
        $pacienteFicticio = $this->faker->randomElement($pacientesFicticios);

        return array_merge($pacienteFicticio, [
            'user_id' => \App\Models\User::factory(), // Associação com um usuário fictício
        ]);
    }
}
