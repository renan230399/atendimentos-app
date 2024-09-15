import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PropTypes from 'prop-types';

// Interface for Account, Category, and Transaction
interface Account {
  id: number;
  name: string;
  type: string;
  balance: number;
}

interface Category {
  id: number;
  name: string;
  type: string;
}

interface Transaction {
  id: number;
  account_id: number;
  category_id: number;
  amount: number;
  type: string;
  description: string;
  transaction_date: string;
}

interface FinancialDashboardProps {
  auth: {
    user: {
      name: string;
      email: string;
    };
  };
  accounts: Account[];
  categories: Category[];
  transactions: Transaction[];
}

const FinancialDashboard: React.FC<FinancialDashboardProps> = ({ auth, accounts, categories, transactions }) => {
  const { data, setData, post, delete: destroy, errors } = useForm({
    account_name: '',
    account_type: 'bank',
    category_name: '',
    category_type: 'income',
    transaction_amount: 0,
    transaction_description: '',
    transaction_type: 'income',
    account_id: accounts.length > 0 ? accounts[0].id : '',
    category_id: categories.length > 0 ? categories[0].id : '',
  });

  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);

  // Handlers for opening/closing forms
  const toggleAddAccount = () => setIsAddingAccount(!isAddingAccount);
  const toggleAddCategory = () => setIsAddingCategory(!isAddingCategory);
  const toggleAddTransaction = () => setIsAddingTransaction(!isAddingTransaction);

  // Handle adding new account
  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('accounts.store'), {
      onSuccess: () => {
        setIsAddingAccount(false);
      },
    });
  };

  // Handle adding new category
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('categories.store'), {
      onSuccess: () => {
        setIsAddingCategory(false);
      },
    });
  };

  // Handle adding new transaction
  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('transactions.store'), {
      onSuccess: () => {
        setIsAddingTransaction(false);
      },
    });
  };

  // Handle deleting a transaction
  const handleDeleteTransaction = (transactionId: number) => {
    if (confirm('Tem certeza que deseja excluir esta transação?')) {
      destroy(route('transactions.destroy', transactionId));
    }
  };

  return (
    <AuthenticatedLayout user={auth.user}>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Dashboard Financeiro</h1>

        {/* Seção de Gerenciamento de Contas */}
        <div className="mb-4">
          <h2 className="text-xl font-bold">Gerenciar Contas</h2>
          <PrimaryButton onClick={toggleAddAccount}>
            {isAddingAccount ? 'Cancelar' : 'Adicionar Conta'}
          </PrimaryButton>
          {isAddingAccount && (
            <form onSubmit={handleAddAccount} className="mt-4">
              <TextInput
                label="Nome da Conta"
                value={data.account_name}
                onChange={(e) => setData('account_name', e.target.value)}
                className="block mt-1"
              />
              <select
                className="block mt-1"
                value={data.account_type}
                onChange={(e) => setData('account_type', e.target.value)}
              >
                <option value="bank">Banco</option>
                <option value="cash">Caixa</option>
                <option value="investment">Investimento</option>
              </select>
              <InputError message={errors.account_name} className="mt-2" />
              <PrimaryButton className="mt-2">Salvar</PrimaryButton>
            </form>
          )}
          <ul className="mt-4">
            {accounts.map((account) => (
              <li key={account.id}>{account.name} - {account.type}</li>
            ))}
          </ul>
        </div>

        {/* Seção de Gerenciamento de Categorias */}
        <div className="mb-4">
          <h2 className="text-xl font-bold">Gerenciar Categorias</h2>
          <PrimaryButton onClick={toggleAddCategory}>
            {isAddingCategory ? 'Cancelar' : 'Adicionar Categoria'}
          </PrimaryButton>
          {isAddingCategory && (
            <form onSubmit={handleAddCategory} className="mt-4">
              <TextInput
                label="Nome da Categoria"
                value={data.category_name}
                onChange={(e) => setData('category_name', e.target.value)}
                className="block mt-1"
              />
              <select
                className="block mt-1"
                value={data.category_type}
                onChange={(e) => setData('category_type', e.target.value)}
              >
                <option value="income">Receita</option>
                <option value="expense">Despesa</option>
              </select>
              <InputError message={errors.category_name} className="mt-2" />
              <PrimaryButton className="mt-2">Salvar</PrimaryButton>
            </form>
          )}
          <ul className="mt-4">
            {categories.map((category) => (
              <li key={category.id}>{category.name} - {category.type}</li>
            ))}
          </ul>
        </div>

        {/* Seção de Gerenciamento de Transações */}
        <div className="mb-4">
          <h2 className="text-xl font-bold">Gerenciar Transações</h2>
          <PrimaryButton onClick={toggleAddTransaction}>
            {isAddingTransaction ? 'Cancelar' : 'Adicionar Transação'}
          </PrimaryButton>
          {isAddingTransaction && (
            <form onSubmit={handleAddTransaction} className="mt-4">
              <select
                className="block mt-1"
                value={data.account_id}
                onChange={(e) => setData('account_id', e.target.value)}
              >
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name}
                  </option>
                ))}
              </select>
              <select
                className="block mt-1"
                value={data.category_id}
                onChange={(e) => setData('category_id', e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <TextInput
                label="Valor"
                type="number"
                value={data.transaction_amount}
                onChange={(e) => setData('transaction_amount', e.target.value)}
                className="block mt-1"
              />
              <TextInput
                label="Descrição"
                value={data.transaction_description}
                onChange={(e) => setData('transaction_description', e.target.value)}
                className="block mt-1"
              />
              <select
                className="block mt-1"
                value={data.transaction_type}
                onChange={(e) => setData('transaction_type', e.target.value)}
              >
                <option value="income">Receita</option>
                <option value="expense">Despesa</option>
              </select>
              <PrimaryButton className="mt-2">Salvar</PrimaryButton>
            </form>
          )}

          {/* Lista de Transações */}
          <ul className="mt-4">
            {transactions.map((transaction) => (
              <li key={transaction.id}>
                {transaction.description} - {transaction.amount} ({transaction.type})
                <button onClick={() => handleDeleteTransaction(transaction.id)} className="text-red-500 ml-2">
                  Excluir
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

FinancialDashboard.propTypes = {
  auth: PropTypes.object.isRequired,
  accounts: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  transactions: PropTypes.array.isRequired,
};

export default FinancialDashboard;
