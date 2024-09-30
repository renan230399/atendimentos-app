<?php

namespace App\Http\Controllers;

use App\Models\Stock;
use Illuminate\Http\Request;

class StockController extends Controller
{
    /**
     * Display a listing of the stock entries.
     */
    public function index()
    {
        $stocks = Stock::with('product', 'company')->get();
        return view('stocks.index', compact('stocks'));
    }

    /**
     * Show the form for creating a new stock entry.
     */
    public function create()
    {
        return view('stocks.create');
    }

    /**
     * Store a newly created stock entry in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|numeric|min:0',
            'entry_date' => 'required|date',
            'expiration_date' => 'nullable|date',
            'location' => 'nullable|string|max:255',
            'cost_price' => 'nullable|numeric',
            'company_id' => 'required|exists:companies,id',
        ]);

        Stock::create($request->all());

        return redirect()->route('stocks.index')->with('success', 'Stock entry created successfully');
    }

    /**
     * Show the form for editing the specified stock entry.
     */
    public function edit(Stock $stock)
    {
        return view('stocks.edit', compact('stock'));
    }

    /**
     * Update the specified stock entry in storage.
     */
    public function update(Request $request, Stock $stock)
    {
        $request->validate([
            'quantity' => 'required|numeric|min:0',
            'entry_date' => 'required|date',
            'expiration_date' => 'nullable|date',
            'location' => 'nullable|string|max:255',
            'cost_price' => 'nullable|numeric',
        ]);

        $stock->update($request->all());

        return redirect()->route('stocks.index')->with('success', 'Stock entry updated successfully');
    }

    /**
     * Remove the specified stock entry from storage.
     */
    public function destroy(Stock $stock)
    {
        $stock->delete();

        return redirect()->route('stocks.index')->with('success', 'Stock entry deleted successfully');
    }
}
