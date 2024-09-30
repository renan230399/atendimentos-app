<?php

namespace App\Http\Controllers;

use App\Models\CategoryProduct;
use App\Models\Product;
use App\Models\Stock;
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

        // Busque as categorias de produtos, produtos e informações de estoque
        $categories = CategoryProduct::where('company_id', $companyId)->get();
        $products = Product::where('company_id', $companyId)->with('category')->get();
        $stocks = Stock::where('company_id', $companyId)->with('product')->get();

        // Retorne a view com os dados do inventário
        return Inertia::render('Inventory/InventoryDashboard', [
            'auth' => [
                'user' => $user, // Envia o usuário com a empresa para o frontend
            ],
            'categories' => $categories,
            'products' => $products,
            'stocks' => $stocks,
        ]);
    }
}
