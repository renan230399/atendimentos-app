import React from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import { PlusCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

interface PaymentMethodControlsProps {
    isAddingPaymentMethod: boolean;
    onToggleAddMethod: () => void;
}

const PaymentMethodControls: React.FC<PaymentMethodControlsProps> = ({
    isAddingPaymentMethod,
    onToggleAddMethod,
}) => {
    return (
        <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-700">Gerenciar Métodos de Pagamento</h2>
            <PrimaryButton onClick={onToggleAddMethod} className="flex items-center">
                {isAddingPaymentMethod ? (
                    <>
                        <XCircleIcon className="h-5 w-5 mr-1" /> Cancelar
                    </>
                ) : (
                    <>
                        <PlusCircleIcon className="h-5 w-5 mr-1" /> Adicionar Método de Pagamento
                    </>
                )}
            </PrimaryButton>
        </div>
    );
};

export default PaymentMethodControls;
