import React, { useMemo, useState } from 'react';
import InputLabel from '@/Components/InputLabel';
import ReactPaginate from 'react-paginate';
import { format, parseISO, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale'; // Importando a localidade PT-BR para garantir que o formato seja brasileiro
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCheckCircle, FaEye, FaClock } from 'react-icons/fa';
import { IoReturnUpBackOutline, IoReturnUpForward  } from "react-icons/io5";
import CustomSelect from '@/Components/CustomSelect'; // Certifique-se de que o caminho esteja correto
import { MultiSelect } from 'primereact/multiselect';


const statusOptions = [
  { value: '', label: 'Todos', icon: <FaClock /> },
  { value: 'true', label: 'Realizada', icon: <FaCheckCircle className='text-green-500'/> },
  { value: 'false', label: 'Pendente', icon: <FaClock /> },
];

interface Transaction {
  id: number;
  account_id: number;
  category_id: number;
  type: 'income' | 'expense' | 'transfer';
  amount: number;
  description: string;
  transaction_date: string;
  related?: {
    name?: string;
    description?: string;
  };
  status: boolean;
  cash_flow?: {
    balance_before: number;
    balance_after: number;
  };
}
interface Account {
  id: number;
  name: string;
}
interface TransactionsListProps {
  transactions: {
    data: Transaction[];
  };
  handleOpenConfirmedTransactionPopup: (e: React.MouseEvent, transaction: Transaction) => void;
  filters: {
    start_date: Date;
    end_date: Date;
  };
  accounts:Account[];

}

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

