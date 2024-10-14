<?php

namespace App\Http\Controllers;

use App\Models\PaymentMethodFee;
use Illuminate\Http\Request;

class PaymentMethodFeeController extends Controller
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
            'payment_method_id' => 'required|exists:payment_methods,id', // Verifica se o método de pagamento existe
            'installments' => 'required|integer|min:1',
            'fixed_fee' => 'required|numeric|min:0',
            'percentage_fee' => 'required|numeric|min:0|max:100',
        ]);
    
        try {
            // Criação de uma nova taxa de método de pagamento
            $paymentFee = new PaymentMethodFee();
            $paymentFee->payment_method_id = $validatedData['payment_method_id'];
            $paymentFee->installments = $validatedData['installments'];
            $paymentFee->fixed_fee = $validatedData['fixed_fee'];
            $paymentFee->percentage_fee = $validatedData['percentage_fee'];
            $paymentFee->save();
    

    
        } catch (\Exception $e) {
            // Em caso de erro, retorna uma resposta de erro
            return response()->json([
                'message' => 'Erro ao adicionar taxa: ' . $e->getMessage(),
            ], 500);
        }
    }
    

    /**
     * Display the specified resource.
     */
    public function show(PaymentMethodFee $paymentMethodFee)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PaymentMethodFee $paymentMethodFee)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PaymentMethodFee $paymentMethodFee)
    {
        // Validação básica dos dados
        $request->validate([
            'editedFees' => 'required|array',
            'editedFees.*.installments' => 'required|integer|min:1',
            'editedFees.*.fixed_fee' => 'required|numeric|min:0',
            'editedFees.*.percentage_fee' => 'required|numeric|min:0',
        ]);
    
        // Percorre todas as taxas editadas
        foreach ($request->editedFees as $feeId => $feeData) {
            // Encontra o registro de PaymentMethodFee correspondente ao ID
            $paymentMethodFee = PaymentMethodFee::find($feeId);
    
            // Verifica se a taxa existe
            if ($paymentMethodFee) {
                // Atualiza os campos
                $paymentMethodFee->installments = $feeData['installments'];
                $paymentMethodFee->fixed_fee = (int)($feeData['fixed_fee'] * 100); // Converte para centavos
                $paymentMethodFee->percentage_fee = $feeData['percentage_fee'];
    
                // Salva as alterações
                $paymentMethodFee->save();
            }
        }
    
        // Retorna uma resposta de sucesso
        /*return response()->json([
            'message' => 'Taxas atualizadas com sucesso!'
        ], 200);*/
    }
    

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PaymentMethodFee $paymentMethodFee)
    {
        //
    }
}
