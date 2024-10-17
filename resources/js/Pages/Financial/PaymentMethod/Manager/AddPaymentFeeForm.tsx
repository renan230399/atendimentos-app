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
        fixed_fee: '0',
        percentage_fee: 0,
    });

    const handleAddFee = (e: React.FormEvent) => {
        e.preventDefault();
    
        // Converte o valor de fixed_fee para centavos
        const feeInCents = parseInt(data.fixed_fee, 10) || 0;
    
        // Envie o valor correto para o servidor
        post(route('payment_method_fees.store'), {
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

    return (
        <form onSubmit={handleAddFee} className="flex flex-wrap">
            <div className='m-auto'>
                <InputLabel value='Número de parcelas' />
                <TextInput
                    id="installments"
                    name="installments"
                    type="number"
                    value={data.installments}
                    onChange={(e) => setData('installments', parseInt(e.target.value, 10))}
                />
                <InputError message={errors.installments} />
            </div>

            <div className='m-auto'>
                <InputLabel value='Taxa Fixa (R$)' />
                <PriceInput
                    id="fixed_fee"
                    label="Valor da parcela (R$)"
                    value={data.fixed_fee.toString()}
                    onChange={(newValue) => setData('fixed_fee', newValue)}
                    required={true}
                />
                <InputError message={errors.fixed_fee} />
            </div>

            <div className='m-auto'>
                <InputLabel value='Taxa Porc (%)' />
                <TextInput
                    id="percentage_fee"
                    name="percentage_fee"
                    type="number"
                    step="0.01"
                    value={data.percentage_fee}
                    onChange={(e) => setData('percentage_fee', parseFloat(e.target.value))}
                />
                <InputError message={errors.percentage_fee} />
            </div>

            <div className='w-full mt-2 flex flex-col'>
                <PrimaryButton type="submit" className="m-auto bg-green-500 hover:bg-green-700">Salvar Taxa</PrimaryButton>
            </div>
        </form>
    );
};

export default AddPaymentFeeForm;
