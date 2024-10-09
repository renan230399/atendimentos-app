import React, { useState, useEffect, useCallback, Suspense } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import TransactionsList from './TransactionsList';
import PopupComponent from '@/Layouts/PopupComponent';
import ConfirmedTransaction from './ConfirmedTransaction';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import InputLabel from '@/Components/InputLabel';
import { format, setHours, setMinutes, setSeconds } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Registra o locale para o DatePicker
registerLocale('pt-BR', ptBR);

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
  transaction_date: string;
  related?: {
    name?: string;
    description?: string;
  };
  status: boolean;
}

interface TransactionsManagerProps {
  accounts: Account[];
  categories: Category[];
  auth: {
    user: {
      name: string;
      email: string;
      company?: {
        company_logo?: string;
      };
    };
  };
}

const getCurrentMonthDates = (year = new Date().getFullYear(), month = new Date().getMonth()) => {
  const firstDay = new Date(year, month, 2);  // Primeiro dia do mês
  const lastDay = new Date(year, month + 1, 0);  // Último dia do mês
  // Usando `date-fns` para formatar as datas em 'yyyy-MM-dd'
  return {
    firstDay: format(firstDay, 'yyyy-MM-dd'),
    lastDay: format(lastDay, 'yyyy-MM-dd'),
  };
};


const TransactionsManager: React.FC<TransactionsManagerProps> = ({ accounts, categories, auth }) => {
  const { firstDay, lastDay } = getCurrentMonthDates();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [filters, setFilters] = useState({
    start_date: new Date(firstDay),
    end_date: new Date(lastDay),
  });
  
  const adjustDateToStartOfDay = (date: Date) => {
    return setHours(setMinutes(setSeconds(date, 0), 0), 0);
  };
  const [loading, setLoading] = useState(false);
  const [popupParams, setPopupParams] = useState<{ clientX: number; clientY: number; classPopup: string } | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isConfirmedTransactionPopupOpen, setIsConfirmedTransactionPopupOpen] = useState(false);


  {/* Lógica do popup */}
  const handleOpenConfirmedTransactionPopup = useCallback((e: React.MouseEvent, transaction: Transaction) => {
    setPopupParams({
      clientX: e.clientX,
      clientY: e.clientY,
      classPopup: 'h-auto bg-white w-[80vw]',
    });
    setIsConfirmedTransactionPopupOpen(true);
    setSelectedTransaction(transaction);
  }, []);
  const handleCloseConfirmedTransactionPopup = useCallback(() => {
    setIsConfirmedTransactionPopupOpen(false);
  }, []);

  // Função para buscar todas as transações
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {

        // Converte diretamente o objeto Date para o formato ISO antes de enviá-lo
// Ajuste as datas antes de formatar
const startDateFormatted = format((filters.start_date), 'yyyy-MM-dd');
const endDateFormatted = format((filters.end_date), 'yyyy-MM-dd');
console.log(filters.start_date, '-' ,startDateFormatted );
// Criação da URL de busca usando as datas ajustadas
const fetchUrl = `/transactions/filter?start_date=${startDateFormatted}&end_date=${endDateFormatted}`;
        


        const response = await fetch(fetchUrl, {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setTransactions(data.transactions);
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTransactions();
  }, [filters]);

  const handleFilterTransactions = () => {
    fetchTransactions(); // Busca os dados com os filtros atuais
  };

  // Somar o total de despesas e receitas
  const totalExpenses = transactions.reduce((sum, transaction) => {
    return transaction.type === 'expense' ? sum + transaction.amount : sum;
  }, 0);

  const totalConfirmedExpenses = transactions.reduce((sum, transaction) => {
    return transaction.type === 'expense' && transaction.status === true ? sum + transaction.amount : sum;
  }, 0);

  const totalConfirmedIncome = transactions.reduce((sum, transaction) => {
    return transaction.type === 'income' && transaction.status === true ? sum + transaction.amount : sum;
  }, 0);

  const totalIncome = transactions.reduce((sum, transaction) => {
    return transaction.type === 'income' ? sum + transaction.amount : sum;
  }, 0);

  return (
    <div className="px-0 h-[94vh]">
      
      {/* Filtros de Data */}
      <div className="flex flex-wrap space-x-4 h-[17vh]">
        <div className="w-[34%] flex flex-wrap">
          <div className="w-full pb-4">
          <InputLabel value='Intervalo de datas'/>
          <DatePicker
              selected={filters.start_date}
              onChange={(dates) => {
                const [start, end] = dates as [Date | null, Date | null];
                setFilters({
                  ...filters,
                  start_date: start ? new Date(start) : null, 
                  end_date: end ? new Date(end) : null,
                });
              }}
              startDate={filters.start_date}
              endDate={filters.end_date}
              selectsRange
              monthsShown={2}
              locale="pt-BR"  // Define o locale corretamente
              
              placeholderText="Selecione um intervalo de datas"
              dateFormat="dd/MM/yyyy"
              withPortal
              className="w-full h-12 py-2 text-md border rounded-lg"
            />
            <PrimaryButton onClick={handleFilterTransactions} className="h-10 bg-green-500 hover:bg-green-700 focus:bg-green-500">
              {loading ? 'Carregando...' : 'Filtrar'}
            </PrimaryButton>
            
          </div>
        </div>

        {/* Mostrar o total de despesas e receitas */}
        <div className="flex w-[64%] m-auto">
          <div className="bg-white px-4 rounded-md border-b mx-3 border-gray-300 text-center w-[48%]">
            <h2 className="text-lg font-semibold mb-3">Despesas:</h2>
            <div className="flex">
              <div className="w-[60%]">
                <p className="text-sm text-gray-600">Já gasto</p>
                <p className="text-2xl font-bold text-red-500">
                  {(Number(totalConfirmedExpenses) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
              </div>
              <div className="w-[40%]">
                <p className="text-sm text-gray-600">Previsto</p>
                <p className="text-xl font-bold text-red-400">
                  {(Number(totalExpenses) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white h-auto px-4 rounded border-b mx-3 border-gray-300 text-center w-[48%] text-left">
            <h2 className="text-lg font-semibold mb-3">Receitas:</h2>
            <div className="flex">
              <div className="w-[60%]">
                <p className="text-sm text-gray-600">Já faturado</p>
                <p className="text-2xl font-bold text-green-500">
                  {(Number(totalConfirmedIncome) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
              </div>
              <div className="w-[40%]">
                <p className="text-sm text-gray-600">Previsto</p>
                <p className="text-xl font-bold text-green-400">
                  {(Number(totalIncome) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-[65vh] py-0 my-0 border-black">
        <TransactionsList transactions={{ data: transactions }} handleOpenConfirmedTransactionPopup={handleOpenConfirmedTransactionPopup} filters={filters} accounts={accounts} categories={categories}/>
      </div>

      {/* Lazy loading do popup */}
      {isConfirmedTransactionPopupOpen && (
        <Suspense fallback={<div>Carregando popup...</div>}>
          <PopupComponent
            id="confirmed_transation"
            zindex="120"
            paddingTop="100px"
            paddingLeft="100px"
            params={popupParams}
            classPopup='bg-white w-[60vw] h-[70vh] resize'
            onClose={handleCloseConfirmedTransactionPopup}
    
          >
            <ConfirmedTransaction transaction={selectedTransaction} accounts={accounts} logo={auth.user.company?.company_logo ? (auth.user.company.company_logo):('')}/>
          </PopupComponent>
        </Suspense>
      )}
    </div>
  );
};

export default TransactionsManager;
