import React from 'react';

interface CashFlow {
  id: number;
  account_id: number;
  transaction_id: number;
  balance_before: number;
  balance_after: number;
}

interface Account {
  id: number;
  name: string;
}

interface Transaction {
  id: number;
  description: string;
}

interface CashFlowsManagerProps {
  cashFlows: CashFlow[];
  accounts: Account[];
  transactions: Transaction[];
}

const CashFlowsManager: React.FC<CashFlowsManagerProps> = ({ cashFlows, accounts, transactions }) => {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-700">Gerenciar Fluxos de Caixa</h2>
      <ul className="mt-4 divide-y divide-gray-200">
        {cashFlows.length > 0 ? (
          cashFlows.map((cashFlow) => {
            const account = accounts.find(a => a.id === cashFlow.account_id);
            const transaction = transactions.find(t => t.id === cashFlow.transaction_id);

            return (
              <li key={cashFlow.id} className="py-2">
                <span className="font-semibold text-gray-700">
                  Conta: {account ? account.name : 'Conta não encontrada'}
                </span>{' '}
                - Transação: {transaction ? transaction.description : 'Transação não encontrada'}{' '}
                - Saldo Antes: {formatCurrency(cashFlow.balance_before)}{' '}
                - Saldo Depois: {formatCurrency(cashFlow.balance_after)}
              </li>
            );
          })
        ) : (
          <li className="py-2 text-gray-500">Nenhum fluxo de caixa encontrado.</li>
        )}
      </ul>
    </div>
  );
};

export default CashFlowsManager;
