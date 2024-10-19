<?php

namespace App\Http\Controllers;

use App\Models\StockLocal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StockLocalController extends Controller
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

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {       
        // Obtém o ID da empresa associada ao usuário autenticado
        $companyId = auth()->user()->company_id;

        // Validação dos dados de entrada
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
            'parent_id' => 'nullable|exists:stock_locals,id', // 'nullable' pois o local pode não ter um pai
        ]);
    
        // Cria um novo registro de local de estoque
        $stockLocal = StockLocal::create([
            'company_id' => $companyId,
            'name' => $validatedData['name'],
            'description' => $validatedData['description'],
            'parent_id' => $validatedData['parent_id'] ?? null,
        ]);
    
        // Redireciona para a página de gerenciamento de estoque com uma mensagem de sucesso
        return redirect()->route('inventory.dashboard')->with('success', 'Local de estoque criado com sucesso!');
    }
    

    /**
     * Display the specified resource.
     */
    public function show(StockLocal $stockLocal)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(StockLocal $stockLocal)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        // Valida os dados recebidos para garantir que os campos 'editedStockLocals' sejam um array
        $validatedData = $request->validate([
            'editedStockLocals' => 'required|array',
            'editedStockLocals.*.name' => 'required|string|max:255', // Valida o campo 'name' de cada local
            'editedStockLocals.*.description' => 'nullable|string|max:255', // Valida o campo 'description' de cada local
            'editedStockLocals.*.parent_id' => 'nullable|integer|exists:stock_locals,id', // Valida o campo 'parent_id'
        ]);
    
        // Inicia uma transação para garantir a integridade dos dados
        DB::beginTransaction();
    
        try {
            // Loop para atualizar cada local de estoque individualmente
            foreach ($validatedData['editedStockLocals'] as $id => $data) {
                // Atualiza o local de estoque correspondente
                StockLocal::where('id', $id)->update([
                    'name' => $data['name'],
                    'description' => $data['description'],
                    'parent_id' => $data['parent_id'], // Atualiza o parent_id
                ]);
            }
    
            // Confirma a transação se todas as atualizações foram bem-sucedidas
            DB::commit();
    
            return redirect()->route('inventory.dashboard')->with('success', 'Locais de estoque atualizados com sucesso!');
        } catch (\Exception $e) {
            // Reverte a transação em caso de falha
            DB::rollBack();
            return redirect()->route('inventory.dashboard')->with('error', 'Ocorreu um erro ao atualizar os locais de estoque. Por favor, tente novamente.');
        }
    }
    
    

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        // Lógica para excluir o local de estoque
        $stockLocal = StockLocal::findOrFail($id);
        $stockLocal->delete();
    
        return response()->json(['message' => 'Local de estoque excluído com sucesso.']);
    }
    
}
