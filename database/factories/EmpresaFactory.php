<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Empresa>
 */
class EmpresaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nome_empresa' => $this->faker->company,  // Nome da empresa gerado pelo faker
            'logo_empresa' => $this->faker->imageUrl(200, 200, 'business', true, 'logo'),  // URL fictícia de logo
        ];
    }
}
