import React, { useState, memo, useEffect } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import TransactionForm from './TransactionsForm';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useFetchTransactionsData } from '@/Pages/Financial/hooks/useFetchTransactionsData';
import PriceInput from '@/Components/PriceInput';
import { Order, Account } from '../interfaces';
interface Transaction {
    amount: number;
    description: string;
    account_id: string | number;
    transaction_date: string;
    status: boolean;
  }
  
  interface TransactionsAddProps {
    accounts?: Account[]; // Opcional, pois pode ser preenchido pela API
    logo: string;
    order: Order; // Ajuste o caminho para o tipo de 'Order'
  }
  
  interface FormState {
    category_id: number;
    type: string;
    total_amount: number;
    dateDefault: string;
    transactions: Transaction[];
  }
  
const TransactionsAdd: React.FC<TransactionsAddProps> = ({
  accounts: accountsProp,
  logo = '',
  order,
}) => {
  const { accounts, loading, error } = useFetchTransactionsData(accountsProp);
  
  const { data, setData, post, reset, errors } = useForm<FormState>({
    category_id: 3,
    type: 'expense',
    total_amount: 0,
    dateDefault: new Date().toISOString().split('T')[0], // Define a data atual no formato YYYY-MM-DD
    transactions: [
      {
        amount: 0,
        description: '',
        account_id: '',
        transaction_date: '',
        status: false,
      },
    ],
  });

  useEffect(() => {
    if (order) {
      setData('total_amount', order.total_amount);
      console.log(order);
    }
  }, [order, setData]);

  const [selectedDate, setSelectedDate] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      amount: 0,
      description: '',
      account_id: '',
      transaction_date: '',
      status: false,
    },
  ]);
  
  const handleFormChange = (field: keyof FormState, value: any) => {
    // Se o campo for 'category_id', faz parse do valor como número
    const newValue = field === 'category_id' ? parseInt(value as string, 10) : value;
  
    // Se o campo não for relacionado a 'transactions', atualiza diretamente o form
    if (field !== 'transactions') {
      setData(field, newValue);
    }
  
    // Se você estiver tentando alterar algo dentro de 'transactions', precisa de uma função específica
    if (field === 'transactions') {
      const newTransactions = data.transactions.map((transaction, index) => {
        const date = new Date(newValue as string);
        date.setMonth(date.getMonth() + index);
        return {
          ...transaction,
          transaction_date: date.toISOString().split('T')[0],
        };
      });
  
      setData('transactions', newTransactions);
      setSelectedDate(newValue as string);
    }
  };
  
  
  
  
  

  const handleMultipleTransactions = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(1, parseInt(e.target.value, 10));
  
    const newTransactions = Array.from({ length: value }).map(() => ({
      amount: 0,
      description: '', // Adicionando a descrição
      account_id: '',  // Adicionando o account_id
      transaction_date: '',
      status: false,
    }));
  
    setTransactions(newTransactions);
    setData('transactions', newTransactions);
  };
  

  const renderTransactionForms = () => {
    return data.transactions.map((transaction, index) => (
      <TransactionForm
        key={index}
        index={index}
        data={data}
        setData={(field: string, value: any) => updateTransaction(index, field, value)} // Defina os tipos dos parâmetros
        accounts={accounts}
        errors={errors}
        dateDefault={selectedDate}
      />
    ));
};


  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('transactions.store'), {
      onSuccess: () => reset(),
      onError: (error) => console.log('Error editing', error),
    });
  };

  const updateTransaction = (index: number, field: string, value: any) => {
    const updatedTransactions = transactions.map((transaction, i) =>
      i === index ? { ...transaction, [field]: value } : transaction
    );
    setTransactions(updatedTransactions);
  };

  return (
    <form onSubmit={handleAddTransaction} className="mt-4 space-y-4">
      <div className="flex flex-wrap gap-3 w-full">
        <div className="w-[27%] items-center justify-center m-auto">
          <img src={logo} alt="logo da empresa" className="m-auto w-[80%]" />
        </div>

        <div className="w-[68%] flex flex-wrap m-auto">
          <PriceInput
            id="total_amount"
            label="Valor total (R$)"
            value={data.total_amount.toString()} // Certifique-se de converter para string
            onChange={(newValue) => handleFormChange('total_amount', parseInt(newValue, 10) || 0)} // Converte a string para número em centavos

            required={true}
            error={errors.total_amount}
            readOnly={true}
          />
          <div className="m-auto">
            <InputLabel htmlFor="transaction_date" value="Data da Transação" />
            <TextInput
              id="transaction_date"
              required
              type="date"
              value={selectedDate}
              onChange={(e) => handleFormChange('dateDefault', e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="m-auto">
            <InputLabel htmlFor="months" value="Quantos meses?" />
            <TextInput
              id="months"
              required
              type="number"
              value={transactions.length}
              onChange={handleMultipleTransactions}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>


        </div>

        <div className="w-full flex flex-wrap">{renderTransactionForms()}</div>
      </div>

      <PrimaryButton type="submit" className="mt-2">
        {'Salvar'}
      </PrimaryButton>
    </form>
  );
};

export default memo(TransactionsAdd);
