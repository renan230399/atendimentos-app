import React, { useState, useEffect, useCallback } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import TransactionsList from './TransactionsList';
import InputLabel from '@/Components/InputLabel';
import ReactPaginate from 'react-paginate';

interface Account {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
}

interface Transaction {
  id: number;
  account_id: number;
  category_id: number;
  type: 'income' | 'expense' | 'transfer';
  amount: number;
  description: string;
  transaction_date: string; // Data em string
  related?: {
    name?: string;
    description?: string;
  };
  status: boolean;
}

const getCurrentMonthDates = () => {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
  return { firstDay, lastDay };
};

const TransactionsManager: React.FC = () => {
  const { firstDay, lastDay } = getCurrentMonthDates();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filters, setFilters] = useState({
    start_date: firstDay,
    end_date: lastDay,
  });
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const transactionsPerPage = 10;
  const offset = currentPage * transactionsPerPage;

  // Função para buscar todas as transações de uma só vez
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const fetchUrl = `/transactions/filter?start_date=${filters.start_date}&end_date=${filters.end_date}`;
      const response = await fetch(fetchUrl, {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const jsonString = JSON.stringify(data);  // Converte o objeto JSON em uma string
      const tamanhoEmBytes = new Blob([jsonString]).size;  // Estima o tamanho da string em bytes
      console.log(`Tamanho do JSON: ${tamanhoEmBytes} bytes`);
      setTransactions(data.transactions); // Carrega todas as transações de uma vez
      setAccounts(data.accounts);
      setCategories(data.categories);
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Carregar dados apenas quando o componente for montado
  useEffect(() => {
    fetchTransactions();
  }, []); // Dispara somente na montagem

  const handleFilterTransactions = () => {
    setCurrentPage(0); // Redefine para a primeira página ao aplicar filtros
    fetchTransactions(); // Busca os dados com os filtros atuais
  };

  const handlePageClick = (data: { selected: number }) => {
    setCurrentPage(data.selected);
  };

  // Ordenar transações por data antes de paginar
  const sortedTransactions = transactions.sort((a, b) => {
    return new Date(a.transaction_date).getTime() - new Date(b.transaction_date).getTime();
  });

  const currentTransactions = sortedTransactions.slice(offset, offset + transactionsPerPage);
  const pageCount = Math.ceil(sortedTransactions.length / transactionsPerPage);

  // Somar o total das despesas e receitas
  const totalExpenses = transactions.reduce((sum, transaction) => {
    return transaction.type === 'expense' ? sum + transaction.amount : sum;
  }, 0);

  const totalConfirmedExpenses = transactions.reduce((sum, transaction) => {
    return transaction.type === 'expense' && transaction.status === true
      ? sum + transaction.amount
      : sum;
  }, 0);

  const totalConfirmedIncome = transactions.reduce((sum, transaction) => {
    return transaction.type === 'income' && transaction.status === true
      ? sum + transaction.amount
      : sum;
  }, 0);

  const totalIncome = transactions.reduce((sum, transaction) => {
    return transaction.type === 'income' ? sum + transaction.amount : sum;
  }, 0);

  return (
    <div className="px-6 max-h-[120vh]">
      {/* Filtros de Data */}
      <div className="flex flex-wrap space-x-4">
        <div>
          <InputLabel htmlFor="start_date" value="Início" />
          <TextInput
            type="date"
            value={filters.start_date}
            onChange={(e) => setFilters({ ...filters, start_date: e.target.value })}
          />
        </div>
        <div>
          <InputLabel htmlFor="end_date" value="Fim" />
          <TextInput
            type="date"
            value={filters.end_date}
            onChange={(e) => setFilters({ ...filters, end_date: e.target.value })}
          />
        </div>

        <PrimaryButton onClick={handleFilterTransactions} className="mt-4 h-10">
          {loading ? 'Carregando...' : 'Filtrar'}
        </PrimaryButton>

        {/* Mostrar o total de despesas e receitas */}
        <div className="flex w-[50%]">
          <div className="bg-gray-100 px-4 rounded shadow-xl border mx-3 border-gray-300 text-center w-[48%]">
            <h2 className="text-lg font-semibold">Despesas:</h2>
            <p className="text-2xl font-bold text-red-500">
              {(Number(totalConfirmedExpenses) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
            <p className="text-sm text-gray-600">
              Previsto
            </p>
            <p className="text-xl font-bold text-red-400">
              {(Number(totalExpenses) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>

          <div className="bg-gray-100 px-4 rounded shadow-xl border mx-3 border-gray-300 text-center w-[48%]">
            <h2 className="text-lg font-semibold">Receitas:</h2>
            <p className="text-2xl font-bold text-green-500">
              {(Number(totalConfirmedIncome) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
            <p className="text-sm text-gray-600">
              Previsto
            </p>
            <p className="text-md font-bold text-green-400">
              {(Number(totalIncome) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>
        </div>
      </div>
      {/* Paginação */}
      <div className="mt-6 flex justify-center">
        <ReactPaginate
          previousLabel={'← Anterior'}
          nextLabel={'Próxima →'}
          pageCount={pageCount}
          onPageChange={handlePageClick}
          containerClassName={'pagination flex flex-wrap space-x-2 justify-center'}
          activeClassName={'active bg-blue-500 text-white px-3 py-1 rounded-md'}
          pageClassName={'page-item px-3 py-1 border rounded-md text-sm'}
          previousClassName={'page-item px-3 py-1 border rounded-md text-sm'}
          nextClassName={'page-item px-3 py-1 border rounded-md text-sm'}
          disabledClassName={'disabled opacity-50 cursor-not-allowed'}
        />
      </div>
      <div className="bg-white shadow rounded-lg max-h-[100vh] w-full">
        {/* Histórico de Transações */}
        <TransactionsList transactions={{ data: currentTransactions }} />
      </div>


    </div>
  );
};

export default TransactionsManager;
