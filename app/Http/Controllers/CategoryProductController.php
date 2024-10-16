<?php

namespace App\Http\Controllers;

use App\Models\CategoryProduct;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
class CategoryProductController extends Controller
{
    /**
     * Display a listing of the category products.
     */
    public function index()
    {
        $categories = CategoryProduct::with('company')->get();
        return view('categories.index', compact('categories'));
    }
    /**
     * Store a newly created category product in storage.
     */
    public function store(Request $request)
    {
        // Obtém o ID da empresa associada ao usuário autenticado
        $companyId = auth()->user()->company_id;
        // Validação dos dados de entrada
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'parent_id' => 'required|exists:category_products,id',
        ]);
       // Cria um novo registro de fornecedor
        $category = CategoryProduct::create([
            'company_id' => $companyId,
            'name' => $validatedData['name'],
            'parent_id' => $validatedData['parent_id'] ?? null,
        ]);
        return redirect()->route('inventory.dashboard')->with('success', 'Categoria criada com sucesso!');
    }

    /**
     * Show the form for editing the specified category product.
     */
    public function edit(CategoryProduct $category)
    {
        return view('categories.edit', compact('category'));
    }

 /**
     * Atualiza várias categorias de uma vez.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request)
    {
        // Valida os dados recebidos para garantir que o campo 'editedCategories' seja um array
        $validatedData = $request->validate([
            'editedCategories' => 'required|array',
            'editedCategories.*.name' => 'required|string|max:255', // Valida o nome de cada categoria
            'editedCategories.*.parent_id' => 'nullable|integer', // Valida o parent_id (pode ser nulo)
        ]);
    
        // Usar uma transação para garantir a integridade dos dados
        DB::beginTransaction();
    
        try {
            // Loop para atualizar cada categoria individualmente
            foreach ($validatedData['editedCategories'] as $id => $categoryData) {
                // Atualiza a categoria correspondente
                CategoryProduct::where('id', $id)->update([
                    'name' => $categoryData['name'],
                    'parent_id' => $categoryData['parent_id'], // Atualiza também o parent_id
                ]);
            }
    
            // Confirma a transação se todas as atualizações forem bem-sucedidas
            DB::commit();
            return redirect()->route('inventory.dashboard')->with('success', 'Categorias atualizadas com sucesso.');
        } catch (\Exception $e) {
            // Reverte a transação em caso de falha
            DB::rollBack();
            return redirect()->route('inventory.dashboard')->with('error', 'Erro ao atualizar as categorias.');
        }
    }
    
    

    /**
     * Remove the specified category product from storage.
     */
    public function destroy(CategoryProduct $category)
    {
        $category->delete();

        return redirect()->route('categories.index')->with('success', 'Category deleted successfully');
    }
}
