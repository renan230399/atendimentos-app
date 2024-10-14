import React from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import CustomSelect from '@/Components/CustomSelect';
import Dinero from 'dinero.js';
import { format } from 'date-fns';

// Definição das opções de status com ícones
const statusOptions = [
  { value: '1', label: 'Realizada', icon: <span className="text-green-500">✔</span> },
  { value: '0', label: 'Pendente', icon: <span className="text-red-500">⏳</span> },
];

// Função para formatar o valor em R$
const formatPrice = (value) => {
  const price = Dinero({ amount: value || 0, currency: 'BRL' });
  return price.toFormat('$0,0.00');
};

const TransactionForm = ({ index, data, setData, accounts, errors, dateDefault }) => {
  //console.log('Data recebida pelo componente TransactionForm:', data);

  return (
    <div className="mt-4 flex flex-wrap gap-2 shadow-xl rounded-xl border w-[98%] m-auto">
      <div className="w-[100%] text-center">
        <h3 className="text-lg font-semibold rounded-t-xl bg-blue-600 text-white">Transação {index + 1}</h3>
      </div>

      {/* Seção de Valor */}
      <div className="md:w-[15%] m-auto">
        <InputLabel htmlFor={`price-${index}`} value="Valor (R$)" />
        <div className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-100 p-2">
          {formatPrice(data.amount)}
        </div>
        <InputError message={errors?.amount} className="mt-2" />
      </div>

      {/* Seção de Data da Transação para cada transação no array */}
      <div className="md:w-[15%] m-auto">
        <InputLabel htmlFor={`transaction_date-${index}`} value={`Data da Transação (${index + 1})`} />
        <div className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-100 p-2">
        {data.transactions && data.transactions[index] && data.transactions[index].transaction_date 
  ? data.transactions[index].transaction_date.split('-').reverse().join('/')
  : '-'}
        </div>
        <InputError message={errors?.transaction_date} className="mt-2" />
      </div>

      {/* Seção de Descrição */}
      <div className="w-full md:w-[30%] ">
        <InputLabel htmlFor={`description-${index}`} value="Descrição" />
        <div className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-100 p-2">
          {data.description || 'Sem descrição'}
        </div>
      </div>

      {/* Seção de Conta */}
      <div className="md:w-[30%] w-[80%] m-auto hidden">
        <InputLabel htmlFor={`account_id-${index}`} value="Conta" />
        <div className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-100 p-2">
          {accounts.find(account => account.id === data.account_id)?.name || 'Conta não selecionada'}
        </div>
        <InputError message={errors?.account_id} className="mt-2" />


      </div>
      <div className="md:w-[30%] w-[80%] m-auto text-center">
        {/* Seção de Status */}
        <InputLabel htmlFor={`status-${index}`} value="Status" />
        <CustomSelect
          options={statusOptions}
          value={data.transactions && data.transactions[index]?.status ? '1' : '0'}
          onChange={(value) => setData(index, 'status', value === '1')}
          placeholder="Selecione o status"

        />
        <InputError message={errors?.status} className="mt-2" />
      </div>
    </div>
  );
};

export default TransactionForm;
