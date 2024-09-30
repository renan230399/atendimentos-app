<?php

namespace Database\Factories;

use App\Models\Form;
use Illuminate\Database\Eloquent\Factories\Factory;

class FormFactory extends Factory
{
    protected $model = Form::class;

    public function definition()
    {
        return [
            'company_id' => 1, // Associe ao ID de uma empresa
            'name' => 'Ficha de Anamnese - Histórico de Saúde',
            'description' => 'Formulário detalhado para coleta de informações sobre histórico de saúde do paciente',
            'active' => true, // Defina como ativo
        ];
    }
}
