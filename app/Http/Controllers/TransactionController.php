<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Account;
use App\Models\Patient;
use App\Models\Consultation;

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
        $transactionsQuery = Transaction::with([
            'related' => function ($morphTo) {
                $morphTo->morphWith([
                    // Carregar apenas o nome do paciente quando for uma consulta
                    Consultation::class => ['patient:id,patient_name'] // Carrega apenas os campos 'id' e 'name' do paciente
                ]);
            }
        ])->where('company_id', $companyId);
    
        if ($request->filled('start_date')) {
            $transactionsQuery->where('transaction_date', '>=', $request->start_date);
        }
    
        if ($request->filled('end_date')) {
            $transactionsQuery->where('transaction_date', '<=', $request->end_date);
        }
    
        // Buscar todas as transações de uma só vez
        $transactions = $transactionsQuery->get();
    
        // Mapeia as transações para adicionar o nome do paciente, se for uma consulta
        $transactions = $transactions->map(function ($transaction) {
            // Verifica se o tipo relacionado é uma consulta
            if ($transaction->related_type === Consultation::class && isset($transaction->related->patient)) {
                // Adiciona o nome do paciente ao array da transação
                $transaction->related->patient_name = $transaction->related->patient->name;
            }
            return $transaction;
        });
    
        // Recupera contas e categorias associadas à empresa do usuário
        $accounts = Account::where('company_id', $companyId)->get();
        $categories = TransactionCategory::where('company_id', $companyId)->get();
    
        // Retorna a resposta em JSON
        return response()->json([
            'transactions' => $transactions,
            'accounts' => $accounts,
            'categories' => $categories,
        ]);
    }
    
    
    
    
    
    
    
    
    
    
    
    /**
     * Store a newly created transaction in storage.
     */
    public function store(Request $request)
    {
        // Validação dos dados recebidos
        $validatedData = $request->validate([
            'transactions.*.account_id' => 'required|exists:accounts,id',
            'transactions.*.category_id' => 'required|exists:transaction_categories,id',
            'transactions.*.type' => 'required|in:income,expense,transfer',
            'transactions.*.amount' => 'required|numeric',
            'transactions.*.transaction_date' => 'required|date',
            'transactions.*.description' => 'nullable|string',
            'transactions.*.status' => 'required|boolean',
        ]);
    
        // Verifique se existe o array transactions
        if (!isset($validatedData['transactions'])) {
            return redirect()->back()->withErrors(['transactions' => 'Nenhuma transação foi enviada.']);
        }
    
        // Processar múltiplas transações
        foreach ($validatedData['transactions'] as $transactionData) {
            // Adicionar o 'company_id' do usuário autenticado
            $transactionData['company_id'] = auth()->user()->company_id;
    
            // Criar a transação
            $transaction = Transaction::create($transactionData);
    
            // Atualizar o saldo da conta
            $account = Account::findOrFail($transactionData['account_id']);
            if ($transactionData['type'] == 'income') {
                $account->balance += $transactionData['amount'];
            } elseif ($transactionData['type'] == 'expense') {
                $account->balance -= $transactionData['amount'];
            }
            $account->save();
        }
    
        return redirect()->back()->with('success', 'Transações criadas e saldos atualizados!');
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
