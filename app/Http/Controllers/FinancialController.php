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
        $empresaId = auth()->user()->empresa_id;
        $user = $request->user()->load('empresa');

        // Busque os dados necessários para o dashboard financeiro
        $accounts = Account::where('empresa_id', $empresaId)->get();
        $categories = TransactionCategory::where('empresa_id', $empresaId)->get();
        $transactions = Transaction::where('empresa_id', $empresaId)->get();
        $cashFlows = CashFlow::where('empresa_id', $empresaId)->get();

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
