import React, { useState, memo, useEffect } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TransactionForm from './TransactionForm';
import TextInput from '@/Components/TextInput';
import AccountSelector from './TransactionForm/Partials/AccountSelector';
import { useForm } from '@inertiajs/react';
import Dinero from 'dinero.js';
import CategoryTreeBuilder from '@/Components/Utils/CategoryTreeBuilder';
import { TreeSelect } from 'primereact/treeselect';
import { useFetchTransactionsData } from '../hooks/useFetchTransactionsData'; // Importar o hook da pasta 'hooks'
import {Account, Category} from '../FinancialInterfaces';
import { TreeSelectChangeEvent } from 'primereact/treeselect';
interface TransactionsAddProps {
  accounts?: Account[]; // Adicionei o "?" para indicar que pode ser opcional
  categories?: Category[]; // Adicionei o "?" para indicar que pode ser opcional
  logo: string;
}

const TransactionsAdd: React.FC<TransactionsAddProps> = ({
  accounts: accountsProp, // Renomeei para diferenciar do estado
  categories: categoriesProp, // Renomeei para diferenciar do estado
  logo = '',
}) => {
  // Usando o hook para buscar os dados caso não sejam passados como props
  const { accounts, categories, loading, error } = useFetchTransactionsData(accountsProp, categoriesProp);
  const { data, setData, post, reset, errors, } = useForm({
    category_id: '',
    type: '',
    amount: 0,
    description: '',
    account_id: '',
    transactions: [
      {
        transaction_date: '',
        expected_date: '',
        status: false,
      },
    ],
  });
 

  // Novo estado para gerenciar o valor do select diretamente
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [transactions, setTransactions] = useState([{ transaction_date: '', status: false }]);
  const formatPrice = (value: number) => {
    const price = Dinero({ amount: value || 0, currency: 'BRL' });
    return price.toFormat('$0,0.00'); // Formata em R$
  };

  // Função para atualizar os campos gerais do formulário
  const handleFormChange = (field: string, value: any) => {
    const newValue = field === 'account_id' || field === 'category_id' ? parseInt(value, 10) : value;

    // Atualiza o valor do campo usando setData
    //setData(field, newValue);

    // Atualizar a lista de transações se o campo 'transaction_date' for alterado
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
        setSelectedDate(newValue); // Isso está correto aqui
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
    //setData('transactions', newTransactions);
  };
  
/*
  const renderTransactionForms = () => {
    return data.transactions.map((transaction, index) => (
      <TransactionForm
        key={index}
        index={index}
        data={{
          ...transaction,  // Certifique-se de que 'transaction' contém todas as propriedades necessárias
          id: transaction.id || '', // Propriedade id obrigatória
          transaction_date: transaction.transaction_date || '', // Propriedade transaction_date obrigatória
          expected_date: transaction.expected_date || '', // Propriedade expected_date obrigatória
          status: transaction.status || false, // Propriedade status obrigatória
        }}
        setData={(field, value) => updateTransaction(index, field, value)}
        accounts={accounts}
        errors={errors}
        dateDefault={selectedDate}
      />
    ));
  };
  */

  

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

  const groupedCategories = CategoryTreeBuilder({ categories });
// Função para tratar a mudança de seleção no TreeSelect
const handleCategorySelectChange = (event: TreeSelectChangeEvent) => {/*
  // Verifique se o valor é uma string ou um TreeSelectSelectionKeysType e faça a conversão
  const selectedCategoryId = typeof event.value === 'string'
    ? event.value
    : String(event.value); // Converta para string se necessário

  setSelectedCategoryId(selectedCategoryId);

  // Verifica se as categorias estão definidas e encontra a categoria correspondente
  const selectedCategory = categories?.find((category) => category.id === selectedCategoryId);

  console.log("Categoria selecionada:", selectedCategoryId);

  // Atualiza o estado do formulário com a categoria e tipo
  setData({
    ...data,
    category_id: selectedCategoryId,
    type: selectedCategory?.type || '', // Atualiza o campo 'type' se a categoria for encontrada
  });*/
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
 
            <div className="card flex justify-content-center">
            <TreeSelect
              value={selectedCategoryId}
              onChange={handleCategorySelectChange}
              options={groupedCategories}
              className="md:w-20rem w-full border border-gray-300 rounded"
              selectionMode="single"
              placeholder="Selecione uma Categoria"
              display="chip"
            />
            </div>
            <InputError message={errors.category_id} className="mt-2" />
          </div>

            <AccountSelector
              accounts={accounts}
              value={data.account_id}
              onChange={(value) => handleFormChange('account_id', value)}
              error={errors.account_id}
            />
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

        <div className="w-full flex flex-wrap">{/*renderTransactionForms()*/}</div>
      </div>

      <PrimaryButton type="submit" className="mt-2" >
        {'Salvar'}
      </PrimaryButton>
    </form>
  );
};

export default memo(TransactionsAdd);
