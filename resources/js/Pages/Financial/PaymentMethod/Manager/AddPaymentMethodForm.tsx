import React from 'react';
import { useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
interface AddPaymentMethodFormProps {
    account:number;
    setIsAddingPaymentMethod: () => void;
}

const AddPaymentMethodForm: React.FC<AddPaymentMethodFormProps> = ({ account,setIsAddingPaymentMethod }) => {
    const { data, setData, post, reset, errors } = useForm({
        account_id:account,
        name: '',
        type: '',
    });
console.log(account);
    const handleAddPaymentMethod = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(data);
        post(route('payment_methods.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setIsAddingPaymentMethod();
            },
            onError: (err) => {
                console.error('Erro ao cadastrar método de pagamento:', err);
            },
        });
    };

    return (
        <form onSubmit={handleAddPaymentMethod} className="mt-4 flex flex-wrap ">
            <div className='w-[35%] m-auto'>
                <InputLabel value='Nome do método de pagamento'/>
                <TextInput
                    id="name"
                    name="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                />
            </div>
            <div className='w-[60%] m-auto'>
            <InputLabel value='Categoria'/>

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
            </div>


            <InputError message={errors.name} className="mt-2" />
            <InputError message={errors.type} className="mt-2" />
            <PrimaryButton type="button" onClick={handleAddPaymentMethod} className="mt-2">Cadastrar Método</PrimaryButton>
        </form>
    );
};

export default AddPaymentMethodForm;
