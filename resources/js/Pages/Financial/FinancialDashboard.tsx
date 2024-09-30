import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import CategoriesManager from '@/Pages/Financial/Partials/CategoriesManager';
import AccountsManager from '@/Pages/Financial/Partials/AccountsManager';
import TransfersManager from '@/Pages/Financial/Partials/TransfersManager';
import CashFlowsManager from '@/Pages/Financial/Partials/CashFlowsManager';
import TransactionsManager from '@/Pages/Financial/Partials/TransactionsManager';

interface FinancialDashboardProps {
  auth: {
    user: {
      name: string;
      email: string;
    };
  };
  accounts: Account[];
  categories: Category[];
  transfers: Transfer[];
  cashFlows: CashFlow[];
  transactions: Transaction[];
}

const FinancialDashboard: React.FC<FinancialDashboardProps> = ({
  auth,
  accounts,
  categories,
  transfers,
  cashFlows,
  transactions,
}) => {
  return (
    <AuthenticatedLayout user={auth.user}>
      <div className="container mx-auto p-4 space-y-8 flex flex-wrap gap-3">
        <div className="w-[65%]">
          <TransactionsManager transactions={transactions} accounts={accounts} categories={categories} />
        </div>
        <div className="w-[34%]">
          <AccountsManager accounts={accounts} />

        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CategoriesManager categories={categories} />
          <TransfersManager accounts={accounts} transfers={transfers} />

        </div>
   
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CashFlowsManager cashFlows={cashFlows} accounts={accounts} transactions={transactions} />


        </div>
   
      </div>
    </AuthenticatedLayout>
  );
};

export default FinancialDashboard;
