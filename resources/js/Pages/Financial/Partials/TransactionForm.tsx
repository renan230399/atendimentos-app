import React from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import CustomDropdown from '@/Components/CustomDropdown';
import Dinero from 'dinero.js';
import { Account, Transaction } from '../FinancialInterfaces'; // Importa as interfaces necessárias

// Definição das opções de status com ícones
const statusOptions = [
  { value: '1', label: 'Realizada', icon: <span className="text-green-500">✔</span> },
  { value: '0', label: 'Pendente', icon: <span className="text-red-500">⏳</span> },
];

// Função para formatar o valor em R$
const formatPrice = (value: number) => {
  const price = Dinero({ amount: value || 0, currency: 'BRL' });
  return price.toFormat('$0,0.00');
};

// Definindo as props para o componente
interface TransactionFormProps {
  index: number;
  data: Transaction; // Supondo que 'data' seja do tipo 'Transaction'
  setData: (key: string, value: any) => void; // Função para atualizar os dados
  accounts: Account[]; // Lista de contas
  errors: { [key: string]: string }; // Objeto de erros
  dateDefault: string; // Data padrão
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  index,
  data,
  setData,
  accounts,
  errors,
  dateDefault
}) => {
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

      {/* Seção de Data da Transação */}
      <div className="md:w-[15%] m-auto">
        <InputLabel htmlFor={`transaction_date-${index}`} value={`Data da Transação (${index + 1})`} />
        <div className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-100 p-2">
          {data.transaction_date ? data.transaction_date.split('-').reverse().join('/') : '-'}
        </div>
        <InputError message={errors?.transaction_date} className="mt-2" />
      </div>

      {/* Seção de Descrição */}
      <div className="w-full md:w-[30%]">
        <InputLabel htmlFor={`description-${index}`} value="Descrição" />
        <div className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-100 p-2">
          {data.description || 'Sem descrição'}
        </div>
      </div>

      {/* Seção de Conta */}
      <div className="md:w-[30%] w-[80%] m-auto">
        <InputLabel htmlFor={`account_id-${index}`} value="Conta" />
        <div className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-100 p-2">
          {accounts.find(account => account.id === data.account_id)?.name || 'Conta não selecionada'}
        </div>
        <InputError message={errors?.account_id} className="mt-2" />
      </div>

      {/* Seção de Status */}
      <div className="md:w-[30%] w-[80%] m-auto text-center">
        <InputLabel htmlFor={`status-${index}`} value="Status" />
        <CustomDropdown
          id={`status-${index}`}
          label="Status"
          value={data.status}
          onChange={(value) => {
            const updatedTransactions = [...data.transactions];
            updatedTransactions[index].status = value;
            setData('transactions', updatedTransactions);
          }}
          options={statusOptions}
          error={errors?.status}
        />
        <InputError message={errors?.status} className="mt-2" />
      </div>
    </div>
  );
};

export default TransactionForm;
