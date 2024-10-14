<?php

namespace App\Http\Controllers;

use App\Models\CategoryProduct;
use App\Models\Product;
use App\Models\Stock;
use App\Models\Supplier;

use App\Models\StockLocal;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InventoryController extends Controller
{
    /**
     * Exibe o dashboard de inventário com as categorias de produtos, produtos e estoque.
     */
    public function inventoryDashboard(Request $request)
    {
        // Obtenha o ID da empresa do usuário autenticado
        $companyId = auth()->user()->company_id;
        $user = $request->user()->load('company');
    
        // Busque as categorias de produtos e informações de estoque relacionados com os produtos
        $categories = CategoryProduct::where('company_id', $companyId)->get();
        $products = Product::where('company_id', $companyId)
            ->with('stocks') // Apenas carrega os estoques relacionados com os produtos, sem carregar as categorias
            ->get();
        $suppliers = Supplier::where('company_id', $companyId)->get();
        $stockLocals = StockLocal::where('company_id', $companyId)->get();
    
        // Retorne a view com os dados do inventário
        return Inertia::render('Inventory/InventoryDashboard', [
            'auth' => [
                'user' => $user, // Envia o usuário com a empresa para o frontend
            ],
            'categories' => $categories, // Mantém a busca separada de categorias
            'products' => $products, // Produtos já carregam os estoques relacionados, sem as categorias
            'suppliers' => $suppliers,
            'stockLocals' => $stockLocals,
        ]);
    }
    
    
}
