<?php

namespace App\Http\Controllers;

use App\Models\CashFlow;
use Illuminate\Http\Request;

class CashFlowController extends Controller
{
    /**
     * Display a listing of the cash flows.
     */
    public function index()
    {
        $cashFlows = CashFlow::where('empresa_id', auth()->user()->empresa_id)->get();
        return view('cash_flows.index', ['cashFlows' => $cashFlows]);
    }

    /**
     * Show the form for creating a new cash flow record.
     */
    public function create()
    {
        return view('cash_flows.create');
    }

    /**
     * Store a newly created cash flow record in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'account_id' => 'required|exists:accounts,id',
            'transaction_id' => 'required|exists:transactions,id',
            'balance_before' => 'required|numeric',
            'balance_after' => 'required|numeric',
        ]);

        $validatedData['empresa_id'] = auth()->user()->empresa_id;

        CashFlow::create($validatedData);

        return redirect()->route('cash_flows.index')->with('success', 'Registro de fluxo de caixa criado com sucesso!');
    }

    /**
     * Display the specified cash flow record.
     */
    public function show(CashFlow $cashFlow)
    {
        $this->authorize('view', $cashFlow);
        return view('cash_flows.show', compact('cashFlow'));
    }

    /**
     * Show the form for editing the specified cash flow record.
     */
    public function edit(CashFlow $cashFlow)
    {
        $this->authorize('update', $cashFlow);
        return view('cash_flows.edit', compact('cashFlow'));
    }

    /**
     * Update the specified cash flow record in storage.
     */
    public function update(Request $request, CashFlow $cashFlow)
    {
        $this->authorize('update', $cashFlow);

        $validatedData = $request->validate([
            'account_id' => 'required|exists:accounts,id',
            'transaction_id' => 'required|exists:transactions,id',
            'balance_before' => 'required|numeric',
            'balance_after' => 'required|numeric',
        ]);

        $cashFlow->update($validatedData);

        return redirect()->route('cash_flows.index')->with('success', 'Registro de fluxo de caixa atualizado com sucesso!');
    }

    /**
     * Remove the specified cash flow record from storage.
     */
    public function destroy(CashFlow $cashFlow)
    {
        $this->authorize('delete', $cashFlow);
        $cashFlow->delete();

        return redirect()->route('cash_flows.index')->with('success', 'Registro de fluxo de caixa removido com sucesso!');
    }
}
