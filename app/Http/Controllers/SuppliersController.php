<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use Illuminate\Http\Request;

class SuppliersController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }


    
    public function store(Request $request)
    {
        // Validação dos dados de entrada
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'nullable|string|max:255',
            'contacts' => 'nullable|array',
            'contacts.*.type' => 'nullable|string|max:255',
            'contacts.*.value' => 'nullable|string|max:255',
            'contacts.*.category' => 'nullable|string|in:phone,link,string',
            'address' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:2',
            'notes' => 'nullable|string',
            'status' => 'required|boolean',
        ]);
    
        // Obtém o ID da empresa associada ao usuário autenticado
        $companyId = auth()->user()->company_id;
    
        // Cria um novo registro de fornecedor
        $supplier = Supplier::create([
            'company_id' => $companyId,
            'name' => $validatedData['name'],
            'category' => $validatedData['category'] ?? null,
            'contacts' => $validatedData['contacts'] ?? [],
            'address' => $validatedData['address'] ?? null,
            'state' => $validatedData['state'] ?? null,
            'notes' => $validatedData['notes'] ?? null,
            'status' => $validatedData['status'],
        ]);
    
        return redirect()->route('inventory.dashboard')->with('success', 'Conta criada com sucesso!');


    }
    

    /**
     * Display the specified resource.
     */
    public function show(Suppliers $suppliers)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Suppliers $suppliers)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        // Validação dos dados de entrada
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'nullable|string|max:255',
            'contacts' => 'nullable|array',
            'contacts.*.type' => 'nullable|string|max:255',
            'contacts.*.value' => 'nullable|string|max:255',
            'contacts.*.category' => 'nullable|string|in:phone,link,string',
            'address' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:2',
            'notes' => 'nullable|string',
            'status' => 'required|boolean',
        ]);
    
        // Obtém o fornecedor existente pelo ID
        $supplier = Supplier::findOrFail($id);
    
        // Verifica se o fornecedor pertence à mesma empresa do usuário autenticado
        if ($supplier->company_id !== auth()->user()->company_id) {
            return redirect()->route('inventory.dashboard')->with('error', 'Você não tem permissão para atualizar este fornecedor.');
        }
    
        // Atualiza o registro de fornecedor
        $supplier->update([
            'name' => $validatedData['name'],
            'category' => $validatedData['category'] ?? null,
            'contacts' => $validatedData['contacts'] ?? [],
            'address' => $validatedData['address'] ?? null,
            'state' => $validatedData['state'] ?? null,
            'notes' => $validatedData['notes'] ?? null,
            'status' => $validatedData['status'],
        ]);
    
        // Redireciona com mensagem de sucesso
        return redirect()->route('inventory.dashboard')->with('success', 'Fornecedor atualizado com sucesso!');
    }
    

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Suppliers $suppliers)
    {
        //
    }
}
