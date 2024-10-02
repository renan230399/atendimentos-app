// TransactionsList.tsx
import React, { useMemo } from 'react';

// Tipagem dos dados
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

interface TransactionsListProps {
  transactions: {
    data: Transaction[];
  };
}

// Função para definir a classe de borda com base no tipo de transação
const getTransactionBorderClass = (type: string) => {
  switch (type) {
    case 'income':
      return 'border-green-500 my-1 shadow-lg rounded bg-white text-black';
    case 'expense':
      return 'border-red-500 bg-red-400 rounded shadow-lg text-gray-600';
    case 'transfer':
      return 'border-blue-500 bg-white';
    default:
      return '';
  }
};
// Função para definir a classe de borda com base no tipo de transação
const getStatusBorderClass = (statusTransaction: boolean, type:string) => {
    if(statusTransaction === true){
        switch (type) {
            case 'income':
              return 'border-green-500 rounded-md bg-green-500 text-white text-center mr-3';
            case 'expense':
              return 'border-red-500 rounded-md bg-red-500 text-white text-center mr-3';
            case 'transfer':
              return 'border-yellow-500 bg-yellow-500';
            default:
              return '';
          }
    }else{
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
const TransactionsList: React.FC<TransactionsListProps> = ({ transactions }) => {
  const filteredTransactions = useMemo(() => {
    return transactions?.data?.map((transaction) => {
      const borderClass = getTransactionBorderClass(transaction.type);
      const statusClass = getStatusBorderClass(transaction.status, transaction.type);

      return (
        <li
          key={transaction.id}
          className={`flex flex-wrap items-center border-l-4 border-b-2 ${borderClass}`}
        >
            <span className='md:w-[9%] w-[50%] bg-gray-100 text-center h-[100%] py-1 text-black'>
                {new Date(transaction.transaction_date).toLocaleDateString('pt-BR')}
            </span>
            <span className='md:w-[11%] w-[50%] font-semibold  text-center'>
                {(Number(transaction.amount) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
            <span className="text-center w-[100%] md:w-[60%] m-auto md:text-left">
                {transaction.description || 'Sem descrição'}
                {transaction.related && (
                <>
                    {' '} de: {transaction.related.patient?.patient_name || transaction.related?.description}
                </>
                )}
            </span>
            <span className={`md:w-[8%] w-[45%] ${statusClass}`}>
                {transaction.status === true ? 'Realizada' : 'Pendente'}
            </span>
            <span className="md:w-[8%] w-[45%] m-auto border text-center">
                <button>Executar transação</button>
            </span>
            
        </li>
      );
    });
  }, [transactions]);

  return (
    <ul className="mt-4 overflow-y-auto max-h-[70%] text-white rounded">
      {filteredTransactions?.length > 0 ? (
        filteredTransactions
      ) : (
        <li className="py-2 text-sm text-gray-500">Nenhuma transação encontrada</li>
      )}
    </ul>
  );
};

export default TransactionsList;
