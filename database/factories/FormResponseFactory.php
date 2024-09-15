<?php

namespace Database\Factories;

use App\Models\FormResponse;
use Illuminate\Database\Eloquent\Factories\Factory;

class FormResponseFactory extends Factory
{
    protected $model = FormResponse::class;

    public function definition()
    {
        return [
            'form_id' => \App\Models\Form::factory(),
            'responses' => json_encode([
                'field_1' => $this->faker->word,
                'field_2' => $this->faker->randomNumber(),
            ]),
        ];
    }
}
