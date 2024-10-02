import React from 'react';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextArea from '@/Components/TextArea';
import Dinero from 'dinero.js'; // Importando corretamente Dinero.js v1.9.1

// Função para formatar o valor para exibição no input (exibido em reais)
const formatPrice = (value: number) => {
  const price = Dinero({ amount: value || 0, currency: 'BRL' });
  return price.toFormat('$0,0.00'); // Formata em R$
};

// Função para lidar com a mudança no campo de preço (valor em centavos)
const handlePriceChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  setData: (field: string, value: any) => void
) => {
  const value = e.target.value.replace(/\D/g, ''); // Remove caracteres não numéricos
  const amountInCents = parseInt(value || '0'); // Converte para centavos
  if (!isNaN(amountInCents)) {
    setData('amount', amountInCents); // Atualiza o valor no estado em centavos
  }
};

interface TransactionFormProps {
  index: number;
  data: {
    account_id: number;
    category_id: number;
    amount: number;
    description: string;
    transaction_date: string;
    status: boolean;
  };
  setData: (field: string, value: any) => void;
  accounts: Array<{ id: number; name: string }>;
  errors: {
    account_id?: string;
    amount?: string;
    transaction_date?: string;
    status?: string;
  };
  dateDefault: string;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  index,
  data,
  setData,
  accounts,
  errors,
  dateDefault,
}) => {
  return (
    <div className="mt-4 space-y-6 mt-6 flex flex-wrap gap-2 shadow-xl rounded p-4 border">
      <div className="w-[100%] text-center">
        <h3 className="text-lg font-semibold">Transação {index + 1}</h3>
      </div>

      {/* Valor */}
      <div className="md:w-[15%] m-auto">
        <InputLabel htmlFor={`price-${index}`} value="Valor (R$)" />
        <TextInput
          id={`price-${index}`}
          type="text"
          value={formatPrice(data.amount)} // Exibe o valor formatado em reais
          onChange={(e) => handlePriceChange(e, (field, value) => setData(field, value))}
          required
          className="mt-1 block w-full rounded-md border-gray-300 text-xl shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="R$ 0,00"
        />
        <InputError message={errors.amount} className="mt-2" />
      </div>

      {/* Data da Transação */}
      <div className="md:w-[20%] m-auto">
        <InputLabel htmlFor={`transaction_date-${index}`} value={`Data da Transação (${index + 1})`} />
        <TextInput
          id={`transaction_date-${index}`}
          type="date"
          value={data.transaction_date || dateDefault} // Usa a data padrão se a data da transação não estiver definida
          onChange={(e) => setData('transaction_date', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 text-xl shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
        <InputError message={errors.transaction_date} className="mt-2" />
      </div>

      {/* Descrição */}
      <div className="w-full md:w-[30%]">
        <InputLabel htmlFor={`description-${index}`} value="Descrição" />
        <TextArea
          id={`description-${index}`}
          value={data.description}
          onChange={(e) => setData('description', e.target.value)}
          placeholder="Opcional"
          className="w-full"
        />
      </div>

      {/* Conta */}
      <div className="md:w-[30%] w-[80%] m-auto">
        <InputLabel htmlFor={`account_id-${index}`} value="Conta" />
        <select
          id={`account_id-${index}`}
          value={data.account_id}
          onChange={(e) => setData('account_id', e.target.value)}
          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        >
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name}
            </option>
          ))}
        </select>
        <InputError message={errors.account_id} className="mt-2" />

        {/* Status */}
        <InputLabel htmlFor={`status-${index}`} value="Status" />
        <select
          id={`status-${index}`}
          value={data.status ? '1' : '0'} // Converte booleano para string para exibir corretamente
          onChange={(e) => setData('status', e.target.value === '1')} // Converte string de volta para booleano
          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="0">Pendente</option>
          <option value="1">Realizada</option>
        </select>
        <InputError message={errors.status} className="mt-2" />
      </div>
    </div>
  );
};

export default TransactionForm;
