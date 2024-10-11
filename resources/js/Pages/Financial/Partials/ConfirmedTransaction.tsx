import React, { useState, memo } from 'react';
import { useForm } from '@inertiajs/react'; // Use Inertia.js para submissão
import PriceInput from '@/Components/PriceInput';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import { FaCheckCircle, FaExclamationTriangle, FaExclamationCircle } from 'react-icons/fa';
import { Dropdown } from 'primereact/dropdown';
const statusOptions = [
    { value: 'true', label: 'Realizada', icon: <FaCheckCircle className='text-green-500'/> },
    { value: 'false', label: 'Pendente', icon: <FaExclamationTriangle className='text-red-500' /> },
  ];
interface Account {
    id: number;
    name: string;
    balance: number;
}

interface ConfirmedTransactionProps {
    transaction: {
        id: number;
        account_id: number;
        category_id: number;
        type: 'income' | 'expense' | 'transfer';
        amount: number;
        description: string;
        transaction_date: string;
        expected_date: string;
        related?: {
            name?: string;
            description?: string;
        };
        status: boolean;
    };
    accounts: Account[];
    logo: string;
}

const ConfirmedTransaction: React.FC<ConfirmedTransactionProps> = ({
    transaction,
    accounts,
    logo = '',
}) => {
    const { data, setData, put, errors, processing, reset } = useForm({
        account_id: transaction.account_id,
        category_id: transaction.category_id,
        type: transaction.type,
        amount: transaction.amount,
        description: transaction.description,
        transaction_date: transaction.transaction_date.split('T')[0], // Formato correto para o campo date
        expected_date: transaction.expected_date.split('T')[0], // Formato correto para o campo date

        related_name: transaction.related?.name || '',
        related_description: transaction.related?.description || '',
        status: transaction.status ? 'true' : 'false', // Armazena o status como '1' ou '0'
   
    });

    console.log(data);
    const handleSubmit = (e: React.FormEvent) => {

        put(route('transactions.update', transaction.id), {
            onSuccess: () => {
                reset(); // Reseta o formulário após o sucesso
                console.log('Transação atualizada com sucesso!');
            },
            onError: (errors) => {
                console.error('Erro ao atualizar transação', errors);
            },
        });
    };
// Função para renderizar as opções do Dropdown
const statusOptionTemplate = (option) => {
    return (
      <div className="flex items-center">
        {option.icon}
        <span className="ml-2">{option.label}</span>
      </div>
    );
  };
  
  // Função para renderizar o valor selecionado
  const selectedStatusTemplate = (option) => {
    if (option) {
      return (
        <div className="flex items-center">
          {option.icon}
          <span className="ml-2">{option.label}</span>
        </div>
      );
    }
    return <span>Selecione um status</span>;
  };
    return (
        <form onSubmit={handleSubmit} className="p-4 flex flex-wrap gap-6 m-auto">
            <div className='w-[32%]'>
                <img src={logo} alt="logo da empresa" className="h-auto w-52 m-auto" />
            </div>
            <div className='w-[62%] flex flex-wrap gap-2 m-auto'>
                <div className='w-[48%]'>
                    <InputLabel value="Valor" />
                    <PriceInput
                        id="amount"
                        label=""
                        value={String(data.amount)} // O valor deve ser passado como string
                        onChange={(newValue) => setData('amount', Number(newValue))} // Atualiza o valor
                        required={true}
                    />
                    {errors.amount && <InputError message={errors.amount} />}
                </div>
                <div className='w-[48%]'>
                    <InputLabel htmlFor={`transaction_date`} value="Data prevista" />
                    <input
                        type="date"
                        className="mt-1 block w-full border-gray-300 rounded"
                        value={data.transaction_date} // Remove a parte do tempo
                        onChange={(e) => setData('transaction_date', e.target.value)}
                    />
                    {errors.transaction_date && <InputError message={errors.transaction_date} />}
                </div>
                <div className='w-[48%]'>
                    <InputLabel htmlFor={`transaction_date`} value="Data da Transação" />
                    <input
                        type="date"
                        className="mt-1 block w-full border-gray-300 rounded"
                        value={data.expected_date} // Remove a parte do tempo
                        onChange={(e) => setData('expected_date', e.target.value)}
                    />
                    {errors.expected_date && <InputError message={errors.expected_date} />}
                </div>
                <div className='w-full'>
                    <InputLabel htmlFor={`account_id`} value="Conta" />
                    <select
                        id={`account_id`}
                        value={data.account_id}
                        onChange={(e) => setData('account_id', Number(e.target.value))}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    >
                        <option value=''>Selecione uma conta</option>
                        {accounts.map((account) => (
                            <option key={account.id} value={account.id}>
                                {account.name}
                            </option>
                        ))}
                    </select>
                    {errors.account_id && <InputError message={errors.account_id} />}
                </div>
            </div>
            <div className='w-full flex flex-wrap gap-2'>
                <div className='w-[60%]'>
                    <InputLabel value="Descrição da Transação" />
                    <textarea
                        className="mt-1 block w-full border-gray-300 rounded h-[100%] resize-none"
                        onChange={(e) => setData('description', e.target.value)}
                        readOnly={data?.category_id === 4 || data?.category_id === 2}
                        value={data.description}
                    />
                    {errors.description && <InputError message={errors.description} />}
                </div>
                <div className='w-[30%] m-auto'>
                    <InputLabel value="Status" />
                    <div className="relative m-auto">

                        <Dropdown
                            value={data.status}
                            onChange={(e) => setData('status', e.value || '')}
                            options={statusOptions}
                            placeholder="Selecione o status"
                            valueTemplate={selectedStatusTemplate}
                            itemTemplate={statusOptionTemplate}
                            className="w-full md:w-14rem border rounded border-gray-600"
                        />
                                </div>
                    {data.category_id === 1 && (
                        <>
                            <InputLabel htmlFor={`category_id`} value="Categoria" />
                            <input
                                type="number"
                                className="mt-1 block w-full border-gray-300 rounded"
                                value={data.category_id}
                                onChange={(e) => setData('category_id', Number(e.target.value))}
                            />
                        </>
                    )}
                </div>
            </div>
            <div className='w-full m-auto'>
                <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
                    disabled={processing}
                >
                    {processing ? 'Enviando...' : 'Confirmar Alterações'}
                </button>
            </div>
        </form>
    );
};

export default memo(ConfirmedTransaction);
