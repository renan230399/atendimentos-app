<?php

namespace App\Http\Controllers;

use App\Models\Form;
use App\Models\FormField;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;

class FormController extends Controller
{
    /**
     * Exibe a listagem de formulários.
     */
    public function index(Request $request)
    {
        $user = $request->user()->load('company');

        // Busca todos os formulários e carrega os campos relacionados (form_fields)
        $forms = Form::with('fields')->get();

        // Renderiza a página de listagem com Inertia, passando os formulários com seus campos
        return Inertia::render('Forms/Index', [
            'forms' => $forms,
            'auth' => [
                'user' => $user, // Envia o usuário com a empresa para o frontend
            ],
        ]);
    }
    public function getFields($formId)
    {
        $form = Form::with('fields')->findOrFail($formId);
    
        return response()->json([
            'form' => $form,
            'fields' => $form->fields,
        ]);
    }
    
    /**
     * Exibe o formulário para criar um novo.
     */
    public function create()
    {
        // Renderiza a página de criação do formulário com Inertia
        return Inertia::render('Forms/Create');
    }

    /**
     * Armazena um novo formulário no banco de dados.
     */
    public function store(Request $request)
    {
        // Valida os dados recebidos
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'icon' => 'nullable|file|mimes:jpeg,png,jpg,gif,svg|max:2048', // Valida o ícone como um arquivo de imagem
        ]);
        
        $user = $request->user()->load('company');
        
        // Adiciona o company_id baseado na empresa do usuário autenticado
        $data['company_id'] = $user->company->id;
    
        // Verifica se um arquivo foi enviado e o armazena no S3
        if ($request->hasFile('icon')) {
            $path = $request->file('icon')->store('form_icons', 's3'); // Armazena na pasta 'form_icons' no S3
            $data['icon'] = Storage::disk('s3')->url($path); // Armazena a URL do ícone no array $data
        }
    
        // Cria o formulário
        $form = Form::create([
            'company_id' => $data['company_id'],
            'name' => $data['name'],
            'description' => $data['description'],
            'icon' => $data['icon'] ?? null, // Armazena a URL do ícone se existir
        ]);
    
        // Redireciona para a página de listagem com uma mensagem de sucesso
        return Redirect::route('forms.index')->with('success', 'Formulário criado com sucesso!');
    }
    
    

    /**
     * Exibe um formulário específico.
     */
    public function show(Form $form)
    {
        // Renderiza a página de exibição de um formulário específico com Inertia
        return Inertia::render('Forms/Show', [
            'form' => $form,
        ]);
    }

    /**
     * Exibe o formulário para editar um formulário existente.
     */
    public function edit(Form $form)
    {
        // Renderiza a página de edição do formulário com Inertia
        return Inertia::render('Forms/Edit', [
            'form' => $form,
        ]);
    }


    
    public function update(Request $request, Form $form)
    {
        //dd($request->all()); // Verifica se o ID do formulário está correto

        // Valida os dados recebidos
        $data = $request->validate([
            'id' => 'required|integer',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'icon' => 'nullable|string',
            'fields' => 'required|array',
            'fields.*.label' => 'required|string',
            'fields.*.type' => 'required|string',
            'fields.*.required' => 'required|boolean',
            'fields.*.options' => 'nullable|array',
            'fields.*.order' => 'required|integer',
            'fields.*.step' => 'required|integer',
        ]);
        // Encontre o formulário pelo ID
        $form = Form::findOrFail($data['id']);
        // Atualiza os dados da tabela forms
        $form->update([
            'name' => $data['name'],
            'description' => $data['description'],
            'icon' => $data['icon'],
        ]);

        // Rastrear os IDs de campos existentes
        $existingFieldIds = [];
    
        foreach ($data['fields'] as $fieldData) {
            if (isset($fieldData['id'])) {
                // Atualiza o campo existente
                $formField = FormField::find($fieldData['id']);
                if ($formField) {
                    $formField->update([
                        'form_id' => $form->id, // Certifique-se de que form_id seja garantido
                        'label' => $fieldData['label'],
                        'label_view' => $fieldData['label_view'] ?? null,
                        'photo_select' => $fieldData['photo_select'] ?? null,
                        'default_value' => $fieldData['default_value'] ?? null,
                        'type' => $fieldData['type'],
                        'required' => $fieldData['required'],
                        'options' => isset($fieldData['options']) ? json_encode($fieldData['options']) : null,
                        'class' => $fieldData['class'] ?? null,
                        'order' => $fieldData['order'],
                        'step' => $fieldData['step'],
                    ]);
                    $existingFieldIds[] = $formField->id;
                }
            } else {
                // Cria um novo campo
                $newField = FormField::create([
                    'form_id' => $form->id, // Sempre use o form_id do $form atual
                    'label' => $fieldData['label'],
                    'label_view' => $fieldData['label_view'] ?? null,
                    'photo_select' => $fieldData['photo_select'] ?? null,
                    'default_value' => $fieldData['default_value'] ?? null,
                    'type' => $fieldData['type'],
                    'required' => $fieldData['required'],
                    'options' => isset($fieldData['options']) ? json_encode($fieldData['options']) : null,
                    'class' => $fieldData['class'] ?? null,
                    'order' => $fieldData['order'],
                    'step' => $fieldData['step'],
                ]);
                $existingFieldIds[] = $newField->id;
            }
        }
    
        // Remove campos que não estão presentes mais
        FormField::where('form_id', $form->id)
            ->whereNotIn('id', $existingFieldIds)
            ->delete();
    
        // Redireciona com sucesso
        return Redirect::route('forms.index')->with('success', 'Formulário atualizado com sucesso!');
    }
    
    
    
    

    /**
     * Remove um formulário do banco de dados.
     */
    public function destroy(Form $form)
    {
        // Deleta o formulário
        $form->delete();

        // Redireciona para a página de listagem com uma mensagem de sucesso
        return Redirect::route('forms.index')->with('success', 'Formulário excluído com sucesso!');
    }
}
