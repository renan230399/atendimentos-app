<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Pacient;

class PacientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Cria 10 pacientes fictícios
        Pacient::factory(10)->create();
    }
}
