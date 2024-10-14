<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Account;
use App\Models\Patient;
use App\Models\Consultation;
use App\Models\CashFlow;

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
        //dd($request);

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
    
            // Verifica se o status da transação é true e consulta o cash flow relacionado
            if ($transaction->status) {
                $cashFlow = CashFlow::where('transaction_id', $transaction->id)->first();
                if ($cashFlow) {
                    // Adiciona os detalhes do cash flow à transação
                    $transaction->cash_flow = $cashFlow;
                }
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
        // Validação dos dados gerais e das transações individuais
        $validatedData = $request->validate([
            'category_id' => 'required|exists:transaction_categories,id',
            'type' => 'required|in:income,expense,transfer',
            'amount' => 'required|numeric',
            'description' => 'nullable|string',
            'account_id' => 'required|exists:accounts,id',
            'transactions' => 'required|array|min:1',
            'transactions.*.transaction_date' => 'required|date',
            'transactions.*.status' => 'required|boolean',
        ]);
    
        // Iterar sobre cada transação no array de transações
        foreach ($validatedData['transactions'] as $transactionData) {
            // Adicionar dados gerais a cada transação
            $transactionData['category_id'] = $validatedData['category_id'];
            $transactionData['type'] = $validatedData['type'];
            $transactionData['amount'] = $validatedData['amount'];
            $transactionData['description'] = $validatedData['description'];
            $transactionData['account_id'] = $validatedData['account_id'];
            $transactionData['company_id'] = auth()->user()->company_id;
    
            // Criar a transação no banco de dados
            $transaction = Transaction::create($transactionData);
    
            // Atualizar o saldo da conta associada
            $account = Account::findOrFail($transactionData['account_id']);
            if ($transactionData['type'] == 'income') {
                $account->balance += $transactionData['amount'];
            } elseif ($transactionData['type'] == 'expense') {
                $account->balance -= $transactionData['amount'];
            }
            $account->save();
        }
    
        // Redirecionar com uma mensagem de sucesso
        //return redirect()->back()->with('success', 'Transações criadas e saldos atualizados!');
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
        $user = auth()->user();
        $companyId = $user->company_id;
        // Validação dos dados enviados
        $validatedData = $request->validate([
            'account_id' => 'required|exists:accounts,id',
            'category_id' => 'required|exists:transaction_categories,id',
            'type' => 'required|in:income,expense,transfer',
            'amount' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'transaction_date' => 'required|date',
            'status' => 'required|boolean', // Verifica se o status é booleano (1 ou 0)
        ]);
    
        // Atualiza os campos da transação
        $transaction->update([
            'account_id' => $validatedData['account_id'],
            'category_id' => $validatedData['category_id'],
            'type' => $validatedData['type'],
            'amount' => $validatedData['amount'],
            'description' => $validatedData['description'],
            'transaction_date' => $validatedData['transaction_date'],
            'status' => $validatedData['status'], // Atualiza o status
        ]);
    
        // Verifica se a transação está marcada como realizada (status true)
        if ($validatedData['status']) {
            // Busca a conta associada à transação
            $account = Account::find($validatedData['account_id']);
            
            // Saldo atual da conta
            $balanceBefore = $account->balance;
            
            // Ajusta o saldo da conta com base no tipo de transação
            if ($validatedData['type'] === 'income') {
                // Se for entrada (income), adiciona o valor ao saldo
                $account->balance += $validatedData['amount'];
            } elseif ($validatedData['type'] === 'expense') {
                // Se for despesa (expense), subtrai o valor do saldo
                $account->balance -= $validatedData['amount'];
            }
    
            // Atualiza o saldo da conta
            $account->save();
    
            // Registra o saldo após a transação
            $balanceAfter = $account->balance;
    
            // Cria um registro no fluxo de caixa (cash_flows)
            CashFlow::create([
                'account_id' => $account->id,
                'company_id' => $companyId, // Use apenas o company_id do usuário autenticado
                'transaction_id' => $transaction->id,
                'balance_before' => $balanceBefore,
                'balance_after' => $balanceAfter,
            ]);
        }
    
        // Redireciona para o dashboard financeiro com mensagem de sucesso
        return redirect()->route('financial.dashboard')->with('success', 'Transação atualizada com sucesso!');
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
