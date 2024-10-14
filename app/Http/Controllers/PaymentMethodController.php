<?php

namespace App\Http\Controllers;

use App\Models\PaymentMethod;
use Illuminate\Http\Request;

class PaymentMethodController extends Controller
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
       // Validação dos dados recebidos
       $validatedData = $request->validate([
        'account_id' => 'required|integer',
        'name' => 'required|string',
        'type' => 'required|string',
    ]);

    // Transação para garantir que ambas as operações (ordem e itens) sejam salvas corretamente
        $companyId = auth()->user()->company_id;
        // Criação do pedido (Order)
        $order = PaymentMethod::create([
            'company_id' => $companyId,
            'account_id' => $validatedData['account_id'],
            'name' => $validatedData['name'],
            'type' => $validatedData['type'],
  ]);


    // Redirecionar com sucesso
    //return redirect()->route('financial.dashboard')->with('success', 'Pedido criado com sucesso!');   
 }

    /**
     * Display the specified resource.
     */
    public function show(PaymentMethod $paymentMethod)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PaymentMethod $paymentMethod)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PaymentMethod $paymentMethod)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PaymentMethod $paymentMethod)
    {
        //
    }
}
