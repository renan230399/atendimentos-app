import React, { useState, memo, useEffect } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TransactionForm from './TransactionForm';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import Dinero from 'dinero.js';

interface Account {
  id: number;
  name: string;
  type: string;
}

interface Category {
  id: number;
  name: string;
  type: string; // Tipo de transação: 'income' ou 'expense'
}

interface TransactionsAddProps {
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
  accounts,
  categories,
  loading,
  errors,
  logo = '',
}) => {
  const { data, setData, post, reset } = useForm({
    category_id: '',
    type: '',
    amount: 0,
    description: '',
    account_id: '',
    transactions: [
      {
        transaction_date: '',
        status: false,
      },
    ],
  });
  // Adicione este useEffect para rastrear mudanças no estado do data
useEffect(() => {
  console.log('Estado do data atualizado:', data);
}, [data]);

  
  // Novo estado para gerenciar o valor do select diretamente
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedDate, setSelectedDate] = useState('');


  const [transactions, setTransactions] = useState([{ transaction_date: '', status: false }]);
  const [isFixedExpenses, setIsFixedExpenses] = useState(false);

  const formatPrice = (value: number) => {
    const price = Dinero({ amount: value || 0, currency: 'BRL' });
    return price.toFormat('$0,0.00'); // Formata em R$
  };


// Função para atualizar os campos gerais do formulário
// Função para atualizar os campos gerais do formulário
const handleFormChange = (field: string, value: any) => {
  const newValue = field === 'account_id' || field === 'category_id' ? parseInt(value, 10) : value;
  setData(field, newValue);

  // Atualizar a lista de transações apenas se o campo 'transaction_date' for alterado
  if (field === 'transaction_date' && newValue) {
    const newTransactions = data.transactions.map((transaction, index) => {
      const date = new Date(newValue);
      date.setMonth(date.getMonth() + index); // Adiciona meses conforme o índice
      return {
        ...transaction,
        transaction_date: date.toISOString().split('T')[0], // Formato 'YYYY-MM-DD'
      };
    });

    // Atualiza o estado de transações no formulário e o estado local
    setData('transactions', newTransactions);
    setSelectedDate(newValue); // Mova esta linha para fora do loop
  }
};





  const handleMultipleTransactions = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(1, parseInt(e.target.value, 10));
    
    // Cria um novo array de transações com a quantidade especificada
    const newTransactions = Array.from({ length: value }).map(() => ({
      transaction_date: '',
      status: false,
    }));
  
    // Atualiza o estado local de transactions
    setTransactions(newTransactions);
  
    // Atualiza o estado do useForm com as novas transações
    setData('transactions', newTransactions);
  };
  

  const renderTransactionForms = () => {
    return data.transactions.map((transaction, index) => (
      <TransactionForm
        key={index}
        index={index}
        data={data}
        setData={(index, field, value) => updateTransaction(index, field, value)}
        accounts={accounts}
        errors={errors}
        dateDefault={selectedDate}
      />
    ));
  };
  

  const handleAddTransaction = (e: React.FormEvent) => {

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
  const handleCategorySelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = parseInt(e.target.value, 10);
    setSelectedCategoryId(categoryId);

    // Encontra a categoria selecionada com base no ID
    const selectedCategory = categories.find((category) => category.id === categoryId);
  
    // Atualiza todos os campos relevantes de uma só vez
    setData({
      ...data, // Mantém o estado atual de data
      category_id: categoryId,
      type: selectedCategory ? selectedCategory.type : '', // Atualiza o campo 'type' se a categoria for encontrada
    });
  
    // Verifica se é uma despesa fixa (categoria com ID igual a 4)
    const isFixed = categoryId === 4;
    setIsFixedExpenses(isFixed);
    /*handleMultipleTransactions({
      target: { value: '1' }
    } as React.ChangeEvent<HTMLInputElement>);*/
  };
  
  return (
    <form onSubmit={handleAddTransaction} className="mt-4 space-y-4">
      <div className="flex flex-wrap gap-3 w-full">
        <div className="w-[27%] items-center justify-center m-auto">
          <img src={logo} alt="logo da empresa" className="m-auto w-[80%]" />
        </div>

        <div className="w-[68%] flex flex-wrap m-auto">
          <div className='w-[45%] m-auto mb-3'>
            <InputLabel htmlFor="category_id" value="Categoria" />
            <select
              id="category_id"
              required
              value={selectedCategoryId}
              onChange={handleCategorySelectChange}
              className="block w-full border-gray-300 rounded-md shadow-sm text-lg focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name} - {category.type === 'income' ? 'Receitas' : 'Despesas'}
                </option>
              ))}
            </select>

            <InputError message={errors.category_id} className="mt-2" />
          </div>

          <div className='w-[45%] m-auto mb-3'>
            <InputLabel htmlFor="account_id" value="Conta" />
            <select
              id="account_id"
              required
              value={data.account_id || ''}
              onChange={(e) => handleFormChange('account_id', e.target.value)}
              className="block w-full border-gray-300 rounded-md shadow-sm text-lg focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Selecione uma conta</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
            <InputError message={errors.account_id} className="mt-2" />
          </div>
          <div className=' m-auto'>
            <InputLabel htmlFor="amount" value="Valor (R$)" />
            <TextInput
              id="amount"
              required
              type="text"
              value={formatPrice(data.amount)}
              onChange={(e) => handleFormChange('amount', parseInt(e.target.value.replace(/\D/g, ''), 10))}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="R$ 0,00"
            />
          </div>
          <div className=' m-auto'>
            
          <InputLabel htmlFor="transaction_date" value="Data da Transação" />
          <TextInput
            id="transaction_date"
            required
            type="date"
            value={selectedDate}
            onChange={(e) => handleFormChange('transaction_date', e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          </div>
          <div className=' m-auto'>
            
            {isFixedExpenses && (
              <>
                <InputLabel htmlFor="months" value="Quantos meses?" />
                <TextInput
                  id="months"
                  required
                  type="number"
                  value={transactions.length}
                  onChange={handleMultipleTransactions}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </>
            )}
           
            </div>



          <div className='w-full' >
          <InputLabel htmlFor="description" value="Descrição" />
          <TextInput
            id="description"
            required
            type="text"
            value={data.description}
            onChange={(e) => handleFormChange('description', e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          </div>

        </div>

        <div className="w-full flex flex-wrap">{renderTransactionForms()}</div>
      </div>

      <PrimaryButton type="submit" className="mt-2" disabled={loading}>
        {loading ? 'Salvando...' : 'Salvar'}
      </PrimaryButton>
    </form>
  );
};

export default memo(TransactionsAdd);
