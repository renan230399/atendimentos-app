<?php

namespace App\Http\Controllers;

use App\Models\Transfer;
use Illuminate\Http\Request;

class TransferController extends Controller
{
    /**
     * Display a listing of the transfers.
     */
    public function index()
    {
        $transfers = Transfer::where('empresa_id', auth()->user()->empresa_id)->get();
        return view('transfers.index', ['transfers' => $transfers]);
    }

    /**
     * Show the form for creating a new transfer.
     */
    public function create()
    {
        return view('transfers.create');
    }

    /**
     * Store a newly created transfer in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'from_account_id' => 'required|exists:accounts,id',
            'to_account_id' => 'required|exists:accounts,id',
            'amount' => 'required|numeric',
            'description' => 'nullable|string',
            'transfer_date' => 'required|date',
        ]);

        $validatedData['empresa_id'] = auth()->user()->empresa_id;

        Transfer::create($validatedData);

        return redirect()->route('transfers.index')->with('success', 'Transferência criada com sucesso!');
    }

    /**
     * Display the specified transfer.
     */
    public function show(Transfer $transfer)
    {
        $this->authorize('view', $transfer);
        return view('transfers.show', compact('transfer'));
    }

    /**
     * Show the form for editing the specified transfer.
     */
    public function edit(Transfer $transfer)
    {
        $this->authorize('update', $transfer);
        return view('transfers.edit', compact('transfer'));
    }

    /**
     * Update the specified transfer in storage.
     */
    public function update(Request $request, Transfer $transfer)
    {
        $this->authorize('update', $transfer);

        $validatedData = $request->validate([
            'from_account_id' => 'required|exists:accounts,id',
            'to_account_id' => 'required|exists:accounts,id',
            'amount' => 'required|numeric',
            'description' => 'nullable|string',
            'transfer_date' => 'required|date',
        ]);

        $transfer->update($validatedData);

        return redirect()->route('transfers.index')->with('success', 'Transferência atualizada com sucesso!');
    }

    /**
     * Remove the specified transfer from storage.
     */
    public function destroy(Transfer $transfer)
    {
        $this->authorize('delete', $transfer);
        $transfer->delete();

        return redirect()->route('transfers.index')->with('success', 'Transferência removida com sucesso!');
    }
}
