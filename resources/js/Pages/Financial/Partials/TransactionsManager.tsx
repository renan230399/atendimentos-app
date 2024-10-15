import React, { useState, useEffect, useCallback, Suspense } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import TransactionsList from './TransactionsList';
import PopupComponent from '@/Layouts/PopupComponent';
import ConfirmedTransaction from './ConfirmedTransaction';
//import DatePicker from 'react-datepicker';
//import 'react-datepicker/dist/react-datepicker.css';
import InputLabel from '@/Components/InputLabel';
import { format, setHours, setMinutes, setSeconds } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {Account, Transaction, Category, PaymentMethod, PaymentMethodsFee} from '../FinancialInterfaces';
import { Sidebar } from 'primereact/sidebar';

// Registra o locale para o DatePicker
//registerLocale('pt-BR', ptBR);


interface TransactionsManagerProps {
  accounts: Account[];
  categories: Category[];
  paymentMethods:PaymentMethod[];
  paymentMethodsFees:PaymentMethodsFee[];
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


const TransactionsManager: React.FC<TransactionsManagerProps> = ({ accounts, categories, auth, paymentMethods, paymentMethodsFees }) => {
  const { firstDay, lastDay } = getCurrentMonthDates();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  const [filters, setFilters] = useState<{
      start_date: Date | null;
      end_date: Date | null;
  }>({
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
  const handleOpenConfirmedTransactionPopup = useCallback((transaction: Transaction) => {
    setIsConfirmedTransactionPopupOpen(true);
    setSelectedTransaction(transaction);
  }, []);


  // Função para buscar todas as transações
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {

        // Converte diretamente o objeto Date para o formato ISO antes de enviá-lo
// Ajuste as datas antes de formatar
const startDateFormatted = filters.start_date ? format(filters.start_date, 'yyyy-MM-dd') : '';
const endDateFormatted = filters.end_date ? format(filters.end_date, 'yyyy-MM-dd') : '';

const startDate = filters.start_date || new Date(); // Define uma data padrão caso seja null
const endDate = filters.end_date || new Date(); // Define uma data padrão caso seja null

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
    <div className="px-0 h-screen">
      
      {/* Filtros de Data */}
      <div className="flex flex-wrap space-x-4 mt-0 pt-0 h-[10%]">
        <div className="w-[34%] flex flex-wrap">
          <div className="w-full pb-4">
          <InputLabel value='Intervalo de datas'/>
          {/*<DatePicker
              selected={filters.start_date}
              onChange={(dates) => {
                const [start, end] = dates as [Date | null, Date | null]; // Garantimos que dates pode ser Date ou null
                setFilters({
                    ...filters,
                    start_date: start ? new Date(start) : null, // Define como null se start for null
                    end_date: end ? new Date(end) : null, // Define como null se end for null
                });
            }}
              startDate={filters.start_date || undefined}  // Converte null para undefined
              endDate={filters.end_date || undefined}   
              selectsRange
              monthsShown={2}
              locale="pt-BR"  // Define o locale corretamente
              
              placeholderText="Selecione um intervalo de datas"
              dateFormat="dd/MM/yyyy"
              withPortal
              className="w-full h-12 py-2 text-md border rounded-lg"
            />*/}
            <PrimaryButton onClick={handleFilterTransactions} className="hidden h-10 bg-green-500 hover:bg-green-700 focus:bg-green-500">
              {loading ? 'Carregando...' : 'Filtrar'}
            </PrimaryButton>
            
          </div>
        </div>

        {/* Mostrar o total de despesas e receitas */}
        <div className="flex w-[64%]">
          <div className="bg-white px-4 rounded-md mx-3 text-center w-[48%]">
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

          <div className="bg-white h-auto px-4 rounded mx-3 text-center w-[48%]">
            <h2 className="text-lg font-semibold">Receitas:</h2>
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

      <div className="h-[75%] py-0 mt-3 border-black">
        <TransactionsList 
          transactions={{ data: transactions }} 
          handleOpenConfirmedTransactionPopup={handleOpenConfirmedTransactionPopup} 
          filters={{
            start_date: filters.start_date || new Date(), // Valor padrão se for null
            end_date: filters.end_date || new Date(),     // Valor padrão se for null
            // Outros filtros
          }}          
          accounts={accounts} 
          categories={categories}
        />
      </div>




 
      {/* Lazy loading do popup */}
          <Sidebar 
                visible={isConfirmedTransactionPopupOpen} 
                position="right" 
                className='pt-0 xl:w-[65vw] md:w-[65vw] sm:w-[75vw] overflow-auto bg-white' 
                onHide={() => setIsConfirmedTransactionPopupOpen(false)}>
                          <Suspense fallback={<div>Carregando popup...</div>}>

                        <ConfirmedTransaction 
                          transaction={selectedTransaction} 
                          accounts={accounts} 
                          logo={auth.user.company?.company_logo ? (auth.user.company.company_logo):('')}
                        />    
                          </Suspense>
  
              </Sidebar>  
 
    </div>
  );
};

export default TransactionsManager;
