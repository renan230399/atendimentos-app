<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\TransactionCategory;
use App\Models\PaymentMethod;
use App\Models\PaymentMethodFee;
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

        // Verifique se as datas de início e fim foram enviadas
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        // Obtenha todas as contas e categorias relacionadas à empresa
        $accounts = Account::where('company_id', $companyId)->get();
        $categories = TransactionCategory::where('company_id', $companyId)->get();

        // Obtendo os métodos de pagamento da empresa
        $paymentMethods = PaymentMethod::where('company_id', $companyId)->get();

        // Obtendo as taxas dos métodos de pagamento associados à empresa
        $paymentMethodsFees = PaymentMethodFee::whereIn('payment_method_id', $paymentMethods->pluck('id'))->get();
    

        // Se as datas de início e fim forem fornecidas, filtre as transações e o fluxo de caixa
        if ($startDate && $endDate) {
            // Filtra as transações dentro do intervalo de datas
            $transactions = Transaction::where('company_id', $companyId)
                ->whereBetween('transaction_date', [$startDate, $endDate])
                ->get();

            // Filtra o fluxo de caixa dentro do intervalo de datas
            $cashFlows = CashFlow::where('company_id', $companyId)
                ->whereBetween('created_at', [$startDate, $endDate])
                ->get();
        } else {
            // Caso as datas não sejam fornecidas, busque todos os dados sem filtragem
            $transactions = Transaction::where('company_id', $companyId)->get();
            $cashFlows = CashFlow::where('company_id', $companyId)->get();
        }

        // Retorne a view com os dados agregados
        return Inertia::render('Financial/FinancialDashboard', [
            'auth' => [
                'user' => $user, // Envia o usuário com a empresa para o frontend
            ],
            'accounts' => $accounts,
            'paymentMethods' => $paymentMethods,
            'paymentMethodsFees' => $paymentMethodsFees,
            'categories' => $categories,
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
        ]);
    }
}
