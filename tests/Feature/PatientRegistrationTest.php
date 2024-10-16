<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User; // Certifique-se de importar o modelo User
use App\Models\Patient; // Certifique-se de importar o modelo Patient

class PatientRegistrationTest extends TestCase
{
    use RefreshDatabase; // Garante que o banco de dados seja limpo após cada teste

    public function test_successful_patient_registration()
    {
        // Cria um usuário fictício e simula que ele está autenticado
        $user = User::factory()->create(); 
        $this->actingAs($user);

        // Dados válidos para o cadastro
        $data = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'birthdate' => '2000-01-01',
            'profile_picture' => null // ou um caminho válido se necessário
        ];

        // Realiza a requisição POST para a rota de cadastro
        $response = $this->post('/patients', $data);

        // Verifica se a resposta é um redirecionamento para a página de sucesso
        $response->assertRedirect('/patients');

        // Verifica se o paciente foi realmente criado no banco de dados
        $this->assertDatabaseHas('patients', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
        ]);
    }

    public function test_patient_registration_fails_with_invalid_data()
    {
        // Cria um usuário fictício e simula que ele está autenticado
        $user = User::factory()->create(); 
        $this->actingAs($user);

        // Dados inválidos (por exemplo, email inválido)
        $data = [
            'name' => '',
            'email' => 'invalid-email',
            'birthdate' => 'not-a-date',
        ];

        // Realiza a requisição POST para a rota de cadastro
        $response = $this->post('/patients', $data);

        // Verifica se a resposta retorna um erro (por exemplo, status 422)
        $response->assertStatus(422); // Código de erro para validação

        // Verifica se as mensagens de erro estão corretas
        $response->assertSessionHasErrors(['name', 'email', 'birthdate']);
    }
}
