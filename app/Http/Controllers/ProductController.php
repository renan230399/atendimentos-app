<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Display a listing of the products.
     */
    public function index()
    {
        $products = Product::with('company')->get();
        return view('products.index', compact('products'));
    }

    /**
     * Show the form for creating a new product.
     */
    public function create()
    {
        return view('products.create');
    }

    /**
     * Store a newly created product in storage.
     */
    public function store(Request $request)
    {
        // Validação dos dados recebidos
        $validatedData = $request->validate([
            'category_id' => 'nullable|exists:category_products,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'measuring_unit' => 'nullable|in:unidade,peso,volume',
            'quantities_per_unit' => 'nullable|integer',
            'measuring_unit_of_unit' => 'nullable|string|max:50',
            'status' => 'required|boolean',
            'photo' => 'nullable|json',
        ]);
        // Obtém o ID da empresa associada ao usuário autenticado
        $companyId = auth()->user()->company_id;

       // Cria um novo registro de fornecedor
       $supplier = Product::create([
        'company_id' => $companyId,
        'category_id' => $validatedData['category_id'],
        'name' => $validatedData['name'] ?? null,
        'description' => $validatedData['description'] ?? null,
        'measuring_unit' => $validatedData['address'] ?? null,
        'quantities_per_unit' => $validatedData['state'] ?? null,
        'measuring_unit_of_unit' => $validatedData['notes'] ?? null,
        'status' => $validatedData['status'],
        'photo' => $validatedData['photo'] ?? null,

    ]);



        return redirect()->route('inventory.dashboard')->with('success', 'Produto cadastrado com sucesso!');
    }

    /**
     * Update the specified product in storage.
     */
    public function update(Request $request, Product $product)
    {
        //dd($request);
        // Validação dos dados recebidos
        $validatedData = $request->validate([
            'category_id' => 'nullable|exists:category_products,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'measuring_unit' => 'nullable|in:unidade,peso,volume',
            'quantities_per_unit' => 'nullable|integer',
            'measuring_unit_of_unit' => 'nullable|string|max:50',
            'status' => 'required|boolean',
            'photo' => 'nullable|json',
        ]);
    
        // Obtém o ID da empresa associada ao usuário autenticado
        $companyId = auth()->user()->company_id;
    
        // Atualização do produto com os dados validados
        $product->update([
            'category_id' => $validatedData['category_id'] ?? null,
            'name' => $validatedData['name'],
            'description' => $validatedData['description'] ?? null,
            'measuring_unit' => $validatedData['measuring_unit'] ?? null,
            'quantities_per_unit' => $validatedData['quantities_per_unit'] ?? null,
            'measuring_unit_of_unit' => $validatedData['measuring_unit_of_unit'] ?? null,
            'status' => $validatedData['status'],
            'photo' => $validatedData['photo'] ?? null,
        ]);
    
        return redirect()->route('inventory.dashboard')->with('success', 'Produto atualizado com sucesso!');
    }
    

    /**
     * Show the form for editing the specified product.
     */
    public function edit(Product $product)
    {
        return view('products.edit', compact('product'));
    }



    /**
     * Remove the specified product from storage.
     */
    public function destroy(Product $product)
    {
        $product->delete();

        return redirect()->route('products.index')->with('success', 'Product deleted successfully');
    }
}
