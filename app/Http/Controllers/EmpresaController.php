<?php

namespace App\Http\Controllers;

use App\Models\Empresa;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class EmpresaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $empresas = Empresa::all();

        return Inertia::render('Empresas/Index', [
            'empresas' => $empresas,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Empresas/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Valida os dados enviados
        $validatedData = $request->validate([
            'nome_empresa' => 'required|string|max:255',
            'logo_empresa' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Validação da imagem do logo
        ]);

        // Verifica se foi enviado um logotipo
        if ($request->hasFile('logo_empresa')) {
            // Faz o upload do logotipo para o S3
            $path = $request->file('logo_empresa')->store('logos_empresas', 's3');
            
            // Armazena o caminho completo do logo no banco de dados
            $validatedData['logo_empresa'] = Storage::disk('s3')->url($path);
        }

        // Cria a empresa com os dados validados
        Empresa::create($validatedData);

        return redirect()->route('empresas.index')->with('success', 'Empresa cadastrada com sucesso!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Empresa $empresa)
    {
        return Inertia::render('Empresas/Show', [
            'empresa' => $empresa,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Empresa $empresa)
    {
        return Inertia::render('Empresas/Edit', [
            'empresa' => $empresa,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Empresa $empresa)
    {
        // Valida os dados enviados
        $validatedData = $request->validate([
            'nome_empresa' => 'required|string|max:255',
            'logo_empresa' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Verifica se foi enviado um novo logotipo
        if ($request->hasFile('logo_empresa')) {
            // Exclui o logotipo antigo se houver
            if ($empresa->logo_empresa) {
                $oldPath = str_replace(Storage::disk('s3')->url(''), '', $empresa->logo_empresa);
                Storage::disk('s3')->delete($oldPath);
            }

            // Faz o upload do novo logotipo
            $path = $request->file('logo_empresa')->store('logos_empresas', 's3');
            $validatedData['logo_empresa'] = Storage::disk('s3')->url($path);
        }

        // Atualiza a empresa com os novos dados
        $empresa->update($validatedData);

        return redirect()->route('empresas.index')->with('success', 'Empresa atualizada com sucesso!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Empresa $empresa)
    {
        // Remove o logotipo do S3 se existir
        if ($empresa->logo_empresa) {
            $path = str_replace(Storage::disk('s3')->url(''), '', $empresa->logo_empresa);
            Storage::disk('s3')->delete($path);
        }

        // Exclui a empresa
        $empresa->delete();

        return redirect()->route('empresas.index')->with('success', 'Empresa excluída com sucesso!');
    }

    /**
     * Display a list of employees for the authenticated user's company.
     */
public function employeesIndex(Request $request)
{
    $empresa = $request->user()->empresa;
    $employees = $empresa ? $empresa->users : [];

    return Inertia::render('Empresas/Employees', [
        'employees' => $employees,
        'auth' => [
            'user' => $request->user(),
        ],
    ]);
}

    

    /**
     * Add a new employee to the authenticated user's company.
     */
    public function addEmployee(Request $request)
    {
        // Obtenha a empresa a partir do usuário autenticado
        $empresa = $request->user()->empresa;

        // Valida os dados do funcionário
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'cargo' => 'required|integer', // Supondo que o campo 'cargo' seja um número
        ]);

        // Cria o funcionário associado à empresa
        $empresa->users()->create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'password' => Hash::make($validatedData['password']),
            'cargo' => $validatedData['cargo'], // Adiciona o cargo do funcionário
        ]);

        return redirect()->route('employees.index')->with('success', 'Funcionário adicionado com sucesso!');
    }

    /**
     * Remove the specified employee from the authenticated user's company.
     */
    public function removeEmployee(User $employee, Request $request)
    {
        // Obtenha a empresa a partir do usuário autenticado
        $empresa = $request->user()->empresa;

        // Certifique-se de que o funcionário pertence à mesma empresa
        if ($employee->empresa_id !== $empresa->id) {
            return redirect()->route('employees.index')->with('error', 'Funcionário não pertence à sua empresa.');
        }

        $employee->delete(); // Remove o funcionário

        return redirect()->route('employees.index')->with('success', 'Funcionário removido com sucesso!');
    }
}
