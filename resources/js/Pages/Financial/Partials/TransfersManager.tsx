import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { PlusCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

interface Account {
  id: number;
  name: string;
}

interface Transfer {
  id: number;
  from_account_id: number;
  to_account_id: number;
  amount: number;
  transfer_date: string;
  description: string;
}

interface TransfersManagerProps {
  accounts: Account[];
  transfers?: Transfer[];  // Deixando transfers opcional
}

const TransfersManager: React.FC<TransfersManagerProps> = ({ accounts, transfers = [] }) => {
  const { data, setData, post, reset, errors } = useForm({
    from_account_id: '',
    to_account_id: '',
    amount: '',
    transfer_date: '',
    description: '',
  });

  const [isAddingTransfer, setIsAddingTransfer] = useState(false);

  const handleAddTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('transfers.store'), {
      preserveScroll: true,
      onSuccess: () => {
        setIsAddingTransfer(false);
        reset();
      },
      onError: (err) => {
        console.error('Erro ao cadastrar transferência:', err);
      },
    });
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-700">Gerenciar Transferências</h2>
        <PrimaryButton onClick={() => setIsAddingTransfer(!isAddingTransfer)} className="flex items-center">
          {isAddingTransfer ? (
            <>
              <XCircleIcon className="h-5 w-5 mr-1" /> Cancelar
            </>
          ) : (
            <>
              <PlusCircleIcon className="h-5 w-5 mr-1" /> Adicionar Transferência
            </>
          )}
        </PrimaryButton>
      </div>
      {isAddingTransfer && (
        <form onSubmit={handleAddTransfer} className="mt-4">
          <select
            value={data.from_account_id}
            onChange={(e) => setData('from_account_id', e.target.value)}
            id="from_account_id"
            name="from_account_id"
            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Selecione a Conta de Origem</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </select>

          <select
            value={data.to_account_id}
            onChange={(e) => setData('to_account_id', e.target.value)}
            id="to_account_id"
            name="to_account_id"
            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Selecione a Conta de Destino</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </select>

          <TextInput
            label="Valor da Transferência"
            id="amount"
            name="amount"
            type="number"
            value={data.amount}
            onChange={(e) => setData('amount', e.target.value)}
            className="mt-4"
          />

          <TextInput
            label="Data da Transferência"
            id="transfer_date"
            name="transfer_date"
            type="date"
            value={data.transfer_date}
            onChange={(e) => setData('transfer_date', e.target.value)}
            className="mt-4"
          />

          <TextInput
            label="Descrição"
            id="description"
            name="description"
            value={data.description}
            onChange={(e) => setData('description', e.target.value)}
            className="mt-4"
          />

          <InputError message={errors.from_account_id} className="mt-2" />
          <InputError message={errors.to_account_id} className="mt-2" />
          <InputError message={errors.amount} className="mt-2" />
          <InputError message={errors.transfer_date} className="mt-2" />
          
          <PrimaryButton type="submit" className="mt-2">Salvar</PrimaryButton>
        </form>
      )}

      <ul className="mt-4 divide-y divide-gray-200">
        {transfers.map((transfer) => (
          <li key={transfer.id} className="py-2">
            <span className="font-semibold text-gray-700">
              {accounts.find(a => a.id === transfer.from_account_id)?.name} para {accounts.find(a => a.id === transfer.to_account_id)?.name}
            </span>{' '}
            - {transfer.amount} - {transfer.transfer_date}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransfersManager;
