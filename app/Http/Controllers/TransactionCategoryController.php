<?php

namespace App\Http\Controllers;

use App\Models\TransactionCategory;

use Illuminate\Http\Request;
use Inertia\Inertia;

class TransactionCategoryController extends Controller
{
    /**
     * Display a listing of the transaction categories.
     */
    public function index()
    {
        // Obtém as categorias de transação da empresa do usuário autenticado
        $categories = TransactionCategory::where('company_id', auth()->user()->company_id)->get();

        // Retorna o componente React via Inertia
        return Inertia::render('TransactionCategories/Index', [
            'categories' => $categories
        ]);
    }

    /**
     * Show the form for creating a new category.
     */
    public function create()
    {
        // Renderiza a página de criação da categoria via Inertia
        return Inertia::render('TransactionCategories/Create');
    }

    /**
     * Store a newly created category in storage.
     */
    public function store(Request $request)
    {
        \Log::info('Dados recebidos no backend: ', $request->all());  // Para depuração

        // Valida os dados recebidos do formulário
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:income,expense',
        ]);

        // Adiciona o ID da empresa do usuário autenticado
        $validatedData['company_id'] = auth()->user()->company_id;

        // Cria a nova categoria de transação
        TransactionCategory::create($validatedData);

        // Redireciona para a listagem de categorias com uma mensagem de sucesso
        return redirect()->route('financial.dashboard')->with('success', 'Categoria criada com sucesso!');
    }

    /**
     * Display the specified category.
     */
    public function show(TransactionCategory $transactionCategory)
    {
        // Autoriza a visualização da categoria e renderiza via Inertia
        $this->authorize('view', $transactionCategory);
        return Inertia::render('TransactionCategories/Show', compact('transactionCategory'));
    }

    /**
     * Show the form for editing the specified category.
     */
    public function edit(TransactionCategory $transactionCategory)
    {
        // Autoriza a edição da categoria e renderiza via Inertia
        $this->authorize('update', $transactionCategory);
        return Inertia::render('TransactionCategories/Edit', compact('transactionCategory'));
    }

    /**
     * Update the specified category in storage.
     */
    public function update(Request $request, TransactionCategory $transactionCategory)
    {
        // Autoriza a atualização da categoria
        $this->authorize('update', $transactionCategory);

        // Valida os dados recebidos do formulário
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:income,expense',
        ]);

        // Atualiza a categoria de transação
        $transactionCategory->update($validatedData);

        // Redireciona para a listagem de categorias com uma mensagem de sucesso
        return redirect()->route('transaction_categories.index')->with('success', 'Categoria atualizada com sucesso!');
    }

    /**
     * Remove the specified category from storage.
     */
    public function destroy(TransactionCategory $transactionCategory)
    {
        // Autoriza a exclusão da categoria
        $this->authorize('delete', $transactionCategory);

        // Exclui a categoria
        $transactionCategory->delete();

        // Redireciona para a listagem de categorias com uma mensagem de sucesso
        return redirect()->route('transaction_categories.index')->with('success', 'Categoria removida com sucesso!');
    }
}
