import React from 'react';
import { FaCheckCircle, FaEye, FaExclamationTriangle } from 'react-icons/fa';
import { IoReturnUpBackOutline, IoReturnUpForward } from "react-icons/io5";
import InputLabel from '@/Components/InputLabel';
import { format, parseISO } from 'date-fns';
import {Transaction, Account, Category} from '../../FinancialInterfaces'


interface TransactionItemProps {
  transaction: Transaction;
  accounts: Account[];
  categories: Category[];
  handleOpenConfirmedTransactionPopup: (e: React.MouseEvent<HTMLButtonElement>, transaction: Transaction) => void;
  toggleTransactionDetails: (id: number) => void;
  openTransactions: number[];
  getTransactionBorderClass: (type: string) => string;
  getStatusBorderClass: (status: boolean, type: string) => string;
}

const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  accounts,
  categories,
  handleOpenConfirmedTransactionPopup,
  toggleTransactionDetails,
  openTransactions,
  getTransactionBorderClass,
  getStatusBorderClass
}) => {

  const borderClass = getTransactionBorderClass(transaction.type);
  const statusClass = getStatusBorderClass(transaction.status, transaction.type);
  const formattedDate = format(parseISO(transaction.transaction_date), 'dd/MM/yyyy');

  return (
    <div className={`flex flex-wrap items-center mr-3 border-b border-l-4 ${borderClass}`} key={transaction.id}>
      <span className="md:w-[8%] w-[50%] border-r border-gray-300 text-center h-[100%] py-1 text-black">
        {formattedDate}
      </span>
      <span className="md:w-[10%] w-[50%] font-semibold text-center">
        {(Number(transaction.amount) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
      </span>
      <span className="md:w-[10%] w-[50%] font-semibold text-center">
        {accounts.find((account) => account.id === transaction.account_id)?.name || ''}
      </span>
      <span className="md:w-[10%] w-[50%] font-semibold text-center">
        {categories.find((category) => category.id === transaction.category_id)?.name || 'Categoria não encontrada'}
      </span>
      <span
        className="text-center w-[100%] md:w-[40%] m-auto md:text-left whitespace-nowrap overflow-x-hidden text-ellipsis"
        style={{ textOverflow: 'ellipsis' }}
      >
        {transaction.description || 'Sem descrição'}
        {transaction.related && (
          <>
            {' '} {transaction.related?.patient?.patient_name || transaction.related?.description}
          </>
        )}
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
      <span className={`md:w-[8%] w-[45%] hidden ${statusClass}`}>
        {transaction.status ? 'Realizada' : 'Pendente'}
      </span>

      <span>
        {!transaction.status ? (
          <FaExclamationTriangle className="text-yellow-400 w-5 h-5"/>
        ) : (
          <FaCheckCircle className="text-green-500"/>
        )}
      </span>

      {transaction.status && openTransactions.includes(transaction.id) && transaction.cash_flow && (
        <div className="bg-gray-100 px-4 mt-2 rounded w-full flex">
          <div className='m-auto'>
            <IoReturnUpBackOutline className='m-auto text-red-500' size={30} />
            <InputLabel value='Saldo Antes' />
            <p>{(Number(transaction.cash_flow.balance_before) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
          </div>
          <div className='m-auto'>
            <IoReturnUpForward className='m-auto text-green-500' size={30} />
            <InputLabel value='Saldo Depois:' />
            <p>{(Number(transaction.cash_flow.balance_after) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
          </div>
          <div className='m-auto'>
            <IoReturnUpForward className='m-auto text-green-500' size={30} />
            <InputLabel value='Saldo Depois:' />
            <p>
              {format(parseISO(transaction.cash_flow.created_at), 'dd/MM/yyyy')}
              {' '}às{' '}
              {format(parseISO(transaction.cash_flow.created_at), 'HH:mm:ss')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionItem;
