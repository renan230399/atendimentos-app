import React, { useState, useCallback, useMemo } from 'react';
import { useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { PlusCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import Pagination from '@/Components/Pagination';

// Função para obter as datas de início e fim do mês atual
const getCurrentMonthDates = () => {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
  return { firstDay, lastDay };
};

// Função para definir a classe de borda com base no tipo de transação
const getTransactionBorderClass = (type: string) => {
  switch (type) {
    case 'income':
      return 'border-green-500 bg-green-500';
    case 'expense':
      return 'border-red-500 bg-red-500';
    case 'transfer':
      return 'border-yellow-500 bg-yellow-500';
    default:
      return '';
  }
};

interface Transaction {
  id: number;
  account_id: number;
  category_id: number;
  type: 'income' | 'expense' | 'transfer';
  amount: number;
  description: string;
  transaction_date: string;
}

interface Account {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
}

interface TransactionsManagerProps {
  transactions: Transaction[];
  accounts: Account[];
  categories: Category[];
  pagination: any; // Para lidar com a paginação vinda do backend
}

const TransactionsManager: React.FC<TransactionsManagerProps> = ({
  transactions,
  accounts,
  categories,
  pagination,
}) => {
  const { firstDay, lastDay } = getCurrentMonthDates();
  const { data, setData, post, reset, errors } = useForm({
    account_id: accounts.length > 0 ? accounts[0].id : '',
    category_id: categories.length > 0 ? categories[0].id : '',
    type: 'income',
    amount: 0,
    description: '',
    transaction_date: new Date().toISOString().split('T')[0],
    start_date: firstDay, // Data inicial padrão
    end_date: lastDay,    // Data final padrão
  });

  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  const [loading, setLoading] = useState(false);

  // Função para adicionar uma nova transação
  const handleAddTransaction = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    post(route('transactions.store'), {
      preserveScroll: true,
      onSuccess: () => {
        setIsAddingTransaction(false);
        reset({
          start_date: data.start_date,
          end_date: data.end_date,
        });
        setLoading(false);
      },
      onError: (err) => {
        console.error('Erro ao cadastrar transação:', err);
        setLoading(false);
      },
    });
  }, [data, post, reset]);

  // Função para filtrar as transações por data
  const handleFilterTransactions = useCallback(() => {
    post(route('transactions.filter'), {
      preserveScroll: true,
      only: ['transactions', 'pagination'],
      data: {
        start_date: data.start_date,
        end_date: data.end_date,
      },
    });
  }, [data, post]);

  // Memoize transactions to avoid unnecessary re-renders
  const filteredTransactions = useMemo(() => {
    return transactions?.data?.map((transaction) => {
      const borderClass = getTransactionBorderClass(transaction.type);
      return (
        <li
          key={transaction.id}
          className={`py-2 pl-4 flex justify-between items-center border-l-4 border-b ${borderClass}`}
        >
          <span className="font-semibold">{transaction.description || 'Sem descrição'}</span>
          <span className='pr-2'>
            {Number(transaction.amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} -{' '}
            {transaction.type === 'income' ? 'Receita' : transaction.type === 'expense' ? 'Despesa' : 'Transferência'}{' '}
            em {new Date(transaction.transaction_date).toLocaleDateString('pt-BR')}
          </span>
        </li>
      );
    });
  }, [transactions]);

  return (
    <div className="bg-white shadow rounded-lg p-6 h-[100vh]">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-700">Gerenciar Transações</h2>
        <PrimaryButton
          onClick={() => setIsAddingTransaction(!isAddingTransaction)}
          className="flex items-center bg-green-500"
        >
          {isAddingTransaction ? (
            <>
              <XCircleIcon className="h-5 w-5 mr-1" /> Cancelar
            </>
          ) : (
            <>
              <PlusCircleIcon className="h-5 w-5 mr-1" /> Adicionar Transação
            </>
          )}
        </PrimaryButton>
      </div>

      {/* Formulário de Adicionar Transação */}
      {isAddingTransaction && (
        <form onSubmit={handleAddTransaction} className="mt-4 space-y-4">
          <div className="flex flex-wrap gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tipo</label>
              <select
                value={data.type}
                onChange={(e) => setData('type', e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="income">Receita</option>
                <option value="expense">Despesa</option>
                <option value="transfer">Transferência</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Categoria</label>
              <select
                value={data.category_id}
                onChange={(e) => setData('category_id', e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Conta</label>
              <select
                value={data.account_id}
                onChange={(e) => setData('account_id', e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Valor (R$)</label>
              <TextInput
                label="Valor"
                type="number"
                value={data.amount}
                onChange={(e) => setData('amount', e.target.value)}
                min={0}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Descrição</label>
              <TextInput
                label="Descrição"
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
                placeholder="Opcional"
              />
            </div>
          </div>

          <TextInput
            label="Data da Transação"
            type="date"
            value={data.transaction_date}
            onChange={(e) => setData('transaction_date', e.target.value)}
          />

          <InputError message={errors.account_id} className="mt-2" />
          <InputError message={errors.category_id} className="mt-2" />
          <InputError message={errors.amount} className="mt-2" />
          <InputError message={errors.transaction_date} className="mt-2" />

          <PrimaryButton type="submit" className="mt-2">Salvar</PrimaryButton>
        </form>
      )}

      {/* Filtros de Data */}
      <div className="mt-6 flex space-x-4">
        <TextInput
          label="Data Inicial"
          type="date"
          value={data.start_date}
          onChange={(e) => setData('start_date', e.target.value)}
        />
        <TextInput
          label="Data Final"
          type="date"
          value={data.end_date}
          onChange={(e) => setData('end_date', e.target.value)}
        />
        <PrimaryButton onClick={handleFilterTransactions} className="mt-4">Filtrar</PrimaryButton>
      </div>

      {/* Histórico de Transações */}
      <ul className="mt-4 overflow-y-auto h-[70%] text-white rounded">
        {filteredTransactions?.length > 0 ? filteredTransactions : (
          <li className="py-2 text-sm text-gray-500">Nenhuma transação encontrada</li>
        )}
      </ul>

      {/* Paginação */}
      {pagination && pagination.meta && pagination.links ? (
        <Pagination meta={pagination.meta} links={pagination.links} />
      ) : (
        <p className="text-sm text-gray-500 mt-4">Nenhuma página a exibir</p>
      )}
    </div>
  );
};

export default TransactionsManager;
