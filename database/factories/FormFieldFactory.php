<?php

namespace Database\Factories;

use App\Models\FormField;
use Illuminate\Database\Eloquent\Factories\Factory;

class FormFieldFactory extends Factory
{
    protected $model = FormField::class;

    public function definition()
    {
        return [
            'form_id' => 1, // Associe ao ID do formulário de anamnese
            'label' => '', // O label será preenchido no seeder
            'type' => '',  // O tipo também será preenchido no seeder
            'required' => true, // Defina se o campo é obrigatório
            'options' => null,  // As opções serão preenchidas no seeder, para campos como checkbox ou radio
            'class' => '', // Adiciona a classe, que também será preenchida no seeder ou manualmente
            'order' => 0, // Defina a ordem no seeder
        ];
    }
}
