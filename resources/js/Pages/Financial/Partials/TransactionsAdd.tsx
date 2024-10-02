import React, { useState, memo } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TransactionForm from './TransactionForm'; 
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';

interface Account {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
}

interface TransactionsAddProps {
  data: {
    type: string; // Ajustei para string ao invés de booleano
    category_id: number;
    account_id: number;
    amount: number;
    description: string;
    transaction_date: string;
    status: boolean;
  };
  setData: (field: string, value: any) => void;
  accounts: Account[];
  categories: Category[];
  loading: boolean;
  errors: {
    account_id?: string;
    category_id?: string;
    amount?: string;
    transaction_date?: string;
    status?: string;
  };
}

const TransactionsAdd: React.FC<TransactionsAddProps> = ({
  data,
  setData,
  accounts,
  categories,
  loading,
  errors,
}) => {
  // Inicializa os campos obrigatórios para garantir que todas as transações contenham os dados necessários
  const initialTransactionData = {
    type: data.type || 'expense', 
    account_id: data.account_id || '',
    category_id: data.category_id || '',
    amount: data.amount || 0,
    description: data.description || '',
    transaction_date: data.transaction_date || new Date().toISOString().split('T')[0], // Data padrão
    status: data.status || false,
  };

  const [transactions, setTransactions] = useState([initialTransactionData]);
  const [isFixedExpenses, setIsFixedExpenses] = useState(false); // Para categoria "gastos fixos"
  const [dateDefault, setDateDefault] = useState(initialTransactionData.transaction_date);

  const { post, reset } = useForm({ transactions });

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateDefault(e.target.value); 
  };

  const handleMultipleTransactions = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(1, parseInt(e.target.value)); 
    const newTransactions = Array.from({ length: value }).map(() => ({
      ...initialTransactionData,
      transaction_date: dateDefault, 
    }));
    setTransactions(newTransactions);
  };

  const updateTransaction = (index: number, field: string, value: any) => {
    const updatedTransactions = transactions.map((transaction, i) =>
      i === index ? { ...transaction, [field]: value } : transaction
    );
    setTransactions(updatedTransactions);
  };

  const renderTransactionForms = () => {
    return transactions.map((transaction, index) => (
      <TransactionForm
        key={index}
        index={index}
        data={transaction}
        setData={(field, value) => updateTransaction(index, field, value)}
        accounts={accounts}
        errors={errors}
        dateDefault={dateDefault}
      />
    ));
  };

  // Função para adicionar uma nova transação
  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('transactions.store'), {
      transactions, 
      onSuccess: () => {
        reset(); 
        setTransactions([initialTransactionData]); 
      },
      onError: (errors) => {
        console.error('Erro ao cadastrar transação', errors);
      },
    });
  };

  const handleType = (category: number) => {
    setIsFixedExpenses(category === 4); 
  };

  return (
    <form onSubmit={handleAddTransaction} className="mt-4 space-y-4">
      <div className="flex flex-wrap gap-3 w-full">
        {/* Categoria */}
        <div className="w-[70%] m-auto">
          <InputLabel htmlFor="category_id" value="Categoria" />
          <select
            id="category_id"
            value={data.category_id}
            onChange={(e) => {
              const categoryId = parseInt(e.target.value, 10);
              setData('category_id', categoryId);
              handleType(categoryId);

              setTransactions([initialTransactionData]); 
            }}
            className="block w-full border-gray-300 rounded-md shadow-sm text-lg focus:ring-indigo-500 focus:border-indigo-500"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <InputError message={errors.category_id} className="mt-2" />

          {/* Tipo de Transação */}
          <InputLabel htmlFor="type" value="Tipo de Transação" />
          <select
            id="type"
            value={data.type} 
            onChange={(e) => setData('type', e.target.value)}
            className="block w-full border-gray-300 rounded-md shadow-sm text-lg focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="income">Receita</option>
            <option value="expense">Despesa</option>
            <option value="transfer">Transferência</option>
          </select>
        </div>

        {/* Se a categoria for "gastos fixos", mostre opções adicionais */}
        {isFixedExpenses && (
          <div className="md:w-[15%] w-[80%] m-auto">
            <InputLabel htmlFor="months" value="Quantos meses?" />
            <TextInput
              id="months"
              type="number"
              value={transactions.length}
              onChange={handleMultipleTransactions} 
              className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            <InputLabel htmlFor="date_default" value="Data Padrão" />
            <TextInput
              id="date_default"
              type="date"
              onChange={handleDateChange}
              value={dateDefault}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )}

        {/* Renderizar formulários de transações */}
        <div className="w-full flex flex-wrap pl-4">
          {renderTransactionForms()}
        </div>
      </div>

      <PrimaryButton type="submit" className="mt-2" disabled={loading}>
        {loading ? 'Salvando...' : 'Salvar'}
      </PrimaryButton>
    </form>
  );
};

export default memo(TransactionsAdd);