const TransactionsList: React.FC<TransactionsListProps> = ({ transactions, handleOpenConfirmedTransactionPopup, filters, accounts='' }) => {
  // Estado para armazenar a data do filtro
  const [filterDate, setFilterDate] = useState<Date | null>(null); // Alterado para Date ou null
  

  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<boolean | null>(null);
  const [filterAccountIds, setFilterAccountIds] = useState<number[]>([]);

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
        if (filterStatus !== null && transaction.status !== filterStatus) {
          return false;
        }
        // Filtrar por IDs de contas, se houver contas selecionadas e "Todas as Contas" não estiver selecionada
        if (Array.isArray(filterAccountIds) && filterAccountIds.length > 0) {
          // Se "Todas as Contas" estiver selecionada, não filtramos por conta
          if (!filterAccountIds.includes(0) && !filterAccountIds.includes(transaction.account_id)) {
              return false;
          }
        }




  
        return true; // Se todos os filtros passarem, retorna true
      })
      .slice(offset, offset + transactionsPerPage) // Paginação
      .map((transaction) => {
        const borderClass = getTransactionBorderClass(transaction.type);
        const statusClass = getStatusBorderClass(transaction.status, transaction.type);
        const transactionDate = new Date(transaction.transaction_date);
        const formattedDate = format(parseISO(transaction.transaction_date), 'dd/MM/yyyy');
        return (
          <div
            key={transaction.id}
            className={`flex flex-wrap items-center mr-3 border-b border-l-4 ${borderClass}`}
          >

            <span className="md:w-[8%] w-[50%] border-r border-gray-300 text-center h-[100%] py-1 text-black">
              {formattedDate}
            </span>
            <span className="md:w-[10%] w-[50%] font-semibold text-center">
              {(Number(transaction.amount) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
            <span className="md:w-[15%] w-[50%] font-semibold text-center">
              {accounts.find((account) => account.id === transaction.account_id)?.name || 'Conta não encontrada'}
            </span>

            <span className="text-center w-[100%] md:w-[40%] m-auto md:text-left">
              {transaction.description || 'Sem descrição'}
              {transaction.related && (
                <>
                  {' '} {transaction.related?.name || transaction.related?.description}
                </>
              )}
            </span>
            <span className={`md:w-[8%] w-[45%] ${statusClass}`}>
              {transaction.status === true ? 'Realizada' : 'Pendente'}
            </span>

            <span className="md:w-[8%] w-[45%] m-auto text-center">
            {!transaction.status ? (
              <button
                className="border rounded bg-blue-500 text-white p-1"
                onClick={(e) => handleOpenConfirmedTransactionPopup(e, transaction)}
              >
                Executar
              </button>
            ) : (
              <span className="md:w-[8%] w-[45%] text-center cursor-pointer">
                <div onClick={() => toggleTransactionDetails(transaction.id)}>
                  <FaEye className="text-blue-500 m-auto" />
                </div>
              </span>        
            )}
          </span>

          <span className="text-green-500 ">
                {!transaction.status ? (
                  <span>⏳</span>  
                ) : (
                  <FaCheckCircle />
                )}
              </span>
            {/* Exibição do cash flow relacionado, se a transação estiver no estado "openTransactions" */}
            {transaction.status && openTransactions.includes(transaction.id) && transaction.cash_flow && (
              <div className="bg-white p-4 mt-2 rounded w-full flex">
                <div className='m-auto'>
                  <IoReturnUpBackOutline className='m-auto text-red-500' size={30}/>
                  <InputLabel value='Saldo Antes'/>
                  <p>{(Number(transaction.cash_flow.balance_before) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                </div>
                <div className='m-auto'>
                  <IoReturnUpForward className='m-auto text-green-500' size={30}/>
                  <InputLabel value='Saldo Depois:'/>
                  <p>{(Number(transaction.cash_flow.balance_after) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                </div>

              </div>
            )}

          </div>


        );
      });
    }, [sortedTransactions, filterDate, filterType, filterStatus, filterAccountIds, offset, openTransactions]);

  // Contar páginas para a paginação
  const pageCount = Math.ceil(sortedTransactions.length / transactionsPerPage);

  return (
    <>
      <div className="mb-4 w-full pl-5 flex">
        <div className='m-auto'>
        <InputLabel htmlFor="filter_date" className="w-full m-auto" value="Selecione um dos dias do intervalor" />
        <DatePicker
          id="filter_date"
          selected={filterDate}
          onChange={(date: Date | null) => setFilterDate(date)}
          minDate={filters.start_date}  // Define a data mínima
          maxDate={filters.end_date}    // Define a data máxima
          locale="pt-BR"

          isClearable
          placeholderText="Selecione uma data"
          dateFormat="dd/MM/yyyy"
          className="w-full p-2 border rounded"
        />
        </div>
{/* Filtro por Tipo de Transação */}
<div className='m-auto'>
    <InputLabel htmlFor="filter_type" value="Tipo de Transação" />
    <select
      id="filter_type"
      value={filterType || ''}
      onChange={(e) => setFilterType(e.target.value || null)}
      className="w-full p-2 border rounded"
    >
      <option value="">Todos</option>
      <option value="income">Receita</option>
      <option value="expense">Despesa</option>
      <option value="transfer">Transferência</option>
    </select>
  </div>

    {/* Filtro por Status */}
    <div className='m-auto'>
      <InputLabel htmlFor="filter_status" value="Status" />
      <CustomSelect
            options={statusOptions}
            value={filterStatus !== null ? (filterStatus ? 'true' : 'false') : ''}
            onChange={(value) => setFilterStatus(value !== '' ? value === 'true' : null)}
            placeholder="Selecione o status"
          />
    </div>

    {/* Filtro por Nome da Conta */}
    <div className='m-auto'>
    <InputLabel htmlFor="filter_account" value="Contas" />
    <MultiSelect
    value={filterAccountIds.includes(0) ? [0] : filterAccountIds}
    options={accounts.map(account => ({ label: account.name, value: account.id }))} // Apenas IDs são passados para o value
    onChange={(e) => {
        // Se "Todas as Contas" for selecionada, limpa as outras seleções
        if (e.value.includes(0)) {
            setFilterAccountIds([0]); // Marca apenas "Todas as Contas"
        } else {
            setFilterAccountIds(e.value); // Atualiza com os IDs das contas selecionadas
        }
        console.log('Contas Selecionadas (IDs):', e.value); // Verifica os IDs das contas selecionadas
    }}
    placeholder="Selecione Contas"
    className="w-full md:w-20rem bg-white border border-gray-600"
    maxSelectedLabels={3}
    display="chip"
/>



</div>

      </div>

      <div className="overflow-y-auto rounded h-[80%] w-full mb-6 border-gray-300 border-5 shadow-xl">
        {/* Lista de transações filtradas */}
        {filteredTransactions?.length > 0 ? (
          filteredTransactions
        ) : (
          <div className="py-2 text-sm text-gray-500">Nenhuma transação encontrada</div>
        )}
      </div>

      {/* Paginação */}
      <div className="flex justify-center ">
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
    </>
  );
};

export default TransactionsList;
