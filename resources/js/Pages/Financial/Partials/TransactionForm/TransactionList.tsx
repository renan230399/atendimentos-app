import React from 'react';
import TransactionForm from '../TransactionForm';
import { Account } from '../TransactionsAdd';

interface TransactionListProps {
  transactions: any[];
  data: any;
  updateTransaction: (index: number, field: string, value: any) => void;
  accounts: Account[];
  errors: any;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, data, updateTransaction, accounts, errors }) => {
  return (
    <>
      {transactions.map((transaction, index) => (
        <TransactionForm
          key={index}
          index={index}
          data={{
            ...transaction,
            amount: data.amount,
            description: data.description,
          }}
          setData={(field, value) => updateTransaction(index, field, value)}
          accounts={accounts}
          errors={errors}
          dateDefault={data.transaction_date}
        />
      ))}
    </>
  );
};

export default TransactionList;
