import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { PlusCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

interface Account {
  id: number;
  name: string;
  type: string;
  balance: number;
}

interface AccountsManagerProps {
  accounts: Account[];
}

const AccountsManager: React.FC<AccountsManagerProps> = ({ accounts }) => {
  const { data, setData, post, reset, errors } = useForm({
    name: '',
    type: 'bank',
    balance: '',  // Adicionando o campo balance
  });

  const [isAddingAccount, setIsAddingAccount] = useState(false);

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('accounts.store'), {
      preserveScroll: true,
      onSuccess: () => {
        setIsAddingAccount(false);
        reset();
      },
      onError: (err) => {
        console.error('Erro ao cadastrar conta:', err);
      },
    });
  };

  return (

    <div className="bg-white shadow rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-700">Caixas</h2>

   
      <ul className="mt-4 divide-y divide-gray-200">
        {accounts.map((account) => (
          <li key={account.id} className="py-2 flex justify-between text-left">
            <span className="font-semibold text-gray-700">
                {account.name}
                <p className="text-gray-500">{account.type}</p>
            </span>
            <span className="text-gray-500"></span>
            <span className="text-gray-700">{account.balance}</span>
          </li>
        ))}
      </ul>
      <div className="flex justify-between items-center">
        <PrimaryButton onClick={() => setIsAddingAccount(!isAddingAccount)} className="flex items-center">
          {isAddingAccount ? (
            <>
              <XCircleIcon className="h-5 w-5 mr-1" /> Cancelar
            </>
          ) : (
            <>
              <PlusCircleIcon className="h-5 w-5 mr-1" /> Novo Caixa
            </>
          )}
        </PrimaryButton>
      </div>
      {isAddingAccount && (
        <form onSubmit={handleAddAccount} className="mt-4 text-left">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome da conta</label>

              <TextInput
                label="Nome da Conta"
                id="name"
                name="name"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
              />
          </div>
          <div>
          <label className="block text-sm font-medium text-gray-700">Tipo</label>

          <select
            value={data.type}
            onChange={(e) => setData('type', e.target.value)}
            id="type"
            name="type"
            className="block w-full mt-1 mb-3 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="bank">Banco</option>
            <option value="cash">Caixa</option>
            <option value="investment">Investimento</option>
          </select>
          </div>


          {/* Campo Balance */}
          <label className="block text-sm font-medium text-gray-700 mb-0">Valor inicial</label>
          <TextInput
            label="Saldo Inicial"
            id="balance"
            name="balance"
            type="number"
            value={data.balance}
            onChange={(e) => setData('balance', e.target.value)}
            className="mt-4"
          />

          <InputError message={errors.name} className="mt-2" />
          <InputError message={errors.type} className="mt-2" />
          <InputError message={errors.balance} className="mt-2" />
          
          <PrimaryButton type="submit" className="mt-2">Salvar</PrimaryButton>
        </form>
      )}
    </div>
  );
};

export default AccountsManager;
