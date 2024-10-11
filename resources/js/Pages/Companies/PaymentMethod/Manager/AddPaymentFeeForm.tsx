import React from 'react';
import { useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

interface AddPaymentFeeFormProps {
    paymentMethodId: number | null;
    onSuccess: () => void;
}

const AddPaymentFeeForm: React.FC<AddPaymentFeeFormProps> = ({ paymentMethodId, onSuccess }) => {
    const { data, setData, post, reset, errors } = useForm({
        installments: 1,
        fixed_fee: 0,
        percentage_fee: 0,
    });

    const handleAddFee = (e: React.FormEvent) => {
        e.preventDefault();
        if (!paymentMethodId) return; // Certifique-se de que o ID do método de pagamento está definido

        post(route('payment_method_fees.store'), {
            preserveScroll: true,
            data: { ...data, payment_method_id: paymentMethodId },
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
        <form onSubmit={handleAddFee} className="mt-4">
            <TextInput
                label="Número de Parcelas"
                id="installments"
                name="installments"
                type="number"
                value={data.installments}
                onChange={(e) => setData('installments', parseInt(e.target.value, 10))}
            />
            <TextInput
                label="Taxa Fixa (R$)"
                id="fixed_fee"
                name="fixed_fee"
                type="number"
                step="0.01"
                value={data.fixed_fee}
                onChange={(e) => setData('fixed_fee', parseFloat(e.target.value))}
            />
            <TextInput
                label="Taxa Percentual (%)"
                id="percentage_fee"
                name="percentage_fee"
                type="number"
                step="0.01"
                value={data.percentage_fee}
                onChange={(e) => setData('percentage_fee', parseFloat(e.target.value))}
            />
            <InputError message={errors.installments} className="mt-2" />
            <InputError message={errors.fixed_fee} className="mt-2" />
            <InputError message={errors.percentage_fee} className="mt-2" />
            <PrimaryButton type="submit" className="mt-2">Salvar Taxa</PrimaryButton>
        </form>
    );
};

export default AddPaymentFeeForm;
