<?php

namespace App\Http\Controllers;

use App\Models\TransactionCategory;
use Illuminate\Http\Request;

class TransactionCategoryController extends Controller
{
    /**
     * Display a listing of the transaction categories.
     */
    public function index()
    {
        $categories = TransactionCategory::where('empresa_id', auth()->user()->empresa_id)->get();
        return view('transaction_categories.index', ['categories' => $categories]);
    }

    /**
     * Show the form for creating a new category.
     */
    public function create()
    {
        return view('transaction_categories.create');
    }

    /**
     * Store a newly created category in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:income,expense',
        ]);

        $validatedData['empresa_id'] = auth()->user()->empresa_id;

        TransactionCategory::create($validatedData);

        return redirect()->route('transaction_categories.index')->with('success', 'Categoria criada com sucesso!');
    }

    /**
     * Display the specified category.
     */
    public function show(TransactionCategory $transactionCategory)
    {
        $this->authorize('view', $transactionCategory);
        return view('transaction_categories.show', compact('transactionCategory'));
    }

    /**
     * Show the form for editing the specified category.
     */
    public function edit(TransactionCategory $transactionCategory)
    {
        $this->authorize('update', $transactionCategory);
        return view('transaction_categories.edit', compact('transactionCategory'));
    }

    /**
     * Update the specified category in storage.
     */
    public function update(Request $request, TransactionCategory $transactionCategory)
    {
        $this->authorize('update', $transactionCategory);

        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:income,expense',
        ]);

        $transactionCategory->update($validatedData);

        return redirect()->route('transaction_categories.index')->with('success', 'Categoria atualizada com sucesso!');
    }

    /**
     * Remove the specified category from storage.
     */
    public function destroy(TransactionCategory $transactionCategory)
    {
        $this->authorize('delete', $transactionCategory);
        $transactionCategory->delete();

        return redirect()->route('transaction_categories.index')->with('success', 'Categoria removida com sucesso!');
    }
}
