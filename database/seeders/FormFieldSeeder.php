<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Form;
use App\Models\FormField;

class FormFieldSeeder extends Seeder
{
    public function run()
    {
        // Cria o formulário principal de anamnese
        $form = Form::create([
            'company_id' => 1, // Associe a uma empresa (ajuste conforme necessário)
            'category' => 1,
            'name' => 'Histórico de Saúde',
            'description' => 'Formulário completo para coletar o histórico de saúde do paciente.',
            'active' => true,
            'icon' => 'https://keyar-atendimentos.s3.amazonaws.com/icones/historico_saude.png',
            'is_wizard' => true, // Definindo o formulário como um wizard
            'wizard_structure' => [
                0 => 'Histórico Clínico',
                1 => 'Cirurgias e Procedimentos',
                2 => 'Hábitos de Vida'
            ], // Estrutura do wizard com títulos das etapas
        ]);

        // Campos do formulário de anamnese, divididos em etapas (steps)
        $fields = [
            // Step 1: Histórico Clínico
            [
                'label' => 'Doenças Crônicas Diagnosticadas',
                'type' => 'checkbox_group',
                'options' => [
                    'Diabetes Mellitus',
                    'Hipertensão Arterial',
                    'Doença Cardíaca',
                    'Doença Respiratória',
                    'Doença Renal',
                    'Doença Hepática',
                    'Distúrbios Neurológicos',
                    'HIV / AIDS',
                    'Doenças Autoimunes',
                    'Distúrbios Endócrinos',
                    'Câncer',
                    'Outras',
                ],
                'required' => true,
                'order' => 1,
                'class' => 'md:w-[50%] w-[100%]', // Exemplo de classe CSS para ajustar layout
                'step' => 0,
            ],
            [
                'label' => 'Especifique o tipo de câncer',
                'type' => 'text',
                'required' => false,
                'order' => 2,
                'class' => '',
                'step' => 0,
            ],
            [
                'label' => 'Outras - Especifique',
                'type' => 'text',
                'required' => false,
                'order' => 3,
                'class' => '',
                'step' => 0,
            ],
            [
                'label' => 'Cirurgias Prévias',
                'type' => 'radio',
                'options' => ['Sim', 'Não'],
                'required' => true,
                'order' => 4,
                'class' => '',
                'step' => 0,
            ],
            [
                'label' => 'Se sim, descreva o tipo de cirurgia e o ano',
                'type' => 'textarea',
                'required' => false,
                'order' => 5,
                'class' => '',
                'step' => 0,
            ],
            [
                'label' => 'Internações Hospitalares Anteriores',
                'type' => 'radio',
                'options' => ['Sim', 'Não'],
                'required' => true,
                'order' => 6,
                'class' => '',
                'step' => 0,
            ],
            [
                'label' => 'Se sim, descreva o motivo e o ano',
                'type' => 'textarea',
                'required' => false,
                'order' => 7,
                'class' => '',
                'step' => 0,
            ],
            [
                'label' => 'Histórico Familiar: Doenças Diagnosticadas em Familiares',
                'type' => 'checkbox_group',
                'options' => [
                    'Doença Cardíaca',
                    'Hipertensão Arterial',
                    'Diabetes Mellitus',
                    'Doenças Respiratórias',
                    'Câncer',
                    'Doenças Neurológicas',
                    'Doenças Mentais',
                    'Outras',
                ],
                'required' => true,
                'order' => 8,
                'class' => 'col-span-2',
                'step' => 0,
            ],
            [
                'label' => 'Especifique o tipo de câncer familiar',
                'type' => 'text',
                'required' => false,
                'order' => 9,
                'class' => '',
                'step' => 0,
            ],
            [
                'label' => 'Outras - Especifique',
                'type' => 'text',
                'required' => false,
                'order' => 10,
                'class' => '',
                'step' => 0,
            ],

            // Step 2: Cirurgias e Procedimentos
            [
                'label' => 'Cirurgias Prévias (Se houver)',
                'type' => 'textarea',
                'required' => false,
                'order' => 11,
                'class' => '',
                'step' => 1,
            ],
            [
                'label' => 'Internações Hospitalares Anteriores',
                'type' => 'radio',
                'options' => ['Sim', 'Não'],
                'required' => true,
                'order' => 12,
                'class' => '',
                'step' => 1,
            ],
            [
                'label' => 'Se sim, descreva o motivo e o ano',
                'type' => 'textarea',
                'required' => false,
                'order' => 13,
                'class' => '',
                'step' => 1,
            ],

            // Step 3: Hábitos de Vida
            [
                'label' => 'Tabagismo',
                'type' => 'radio',
                'options' => ['Nunca fumou', 'Ex-fumante', 'Fumante'],
                'required' => true,
                'order' => 14,
                'class' => '',
                'step' => 2,
            ],
            [
                'label' => 'Se ex-fumante, há quanto tempo parou?',
                'type' => 'text',
                'required' => false,
                'order' => 15,
                'class' => '',
                'step' => 2,
            ],
            [
                'label' => 'Se fumante, quantos cigarros por dia?',
                'type' => 'text',
                'required' => false,
                'order' => 16,
                'class' => '',
                'step' => 2,
            ],
            [
                'label' => 'Consumo de Álcool',
                'type' => 'radio',
                'options' => ['Não bebe', 'Bebidas sociais', 'Bebe regularmente'],
                'required' => true,
                'order' => 17,
                'class' => '',
                'step' => 2,
            ],
            [
                'label' => 'Frequência do consumo de álcool',
                'type' => 'text',
                'required' => false,
                'order' => 18,
                'class' => '',
                'step' => 2,
            ],
            [
                'label' => 'Quantidade de álcool consumido',
                'type' => 'text',
                'required' => false,
                'order' => 19,
                'class' => '',
                'step' => 2,
            ],
            [
                'label' => 'Atividade Física',
                'type' => 'radio',
                'options' => [
                    'Sedentário',
                    'Atividade leve',
                    'Atividade moderada',
                    'Atividade intensa',
                ],
                'required' => true,
                'order' => 20,
                'class' => '',
                'step' => 2,
            ],
            [
                'label' => 'Uso de Drogas Ilícitas',
                'type' => 'radio',
                'options' => ['Nunca usou', 'Usou no passado', 'Usa atualmente'],
                'required' => true,
                'order' => 21,
                'class' => '',
                'step' => 2,
            ],
            [
                'label' => 'Frequência e tipo de droga',
                'type' => 'text',
                'required' => false,
                'order' => 22,
                'class' => '',
                'step' => 2,
            ],
        ];



        // Cria os campos no banco de dados
        foreach ($fields as $field) {
            FormField::create(array_merge($field, ['form_id' => $form->id]));
        }
        // Cria o formulário de hábitos
        $form_habitos = Form::create([
            'company_id' => 1, // Associe a uma empresa (ajuste conforme necessário)
            'category' => 1,
            'name' => 'Hábitos do paciente',
            'description' => 'Formulário completo para coletar os hábitos de vida do paciente.',
            'active' => true,
            'icon' => 'https://keyar-atendimentos.s3.amazonaws.com/icones/icone_habitos.png',
            'is_wizard' => true, // Definindo o formulário como um wizard
            'wizard_structure' => [
                0 => 'Hábitos Alimentares',
                1 => 'Hábitos sociais e Vícios',
                2 => 'Hábitos de atividade física',
                3 => 'Hábitos de atividade física',
            ], // Estrutura do wizard com títulos das etapas
        ]);

        // Campos para o formulário de Hábitos
$fields_habitos = [
    // Step 1: Hábitos Alimentares
    [
        'label' => 'Frequência de consumo de alimentos processados',
        'type' => 'radio',
        'options' => ['Nunca', 'Raramente', 'Frequentemente', 'Sempre'],
        'required' => true,
        'order' => 1,
        'class' => '',
        'step' => 0,
    ],
    [
        'label' => 'Consumo diário de frutas e vegetais',
        'type' => 'radio',
        'options' => ['Menos de 1 porção', '1-2 porções', '3-4 porções', 'Mais de 5 porções'],
        'required' => true,
        'order' => 2,
        'class' => '',
        'step' => 0,
    ],
    [
        'label' => 'Consumo de água diário (em litros)',
        'type' => 'radio',
        'options' => ['Menos de 1L', '1-2L', '2-3L', 'Mais de 3L'],
        'required' => true,
        'order' => 3,
        'class' => '',
        'step' => 0,
    ],
    [
        'label' => 'Alergias alimentares',
        'type' => 'checkbox_group',
        'options' => ['Glúten', 'Lactose', 'Nozes', 'Outras'],
        'required' => false,
        'order' => 4,
        'class' => 'md:w-[50%] w-[100%]',
        'step' => 0,
    ],
    [
        'label' => 'Se houver, especifique outras alergias alimentares',
        'type' => 'text',
        'required' => false,
        'order' => 5,
        'class' => '',
        'step' => 0,
    ],

    // Step 2: Hábitos sociais e Vícios
    [
        'label' => 'Consumo de bebidas alcoólicas',
        'type' => 'radio',
        'options' => ['Não consome', 'Socialmente', 'Frequentemente', 'Diariamente'],
        'required' => true,
        'order' => 6,
        'class' => '',
        'step' => 1,
    ],
    [
        'label' => 'Tabagismo',
        'type' => 'radio',
        'options' => ['Nunca fumou', 'Ex-fumante', 'Fumante'],
        'required' => true,
        'order' => 7,
        'class' => '',
        'step' => 1,
    ],
    [
        'label' => 'Se ex-fumante, há quanto tempo parou?',
        'type' => 'text',
        'required' => false,
        'order' => 8,
        'class' => '',
        'step' => 1,
    ],
    [
        'label' => 'Se fumante, quantos cigarros por dia?',
        'type' => 'text',
        'required' => false,
        'order' => 9,
        'class' => '',
        'step' => 1,
    ],
    [
        'label' => 'Uso de substâncias ilícitas',
        'type' => 'radio',
        'options' => ['Nunca', 'No passado', 'Atualmente'],
        'required' => true,
        'order' => 10,
        'class' => '',
        'step' => 1,
    ],
    [
        'label' => 'Frequência e tipo de substância utilizada',
        'type' => 'text',
        'required' => false,
        'order' => 11,
        'class' => '',
        'step' => 1,
    ],

    // Step 3: Hábitos de Atividade Física
    [
        'label' => 'Frequência de atividade física',
        'type' => 'radio',
        'options' => ['Nenhuma', '1-2 vezes por semana', '3-4 vezes por semana', 'Diariamente'],
        'required' => true,
        'order' => 12,
        'class' => '',
        'step' => 2,
    ],
    [
        'label' => 'Tipo de atividade física realizada',
        'type' => 'checkbox_group',
        'options' => ['Caminhada', 'Corrida', 'Musculação', 'Yoga', 'Outros'],
        'required' => false,
        'order' => 13,
        'class' => '',
        'step' => 2,
    ],
    [
        'label' => 'Se outros, especifique',
        'type' => 'text',
        'required' => false,
        'order' => 14,
        'class' => '',
        'step' => 2,
    ],
    [
        'label' => 'Tempo de prática por sessão (em minutos)',
        'type' => 'text',
        'required' => true,
        'order' => 15,
        'class' => '',
        'step' => 2,
    ],
    [
        'label' => 'Lesões ou limitações físicas',
        'type' => 'radio',
        'options' => ['Sim', 'Não'],
        'required' => true,
        'order' => 16,
        'class' => '',
        'step' => 3,
    ],
    [
        'label' => 'Se sim, especifique a lesão ou limitação',
        'type' => 'text',
        'required' => false,
        'order' => 17,
        'class' => '',
        'step' => 3,
    ],
];

// Adicionar os campos do formulário de Hábitos
foreach ($fields_habitos as $field) {
    FormField::create(array_merge($field, ['form_id' => $form_habitos->id]));
}
// Cria o formulário de exames
$form_exames = Form::create([
    'company_id' => 1, // Associe a uma empresa (ajuste conforme necessário)
    'category' => 1,
    'name' => 'Exames do paciente',
    'description' => 'Formulário completo para coletar exames importantes do paciente.',
    'active' => true,
    'icon' => 'https://keyar-atendimentos.s3.amazonaws.com/form_pictures/exames.png',
    'is_wizard' => false, // Definindo o formulário como um wizard
]);

// Campos para o formulário de Exames
$fields_exames = [
    [
        'label' => 'Nome do exame',
        'type' => 'text',
        'required' => true,
        'order' => 1,
        'class' => '',
        'step' => 0,
    ],
    [
        'label' => 'Tipo de exame',
        'type' => 'select_with_optgroup',
        'options' => [
            [
                'label' => 'Exames de Sangue',
                'options' => [
                    ['label' => 'Hemograma Completo', 'value' => 'hemograma_completo'],
                    ['label' => 'Glicemia de Jejum', 'value' => 'glicemia_jejum'],
                    ['label' => 'HIV', 'value' => 'hiv'],
                    ['label' => 'Colesterol Total', 'value' => 'colesterol_total'],
                    ['label' => 'Triglicérides', 'value' => 'triglicerides'],
                    ['label' => 'Creatinina', 'value' => 'creatinina'],
                    ['label' => 'TGO (Transaminase Glutâmica Oxalacética)', 'value' => 'tgo'],
                    ['label' => 'TGP (Transaminase Glutâmica Pirúvica)', 'value' => 'tgp'],
                    ['label' => 'TSH (Hormônio Estimulante da Tireoide)', 'value' => 'tsh'],
                    ['label' => 'T4 Livre', 'value' => 't4_livre'],
                    ['label' => 'PCR (Proteína C Reativa)', 'value' => 'pcr'],
                    ['label' => 'Ureia', 'value' => 'ureia'],
                    ['label' => 'Ácido Úrico', 'value' => 'acido_urico'],
                    ['label' => 'Exame de Função Renal', 'value' => 'funcao_renal'],
                    ['label' => 'Diabetes', 'value' => 'diabetes'],
                    ['label' => 'Sorologia para Hepatite', 'value' => 'hepatite'],
                ],
            ],
            [
                'label' => 'Exames de Urina e Fezes',
                'options' => [
                    ['label' => 'Exame de Urina', 'value' => 'exame_urina'],
                    ['label' => 'Exame de Fezes', 'value' => 'exame_fezes'],
                    ['label' => 'Exame de Sangue Oculto', 'value' => 'sangue_oculto'],
                ],
            ],
            [
                'label' => 'Exames de Imagem',
                'options' => [
                    ['label' => 'Exame de Raio-X', 'value' => 'raio_x'],
                    ['label' => 'Tomografia Computadorizada', 'value' => 'tomografia'],
                    ['label' => 'Ressonância Magnética', 'value' => 'ressonancia'],
                    ['label' => 'Ultrassonografia', 'value' => 'ultrassonografia'],
                    ['label' => 'Mamografia', 'value' => 'mamografia'],
                    ['label' => 'Densitometria Óssea', 'value' => 'densitometria_ossea'],
                    ['label' => 'Ecocardiograma', 'value' => 'ecocardiograma'],
                ],
            ],
            [
                'label' => 'Exames Cardiológicos',
                'options' => [
                    ['label' => 'Eletrocardiograma', 'value' => 'eletrocardiograma'],
                    ['label' => 'Teste de Esforço', 'value' => 'teste_esforco'],
                ],
            ],
            [
                'label' => 'Exames Ginecológicos',
                'options' => [
                    ['label' => 'Papanicolau', 'value' => 'papanicolau'],
                    ['label' => 'Biópsia', 'value' => 'biopsia'],
                ],
            ],
            [
                'label' => 'Outros Exames',
                'options' => [
                    ['label' => 'Teste de Intolerância à Lactose', 'value' => 'intolerancia_lactose'],
                    ['label' => 'Teste de Alergia', 'value' => 'teste_alergia'],
                ],
            ],
        ],
        'required' => true,
        'order' => 2,
        'class' => '',
        'step' => 0,
    ],    
    [
        'label' => 'Anexe o arquivo (se existir)',
        'type' => 'file',
        'required' => false,
        'order' => 3,
        'class' => '',
        'step' => 0,
    ],
    [
        'label' => 'Data do exame',
        'type' => 'date',
        'required' => false,
        'order' => 4,
        'class' => '',
        'step' => 0,
    ],
];

// Adicionar os campos do formulário de Exames
foreach ($fields_exames as $field) {
    FormField::create(array_merge($field, ['form_id' => $form_exames->id]));
}
// Cria o formulário de procedimentos
$form_procedimentos = Form::create([
    'company_id' => 1, // Associe a uma empresa (ajuste conforme necessário)
    'category' => 2,
    'name' => 'Procedimentos Executados',
    'description' => 'Formulário para armazenar informações sobre procedimentos realizados nos pacientes.',
    'active' => true,
    'icon' => 'https://keyar-atendimentos.s3.amazonaws.com/form_pictures/exames.png',
    'is_wizard' => false, // Definindo o formulário como um wizard
]);

// Campos para o formulário de Procedimentos
$fields_procedimentos = [
    [
        'label' => 'Nome do procedimento',
        'type' => 'text',
        'required' => true,
        'order' => 1,
        'class' => '',
        'step' => 0,
    ],
    [
        'label' => 'Data do procedimento',
        'type' => 'date',
        'required' => true,
        'order' => 2,
        'class' => '',
        'step' => 0,
    ],
    [
        'label' => 'Profissional responsável',
        'type' => 'text',
        'required' => true,
        'order' => 3,
        'class' => '',
        'step' => 0,
    ],
    [
        'label' => 'Observações',
        'type' => 'textarea',
        'required' => false,
        'order' => 4,
        'class' => '',
        'step' => 0,
    ],
    [
        'label' => 'Anexe o arquivo (se existir)',
        'type' => 'file',
        'required' => false,
        'order' => 5,
        'class' => '',
        'step' => 0,
    ],
    [
        'label' => 'Selecione a região do corpo',
        'type' => 'body_selector',
        'photo_select' => 'https://keyar-atendimentos.s3.amazonaws.com/form_pictures/body_human.png',
        'required' => false,
        'order' => 6,
        'class' => 'w-full',
        'step' => 0,
    ],
];

// Adicionar os campos do formulário de Procedimentos
foreach ($fields_procedimentos as $field) {
    FormField::create(array_merge($field, ['form_id' => $form_procedimentos->id]));
}

    }
}
