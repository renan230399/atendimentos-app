import React, { useMemo, useState } from 'react';
import InputLabel from '@/Components/InputLabel';
import ReactPaginate from 'react-paginate';
import { format, parseISO, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale'; // Importando a localidade PT-BR para garantir que o formato seja brasileiro
import { FaCheckCircle, FaClock } from 'react-icons/fa';
import { FaExclamationTriangle } from "react-icons/fa";
import TransactionFilters from './TransactionForm/TransactionFilters';
import TransactionItem from './TransactionForm/TrasactionItem'; 
import Pagination from '@/Components/Pagination';
import {Account, Transaction, Category} from '../FinancialInterfaces';
const statusOptions = [
  { value: 'true', label: 'Realizada', icon: <FaCheckCircle className='text-green-500'/> },
  { value: 'false', label: 'Pendente', icon: <FaExclamationTriangle className='text-red-500' /> },
];
interface TreeNode {
  key: number;
  label: string;
  children: TreeNode[];
}
interface SelectedCategory {
  checked: boolean;
}
interface Option {
  icon: React.ReactNode; // Se for um componente React
  label: string;
}
// Função para verificar correspondência de categorias usando a estrutura de árvore
const isCategoryMatch = (
  transactionCategoryId: number, // Adicionando a tipagem para o ID da categoria da transação
  selectedCategories: number[],  // O array de categorias selecionadas
  categoryTree: TreeNode[]       // A árvore de categorias
): boolean => {
  const checkCategoryMatch = (categoryId: number, selectedCategories: number[]): boolean => {
    if (selectedCategories.includes(categoryId)) {
      return true; // Correspondência direta encontrada
    }

    const categoryNode = categoryTree.find(node => node.key === categoryId);
    if (categoryNode && categoryNode.children.length > 0) {
      return categoryNode.children.some(child => checkCategoryMatch(child.key, selectedCategories));
    }

    return false;
  };

  return checkCategoryMatch(transactionCategoryId, selectedCategories);
};
const getSelectedCategoryIds = (selectedCategories: { [key: string]: SelectedCategory }): number[] => {
  return Object.entries(selectedCategories)
    .filter(([, value]) => value.checked)
    .map(([key]) => parseInt(key, 10)); // Converte as chaves para inteiros
};

interface TransactionsListProps {
  transactions: {
    data: Transaction[];
  };
  handleOpenConfirmedTransactionPopup: (transaction: Transaction) => void;
  filters: {
    start_date: Date;
    end_date: Date;
  };
  accounts:Account[];
  categories:Category[];
}
// Função para renderizar as opções do Dropdown

const statusOptionTemplate = (option: Option) => {
  return (
    <div className="flex items-center">
      {option.icon}
      <span className="ml-2">{option.label}</span>
    </div>
  );
};

// Função para renderizar o valor selecionado
const selectedStatusTemplate = (option: Option | null) => {
  if (option) {
    return (
      <div className="flex items-center">
        {option.icon}
        <span className="ml-2">{option.label}</span>
      </div>
    );
  }
  return <span>Selecione um status</span>;
};
// Função para definir a classe de borda com base no tipo de transação
const getTransactionBorderClass = (type: string) => {
  switch (type) {
    case 'income':
      return 'border-l-green-500 border-b-gray-200 my-1 rounded bg-white text-black';
    case 'expense':
      return 'border-l-red-500 border-b-red-200 my-1 rounded bg-white text-black';
    case 'transfer':
      return 'border-blue-500 bg-white';
    default:
      return '';
  }
};

// Função para definir a classe de borda com base no status e tipo de transação
const getStatusBorderClass = (statusTransaction: boolean, type: string) => {
  if (statusTransaction === true) {
    switch (type) {
      case 'income':
        return 'border-l-green-500 rounded-md bg-green-500 text-white text-center mr-3';
      case 'expense':
        return 'border-red-500 rounded-md bg-red-500 text-white text-center mr-3';
      case 'transfer':
        return 'border-yellow-500 bg-yellow-500';
      default:
        return '';
    }
  } else {
    switch (type) {
      case 'income':
        return 'border-2 rounded-md bg-green-200 text-black-500 text-center mr-3';
      case 'expense':
        return 'border-2 rounded-md bg-red-300 text-white text-center mr-3';
      case 'transfer':
        return 'border-blue-500 bg-blue-500';
      default:
        return '';
    }
  }
};

const TransactionsList: React.FC<TransactionsListProps> = ({ transactions, handleOpenConfirmedTransactionPopup, filters, accounts='', categories='' }) => {
  // Estado para armazenar a data do filtro
  const [filterDate, setFilterDate] = useState<Date | null>(null); // Alterado para Date ou null
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<boolean | null>(null);
  const [filterAccountIds, setFilterAccountIds] = useState<number[]>([]);
  const [filterCategory, setFilterCategory] = useState<number[]>([]);
  const groupedCategories = categories;

  // Estado para paginação
  const [currentPage, setCurrentPage] = useState(0);
  const transactionsPerPage = 50;
  const offset = currentPage * transactionsPerPage;

  // Função para alterar a página
  const handlePageClick = (data: { selected: number }) => {
    setCurrentPage(data.selected);
  };
    // Lista de IDs das transações cujos fluxos de caixa estão sendo exibidos
    const [openTransactions, setOpenTransactions] = useState<number[]>([]);
  
 // Função para abrir/fechar fluxos de caixa
 const toggleTransactionDetails = (transactionId: number) => {
  setOpenTransactions((prevState) => {
    if (prevState.includes(transactionId)) {
      return prevState.filter(id => id !== transactionId); // Remove se já estiver na lista
    } else {
      return [...prevState, transactionId]; // Adiciona à lista
    }
  });
};
  // Ordenar transações por data
  const sortedTransactions = transactions.data.sort((a, b) => {
    return new Date(a.transaction_date).getTime() - new Date(b.transaction_date).getTime();
  });

  const filteredTransactions = useMemo(() => {  
    //const selectedCategoryIds = getSelectedCategoryIds(filterCategory); // Converte as categorias selecionadas para uma lista de IDs
  
    return sortedTransactions
      .filter((transaction) => {  
        // Filtrar por data
        if (filterDate) {
          const transactionDate = format(parseISO(transaction.transaction_date), 'yyyy-MM-dd');
          const selectedDate = format(new Date(filterDate), 'yyyy-MM-dd', { locale: ptBR });
          if (transactionDate !== selectedDate) return false;
        }
  
        // Filtrar por tipo de transação
        if (filterType && transaction.type !== filterType) {
          return false;
        }
  
        // Filtrar por status da transação
        // Filtrar por status da transação
        if (filterStatus !== null && String(transaction.status) !== String(filterStatus)) {
          return false;
        }

  
        // Filtragem de categorias usando a lista de IDs selecionados
        if (Array.isArray(groupedCategories)) {
          // Certifique-se de que `groupedCategories` seja um array antes de passar para `isCategoryMatch`
          /*if (!selectedCategoryIds.includes(0) && !isCategoryMatch(transaction.category_id, selectedCategoryIds, groupedCategories)) {
            return false;
          }*/
        }
        
  
        // Filtrar por IDs de contas, se houver contas selecionadas e "Todas as Contas" não estiver selecionada
        if (Array.isArray(filterAccountIds) && filterAccountIds.length > 0) {
          if (!filterAccountIds.includes(0) && !filterAccountIds.includes(transaction.account_id)) {
            return false;
          }
        }
  
        return true; // Se todos os filtros passarem, retorna true
      })
      .slice(offset, offset + transactionsPerPage) // Paginação
      .map((transaction) => {
        return (
      <div>
        {/*
          <TransactionItem
            key={transaction.id}
            transaction={transaction}
            accounts={accounts}
            categories={categories}
            handleOpenConfirmedTransactionPopup={handleOpenConfirmedTransactionPopup}
            toggleTransactionDetails={toggleTransactionDetails}
            openTransactions={openTransactions}
            getTransactionBorderClass={getTransactionBorderClass}
            getStatusBorderClass={getStatusBorderClass}
          />
       */ }
      </div>
    );
      });
  }, [sortedTransactions, filterDate, filterType, filterStatus, filterAccountIds, filterCategory, groupedCategories, offset, openTransactions]);
  


  // Contar páginas para a paginação
  const pageCount = Math.ceil(sortedTransactions.length / transactionsPerPage);

  return (
    <>
    {/*

      <TransactionFilters
        filterDate={filterDate}
        setFilterDate={setFilterDate}
        filterType={filterType}
        setFilterType={setFilterType}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        filterAccountIds={filterAccountIds}
        setFilterAccountIds={setFilterAccountIds}
        statusOptions={statusOptions}
        accounts={accounts}
        categories={groupedCategories}
        selectedStatusTemplate={selectedStatusTemplate}
        statusOptionTemplate={statusOptionTemplate}
      />
      <div className={`flex flex-wrap items-center mr-3 border-l-4 bg-sky-950 border-sky-950 text-white rounded shadow-xl`}>
        <span className="md:w-[8%] w-[50%] border-r border-gray-300 text-center h-[100%] font-semibold">
          Data
        </span>
      <span className="md:w-[10%] w-[50%] font-semibold text-center">
        Valor
      </span>
      <span className="md:w-[10%] w-[50%] font-semibold text-center">
        Conta/Caixa
      </span>
      <span className="md:w-[10%] w-[50%] font-semibold text-center">
        Categoria
      </span>

      <span className="md:w-[40%] w-[50%] font-semibold text-center">
        Descrição
      </span>

      <span className="md:w-[8%] w-[50%] font-semibold text-center">
        Status
      </span>

      <span className="md:w-[8%] w-[45%] m-auto text-center">
      
      </span>

      <span className="text-green-500 md:w-[3%]">
          -
      </span>

    </div>
      <div className="overflow-y-auto rounded h-[75%] w-full mb-4 border-gray-300 border-5 shadow-xl">

        {filteredTransactions?.length > 0 ? (
          filteredTransactions
        ) : (
          <div className="py-2 text-sm text-gray-500">Nenhuma transação encontrada</div>
        )}
      </div>

      <Pagination pageCount={pageCount} onPageChange={handlePageClick} />
  */}
    </>

 );
};

export default TransactionsList;
