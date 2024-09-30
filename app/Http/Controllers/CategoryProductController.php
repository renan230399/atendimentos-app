<?php

namespace App\Http\Controllers;

use App\Models\CategoryProduct;
use Illuminate\Http\Request;

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
     * Show the form for creating a new category product.
     */
    public function create()
    {
        return view('categories.create');
    }

    /**
     * Store a newly created category product in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'company_id' => 'required|exists:companies,id',
        ]);

        CategoryProduct::create($request->all());

        return redirect()->route('categories.index')->with('success', 'Category created successfully');
    }

    /**
     * Show the form for editing the specified category product.
     */
    public function edit(CategoryProduct $category)
    {
        return view('categories.edit', compact('category'));
    }

    /**
     * Update the specified category product in storage.
     */
    public function update(Request $request, CategoryProduct $category)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $category->update($request->all());

        return redirect()->route('categories.index')->with('success', 'Category updated successfully');
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
