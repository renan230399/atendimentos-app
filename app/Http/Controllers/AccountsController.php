<?php

namespace App\Http\Controllers;

use App\Models\Account;
use Illuminate\Http\Request;

class AccountsController extends Controller
{
    /**
     * Display a listing of the accounts.
     */
    public function index()
    {
        $accounts = Account::where('company_id', auth()->user()->company_id)->get();
        return view('accounts.index', ['accounts' => $accounts]);
    }

    /**
     * Show the form for creating a new account.
     */
    public function create()
    {
        return view('accounts.create');
    }

    /**
     * Store a newly created account in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:bank,cash,investment',
            'balance' => 'required|numeric',
        ]);

        $validatedData['company_id'] = auth()->user()->company_id;

        Account::create($validatedData);

        return redirect()->route('financial.dashboard')->with('success', 'Conta criada com sucesso!');
    }

    /**
     * Display the specified account.
     */
    public function show(Account $account)
    {
        $this->authorize('view', $account);
        return view('accounts.show', compact('account'));
    }

    /**
     * Show the form for editing the specified account.
     */
    public function edit(Account $account)
    {
        $this->authorize('update', $account);
        return view('accounts.edit', compact('account'));
    }

    /**
     * Update the specified account in storage.
     */
    public function update(Request $request, Account $account)
    {
        $this->authorize('update', $account);

        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:bank,cash,investment',
            'balance' => 'required|numeric',
        ]);

        $account->update($validatedData);

        return redirect()->route('accounts.index')->with('success', 'Conta atualizada com sucesso!');
    }

    /**
     * Remove the specified account from storage.
     */
    public function destroy(Account $account)
    {
        $this->authorize('delete', $account);
        $account->delete();

        return redirect()->route('accounts.index')->with('success', 'Conta removida com sucesso!');
    }
}
