<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\TransactionCategory;
use App\Models\Transaction;
use App\Models\CashFlow;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FinancialController extends Controller
{
    /**
     * Exibe o dashboard financeiro com as contas, categorias, transações e fluxo de caixa.
     */
    public function financialDashboard(Request $request)
    {
        // Obtenha os dados relacionados à empresa do usuário autenticado
        $companyId = auth()->user()->company_id;
        $user = $request->user()->load('company');

        // Busque os dados necessários para o dashboard financeiro
        $accounts = Account::where('company_id', $companyId)->get();
        $categories = TransactionCategory::where('company_id', $companyId)->get();
        $transactions = Transaction::where('company_id', $companyId)->get();
        $cashFlows = CashFlow::where('company_id', $companyId)->get();

        // Retorne a view com os dados agregados
        return Inertia::render('Financial/FinancialDashboard', [
            'auth' => [
                'user' => $user, // Envia o usuário com a empresa para o frontend
            ],
            'accounts' => $accounts,
            'categories' => $categories,
            'transactions' => $transactions,
            'cashFlows' => $cashFlows,
        ]);
    }
}
