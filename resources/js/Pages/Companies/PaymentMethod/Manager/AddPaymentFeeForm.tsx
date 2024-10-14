import React from 'react';
import { useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PriceInput from '@/Components/PriceInput';
import InputLabel from '@/Components/InputLabel';
interface AddPaymentFeeFormProps {
    paymentMethodId: number | null;
    onSuccess: () => void;
}

const AddPaymentFeeForm: React.FC<AddPaymentFeeFormProps> = ({ paymentMethodId, onSuccess }) => {
    const { data, setData, post, reset, errors } = useForm({
        payment_method_id: paymentMethodId,
        installments: 1,
        fixed_fee: '0', // Agora armazenamos como string para trabalhar em centavos
        percentage_fee: 0,
    });

    const handleAddFee = (e: React.FormEvent) => {
        e.preventDefault();
        if (!paymentMethodId) return; // Certifique-se de que o ID do método de pagamento está definido

        // Converta o valor de fixed_fee para centavos
        const feeInCents = parseInt(data.fixed_fee, 10) || 0;

        // Envie o valor correto para o servidor
        post(route('payment_method_fees.store'), {
            preserveScroll: true,
            data: {
                ...data,
                fixed_fee: feeInCents, // Enviando o valor em centavos
                payment_method_id: paymentMethodId,
            },
            onSuccess: () => {
                onSuccess();
                reset();
            },
            onError: (err) => {
                console.error('Erro ao cadastrar taxa:', err);
            },
        });
    };

    const handleFixedFeeChange = (value: string) => {
        setData('fixed_fee', value); // Armazena o valor em centavos como string
    };

    return (
        <form onSubmit={handleAddFee} className="flex flex-wrap">
            <div className='m-auto'>
                <InputLabel value='Número de parcelas' />
                <TextInput
                    label="Número de Parcelas"
                    id="installments"
                    name="installments"
                    type="number"
                    value={data.installments}
                    onChange={(e) => setData('installments', parseInt(e.target.value, 10))}
                />
            </div>
            <div className='m-auto'>
                <InputLabel value='Taxa Fixa (R$)' />
                <PriceInput
                    id="fixed_fee"
                    value={data.fixed_fee} // Passa o valor em centavos
                    onChange={handleFixedFeeChange} // Lida com a mudança do valor em centavos
                    required={true}
                    error={errors.fixed_fee}
                />
            </div>

            <div className='m-auto'>
                <InputLabel value='Taxa Porc (%)' />
                <TextInput
                    label="Taxa Percentual (%)"
                    id="percentage_fee"
                    name="percentage_fee"
                    type="number"
                    step="0.01"
                    value={data.percentage_fee}
                    onChange={(e) => setData('percentage_fee', parseFloat(e.target.value))}
                />
            </div>
            <div className='w-full mt-2 flex flex-col'>
            <InputError message={errors.installments} className="m-auto" />
            <InputError message={errors.fixed_fee} className="m-auto" />
            <InputError message={errors.percentage_fee} className="m-auto" />
            <PrimaryButton type="button" onClick={handleAddFee} className="m-auto bg-green-500 hover:bg-green-700">Salvar Taxa</PrimaryButton>
            </div>

        </form>
    );
};

export default AddPaymentFeeForm;
