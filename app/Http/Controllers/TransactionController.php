<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Account;
use App\Models\TransactionCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TransactionController extends Controller
{
    /**
     * Display a listing of the transactions.
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        $companyId = $user->company_id;
    
        // Filtra transações por datas se os filtros forem passados e não forem nulos
        $transactionsQuery = Transaction::where('company_id', $companyId);
    
        if ($request->filled('start_date')) {
            $transactionsQuery->where('transaction_date', '>=', $request->start_date);
        }
    
        if ($request->filled('end_date')) {
            $transactionsQuery->where('transaction_date', '<=', $request->end_date);
        }
    
        // Paginação de 10 transações por página
        $transactions = $transactionsQuery->paginate(10);
    
        // Recupera contas e categorias associadas à empresa do usuário
        $accounts = Account::where('company_id', $companyId)->get();
        $categories = TransactionCategory::where('company_id', $companyId)->get();
    
        return Inertia::render('Financial/FinancialDashboard', [
            'transactions' => $transactions,
            'accounts' => $accounts,
            'categories' => $categories,
            'pagination' => $transactions, // Passa a paginação completa
        ]);
    }
    public function filter(Request $request)
    {
        $user = auth()->user();
        $companyId = $user->company_id;
    
        // Filtra transações por datas se os filtros forem passados e não forem nulos
        $transactionsQuery = Transaction::where('company_id', $companyId);
    
        if ($request->filled('start_date')) {
            $transactionsQuery->where('transaction_date', '>=', $request->start_date);
        }
    
        if ($request->filled('end_date')) {
            $transactionsQuery->where('transaction_date', '<=', $request->end_date);
        }
    
        // Paginação de 10 transações por página
        $transactions = $transactionsQuery->paginate(10);
    
        // Recupera contas e categorias associadas à empresa do usuário
        $accounts = Account::where('company_id', $companyId)->get();
        $categories = TransactionCategory::where('company_id', $companyId)->get();
    
        return Inertia::render('Financial/FinancialDashboard', [
            'transactions' => $transactions,
            'accounts' => $accounts,
            'categories' => $categories,
            'pagination' => $transactions, // Passa a paginação completa
        ]);
    }
    /**
     * Store a newly created transaction in storage.
     */
    public function store(Request $request)
    {
        // Validação dos dados recebidos
        $validatedData = $request->validate([
            'account_id' => 'required|exists:accounts,id',
            'category_id' => 'required|exists:transaction_categories,id',
            'type' => 'required|in:income,expense,transfer',
            'amount' => 'required|numeric',
            'transaction_date' => 'required|date',
            'description' => 'nullable|string',
        ]);

        // Adicionar o 'company_id' do usuário autenticado
        $validatedData['company_id'] = auth()->user()->company_id;

        // Criar a transação
        $transaction = Transaction::create($validatedData);

        // Atualizar o saldo da conta
        $account = Account::findOrFail($request->account_id);
        if ($request->type == 'income') {
            $account->balance += $request->amount;
        } elseif ($request->type == 'expense') {
            $account->balance -= $request->amount;
        }
        $account->save();

        return redirect()->back()->with('success', 'Transação criada e saldo atualizado!');
    }

    /**
     * Display the specified transaction.
     */
    public function show(Transaction $transaction)
    {
        $this->authorize('view', $transaction);
        return Inertia::render('transactions.show', ['transaction' => $transaction]);
    }

    /**
     * Show the form for editing the specified transaction.
     */
    public function edit(Transaction $transaction)
    {
        $this->authorize('update', $transaction);
        return Inertia::render('transactions.edit', ['transaction' => $transaction]);
    }

    /**
     * Update the specified transaction in storage.
     */
    public function update(Request $request, Transaction $transaction)
    {
        $this->authorize('update', $transaction);

        $validatedData = $request->validate([
            'account_id' => 'required|exists:accounts,id',
            'category_id' => 'required|exists:transaction_categories,id',
            'type' => 'required|in:income,expense',
            'amount' => 'required|numeric',
            'description' => 'nullable|string',
            'transaction_date' => 'required|date',
        ]);

        $transaction->update($validatedData);

        return redirect()->route('transactions.index')->with('success', 'Transação atualizada com sucesso!');
    }

    /**
     * Remove the specified transaction from storage.
     */
    public function destroy(Transaction $transaction)
    {
        $this->authorize('delete', $transaction);
        $transaction->delete();

        return redirect()->route('transactions.index')->with('success', 'Transação removida com sucesso!');
    }
}
