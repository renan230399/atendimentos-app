<?php

namespace Database\Factories;

use App\Models\FormField;
use Illuminate\Database\Eloquent\Factories\Factory;

class FormFieldFactory extends Factory
{
    protected $model = FormField::class;

    public function definition()
    {
        $types = ['text', 'number', 'email', 'textarea', 'select'];
        $options = ['Option 1', 'Option 2', 'Option 3'];

        return [
            'form_id' => \App\Models\Form::factory(),
            'label' => $this->faker->word,
            'type' => $this->faker->randomElement($types),
            'required' => $this->faker->boolean,
            'options' => json_encode($this->faker->randomElements($options, 2)),
            'order' => $this->faker->numberBetween(1, 10),
        ];
    }
}
