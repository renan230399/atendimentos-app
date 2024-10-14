import React from 'react';
import InputLabel from '@/Components/InputLabel';
import AccountSelector from '@/Pages/Financial/Partials/TransactionForm/Partials/AccountSelector';
import PriceInput from '@/Components/PriceInput';
import CustomDropdown from '@/Components/CustomDropdown';
import { Account } from '../interfaces';

// Definição das opções de status com ícones
const statusOptions = [
    { value: true, label: 'Realizada', icon: <span className="text-green-500">✔</span> },
    { value: false, label: 'Pendente', icon: <span className="text-red-500">⏳</span> },
];

// Definindo a interface para as props do componente TransactionForm
interface TransactionFormProps {
    index: number;
    data: {
        transactions: {
            amount: number;
            transaction_date: string;
            status: boolean;
            account_id: string | number;
        }[];
    };
    setData: (field: string, value: any) => void;
    accounts: Account[]; // Tipagem das contas
    errors: { [key: string]: string }; // Ajuste para o tipo de errors

    dateDefault: string; // Tipagem para a data padrão
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
        <>
            <div className="w-[100%] text-center">
                <h3 className="text-lg font-semibold rounded-t-xl bg-blue-600 text-white">
                    {index + 1}° Parcela
                </h3>
            </div>
            <div className="flex px-1 flex-wrap shadow-xl rounded-xl border w-[98%] m-auto">
                <div className="md:w-[20%] m-auto">
                    <PriceInput
                        id={`total_amount-${index}`}
                        label="Valor da parcela (R$)"
                        value={String(data.transactions[index].amount)}
                        onChange={(newValue) => {
                            const updatedTransactions = [...data.transactions];
                            updatedTransactions[index].amount = parseFloat(newValue);
                            setData('transactions', updatedTransactions);
                        }}
                        required={true}
                    />
                </div>

                <div className="md:w-[15%] m-auto">
                    <InputLabel htmlFor={`transaction_date-${index}`} value="Data" />
                    <div className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-100 p-2">
                        {data.transactions[index].transaction_date
                            ? data.transactions[index].transaction_date.split('-').reverse().join('/')
                            : '-'}
                    </div>
                </div>

                <div className="w-[20%] m-auto">
                    <CustomDropdown
                        id={`status-${index}`}
                        label="Status"
                        value={data.transactions[index].status}
                        onChange={(value) => {
                            const updatedTransactions = [...data.transactions];
                            updatedTransactions[index].status = value;
                            setData('transactions', updatedTransactions);
                        }}
                        options={statusOptions}
                        error={errors?.status}
                    />
                </div>

                <div className="w-[20%] m-auto">
                    {data.transactions[index].status && (
                        <div className="w-[20%] m-auto">
                            {data.transactions[index].status && (
                                <AccountSelector
                                accounts={accounts}
                                value={String(data.transactions[index].account_id)} // Converte account_id para string
                                onChange={(value) => {
                                    const updatedTransactions = [...data.transactions];
                                    updatedTransactions[index].account_id = value;
                                    setData('transactions', updatedTransactions);
                                }}
                                error={errors?.account_id}
                                />
                            )}
                            </div>

                    )}
                </div>
            </div>
        </>
    );
};

export default TransactionForm;
