import React from 'react';
import { useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

interface AddPaymentMethodFormProps {
    onSuccess: () => void;
}

const AddPaymentMethodForm: React.FC<AddPaymentMethodFormProps> = ({ onSuccess }) => {
    const { data, setData, post, reset, errors } = useForm({
        name: '',
        type: '',
    });

    const handleAddPaymentMethod = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('payment_methods.store'), {
            preserveScroll: true,
            onSuccess: () => {
                onSuccess();
                reset();
            },
            onError: (err) => {
                console.error('Erro ao cadastrar método de pagamento:', err);
            },
        });
    };

    return (
        <form onSubmit={handleAddPaymentMethod} className="mt-4">
            <TextInput
                label="Nome do Método de Pagamento"
                id="name"
                name="name"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
            />
            <select
                value={data.type}
                onChange={(e) => setData('type', e.target.value)}
                id="type"
                name="type"
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
                <option value="">Selecione o Tipo</option>
                <option value="credit_card">Cartão de Crédito</option>
                <option value="debit_card">Cartão de Débito</option>
                <option value="cash">Dinheiro</option>
                <option value="bank_transfer">Transferência Bancária</option>
            </select>
            <InputError message={errors.name} className="mt-2" />
            <InputError message={errors.type} className="mt-2" />
            <PrimaryButton type="submit" className="mt-2">Salvar</PrimaryButton>
        </form>
    );
};

export default AddPaymentMethodForm;
