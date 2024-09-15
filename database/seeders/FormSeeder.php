<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Form;
use App\Models\FormField;

class FormSeeder extends Seeder
{
    public function run()
    {
        // Cria 5 formulários com campos relacionados
        Form::factory(5)
            ->create()
            ->each(function ($form) {
                // Para cada formulário, cria entre 3 e 6 campos
                FormField::factory(rand(3, 6))->create([
                    'form_id' => $form->id,
                ]);
            });
    }
}
