<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PaymentMethod;
use App\Models\PaymentMethodFee;

class PaymentMethodSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // ID específico da empresa e da conta
        $companyId = 1;
        $accountId = 2;

        // Criando métodos de pagamento para a empresa e conta específicas
        $paymentMethods = [
            ['name' => 'Dinheiro', 'type' => 'Dinheiro', 'fixed_fee' => 0.00, 'percentage_fee' => 0.00],
            ['name' => 'Pix Sicoob', 'type' => 'Transferência', 'fixed_fee' => 0.00, 'percentage_fee' => 0.00],
            ['name' => 'Cartão de Débito - Ton', 'type' => 'Cartão de Crédito', 'fixed_fee' => 0.00, 'percentage_fee' => 1.29],
            ['name' => 'Cartão de Crédito - Ton', 'type' => 'Cartão de Crédito'],
        ];

        foreach ($paymentMethods as $method) {
            $paymentMethod = PaymentMethod::create([
                'company_id' => $companyId,
                'account_id' => $accountId,
                'name' => $method['name'],
                'type' => $method['type'],
                'status' => true,
            ]);

            // Adicionar taxas variáveis para Cartão de Crédito
            if ($paymentMethod->type === 'Cartão de Crédito') {
                $fees = [
                    ['installments' => 1, 'fixed_fee' => 0.00, 'percentage_fee' => 3.09],  // À vista
                    ['installments' => 2, 'fixed_fee' => 0.00, 'percentage_fee' => 5.59],  // 2 parcelas
                    ['installments' => 3, 'fixed_fee' => 0.00, 'percentage_fee' => 6.15],  // 3 parcelas
                    ['installments' => 4, 'fixed_fee' => 0.00, 'percentage_fee' => 6.95],  // 4 parcelas
                    ['installments' => 5, 'fixed_fee' => 0.00, 'percentage_fee' => 7.95],  // 5 parcelas
                    ['installments' => 6, 'fixed_fee' => 0.00, 'percentage_fee' => 8.95],  // 6 parcelas
                    ['installments' => 7, 'fixed_fee' => 0.00, 'percentage_fee' => 9.55],  // 7 parcelas
                    ['installments' => 8, 'fixed_fee' => 0.00, 'percentage_fee' => 9.95],  // 8 parcelas
                    ['installments' => 9, 'fixed_fee' => 0.00, 'percentage_fee' => 10.95], // 9 parcelas
                    ['installments' => 10, 'fixed_fee' => 0.00, 'percentage_fee' => 10.99], // 10 parcelas
                    ['installments' => 11, 'fixed_fee' => 0.00, 'percentage_fee' => 10.99], // 11 parcelas
                    ['installments' => 12, 'fixed_fee' => 0.00, 'percentage_fee' => 10.99], // 12 parcelas
                ];
                

                foreach ($fees as $fee) {
                    PaymentMethodFee::create([
                        'payment_method_id' => $paymentMethod->id,
                        'installments' => $fee['installments'],
                        'fixed_fee' => $fee['fixed_fee'],
                        'percentage_fee' => $fee['percentage_fee'],
                        'status' => true,
                    ]);
                }
            } else {
                // Adicionar uma taxa fixa para Dinheiro e Transferência Bancária
                PaymentMethodFee::create([
                    'payment_method_id' => $paymentMethod->id,
                    'installments' => 1, // Sempre uma parcela para Dinheiro e Transferência Bancária
                    'fixed_fee' => $method['fixed_fee'],
                    'percentage_fee' => $method['percentage_fee'],// Sem taxa para esses métodos
                    'status' => true,
                ]);
            }
        }
    }
}
