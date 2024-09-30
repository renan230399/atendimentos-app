<?php

namespace App\Http\Controllers;

use App\Models\Form;
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
            'fields' => 'required|array', // Verifica se o campo fields é um array
            'fields.*.label' => 'required|string', // Cada campo deve ter um label
            'fields.*.type' => 'required|string', // Cada campo deve ter um tipo
            'fields.*.required' => 'required|boolean', // Cada campo deve ter um campo "required"
        ]);

        // Cria o formulário
        $form = Form::create([
            'name' => $data['name'],
            'description' => $data['description'],
            'fields' => json_encode($data['fields']), // Armazena os campos como JSON
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

    /**
     * Atualiza um formulário existente no banco de dados.
     */
    public function update(Request $request, Form $form)
    {
        
        // Valida os dados recebidos
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'fields' => 'required|array', // Verifica se o campo fields é um array
            'fields.*.label' => 'required|string', // Cada campo deve ter um label
            'fields.*.type' => 'required|string', // Cada campo deve ter um tipo
            'fields.*.required' => 'required|boolean', // Cada campo deve ter um campo "required"
        ]);

        // Atualiza o formulário existente
        $form->update([
            'name' => $data['name'],
            'description' => $data['description'],
            'fields' => json_encode($data['fields']), // Armazena os campos como JSON
        ]);

        // Redireciona para a página de listagem com uma mensagem de sucesso
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
