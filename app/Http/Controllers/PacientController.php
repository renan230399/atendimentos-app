<?php

namespace App\Http\Controllers;

use App\Models\Pacient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PacientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user()->load('empresa');
        $empresaId = $user->empresa->id; // Obtém o ID da empresa do usuário autenticado

        // Obtém o termo de busca, se houver
        $search = $request->input('search');
    
        // Busca pacientes pela empresa do usuário autenticado e pelo nome, insensível a maiúsculas/minúsculas
        $pacients = Pacient::query()
            ->where('empresa_id', $empresaId)
            ->when($search, function ($query, $search) {
                return $query->whereRaw("unaccent(nome_paciente) ILIKE unaccent(?)", ['%' . $search . '%']);
            })
            ->get();
    
        // Retorna a página com os pacientes filtrados e o termo de busca
        return Inertia::render('Pacients', [
            'pacients' => $pacients,
            'auth' => [
                'user' => $user, // Envia o usuário com a empresa para o frontend
            ],
            'search' => $search,
        ]);
    }
    

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Exibe o formulário de criação (não implementado)
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'nome_paciente' => 'required|string|max:255',
            'telefone' => 'nullable|string|max:20',
            'data_nascimento' => 'required|date',
            'bairro' => 'nullable|string|max:100',
            'rua' => 'nullable|string|max:200',
            'numero' => 'nullable|string|max:10',
            'complemento' => 'nullable|string|max:50',
            'cidade' => 'nullable|string|max:100',
            'estado' => 'nullable|string|max:100',
            'cep' => 'nullable|string|max:10',
            'cpf' => 'nullable|string|max:14',
            'rg' => 'nullable|string|max:12',
            'responsaveis' => 'nullable|array',
            'observacoes' => 'nullable|string',
            'foto_perfil' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'status' => 'nullable|boolean', // Valida o campo status
        ]);
    
        // Define o status padrão caso não seja fornecido
        $validatedData['status'] = $validatedData['status'] ?? true; // ou false dependendo do esperado
    
        // O restante do código continua o mesmo
        $validatedData['empresa_id'] = $request->user()->empresa->id;
    
        if ($request->hasFile('foto_perfil')) {
            $path = $request->file('foto_perfil')->store('fotos_pacientes', 's3');
            $validatedData['foto_perfil'] = Storage::disk('s3')->url($path);
        }
    
        $validatedData['responsaveis'] = $validatedData['responsaveis'] ?? json_encode([]);
    
        Pacient::create($validatedData);
    
        return redirect()->route('pacients')->with('success', 'Paciente cadastrado com sucesso!');
    }
    

    /**
     * Display the specified resource.
     */
    public function show(Pacient $pacient)
    {
        // Exibe os detalhes do paciente (não implementado)
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Pacient $pacient)
    {
        // Exibe o formulário de edição (não implementado)
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Pacient $pacient)
    {
        // Atualiza os dados do paciente (não implementado)
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Pacient $pacient)
    {
        // Remove o paciente (não implementado)
    }
}
