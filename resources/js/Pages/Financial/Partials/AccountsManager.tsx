import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { FaPlusCircle, FaTimesCircle, FaUniversity, FaMoneyBillWave, FaChartLine } from 'react-icons/fa'; // Importando ícones do react-icons
import Dinero from 'dinero.js'; // Importar Dinero.js corretamente

interface Account {
  id: number;
  name: string;
  type: string; // Pode ser 'bank', 'cash', ou 'investment'
  balance: number; // Representa o valor em centavos
}

interface AccountsManagerProps {
  accounts: Account[];
}

// Componente responsável por renderizar o ícone correto com base no tipo da conta
const AccountIcon: React.FC<{ type: string }> = ({ type }) => {
  let IconComponent;
  switch (type) {
    case 'bank':
      IconComponent = FaUniversity; // Ícone de banco (universidade simbolizando uma instituição financeira)
      break;
    case 'cash':
      IconComponent = FaMoneyBillWave; // Ícone de dinheiro
      break;
    case 'investment':
      IconComponent = FaChartLine; // Ícone de gráfico de investimento
      break;
    default:
      IconComponent = FaMoneyBillWave; // Ícone padrão
  }

  return <IconComponent className="h-6 w-6 text-gray-500" aria-hidden="true" />;
};

const AccountsManager: React.FC<AccountsManagerProps> = ({ accounts }) => {
  const { data, setData, post, reset, errors } = useForm({
    name: '',
    type: 'bank',
    balance: '', // Inicialmente, o valor é armazenado como string para manipulação no formato em reais
  });

  const [isAddingAccount, setIsAddingAccount] = useState(false);

  // Função para formatar os valores usando Dinero.js (de centavos para reais)
  const formatCurrency = (amount: number) => {
    // Garantir que o valor é um número inteiro válido
    const validAmount = Number.isInteger(amount) ? amount : 0; // Se não for inteiro, assume 0
    const dinero = Dinero({ amount: validAmount, currency: 'BRL' });
    return dinero.toFormat('$0,0.00'); // Formato em reais (R$)
  };

  // Função para converter valor inserido para centavos
  const handleBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove caracteres não numéricos
    const amountInCents = parseInt(value || '0'); // Converte para centavos
    setData('balance', amountInCents);
  };

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
      <div className="flex flex-wrap gap-5 mt-4">
        {accounts.map((account) => (
          <div key={account.id} className="md:w-[24%] w-[47%] text-left border rounded p-2 shadow-lg flex items-center">
            {/* Exibindo o ícone baseado na categoria do caixa */}
            <AccountIcon type={account.type} />

            <div className="ml-3">
              <div className="font-semibold text-gray-700">{account.name}</div>
              {/* Exibindo o saldo formatado em reais */}
              <div className="text-gray-700 text-xl">
                {(Number(account.balance) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-6">
        <PrimaryButton onClick={() => setIsAddingAccount(!isAddingAccount)} className="flex items-center">
          {isAddingAccount ? (
            <>
              <FaTimesCircle className="h-5 w-5 mr-1" /> Cancelar
            </>
          ) : (
            <>
              <FaPlusCircle className="h-5 w-5 mr-1" /> Novo Caixa
            </>
          )}
        </PrimaryButton>
      </div>

      {isAddingAccount && (
        <form onSubmit={handleAddAccount} className="mt-4 text-left flex gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome da conta</label>
            <TextInput
              id="name"
              name="name"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
            />
          </div>

          <div className="">
            <label className="block text-sm font-medium text-gray-700">Tipo</label>
            <select
              value={data.type}
              onChange={(e) => setData('type', e.target.value)}
              id="type"
              name="type"
              className="block w-full mb-3 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="bank">Banco</option>
              <option value="cash">Caixa</option>
              <option value="investment">Investimento</option>
            </select>
          </div>
          {/* Campo Balance (Valor inicial em reais) */}

          <div className=''>
          <label className="block text-sm font-medium text-gray-700">Valor inicial (R$)</label>
          
          <TextInput
            id="balance"
            name="balance"
            type="text"
            value={data.balance ? formatCurrency(Number(data.balance)) : ''} // Exibe valor em reais
            onChange={handleBalanceChange} // Converte para centavos ao enviar
          />
          </div>
         

          <InputError message={errors.name} className="mt-2" />
          <InputError message={errors.type} className="mt-2" />
          <InputError message={errors.balance} className="mt-2" />

          <PrimaryButton type="submit" className="mt-2 bg-green-500 hover:bg-green-600">
            Cadastrar
          </PrimaryButton>
        </form>
      )}
    </div>
  );
};

export default AccountsManager;
