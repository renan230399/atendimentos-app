// src/components/Manager/AddFeeControl.tsx
import React from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import AddPaymentFeeForm from './AddPaymentFeeForm';
import { PlusCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

interface AddFeeControlProps {
    isAddingFee: boolean;
    onToggleAddFee: () => void;
    paymentMethodId: number | null;
    onSuccess: () => void;
}

const AddFeeControl: React.FC<AddFeeControlProps> = ({ isAddingFee, onToggleAddFee, paymentMethodId, onSuccess }) => {
    return (
        <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-700">Adicionar Taxas ao Método de Pagamento</h3>
            <PrimaryButton onClick={onToggleAddFee} className="flex items-center mt-2">
                {isAddingFee ? (
                    <>
                        <XCircleIcon className="h-5 w-5 mr-1" /> Cancelar
                    </>
                ) : (
                    <>
                        <PlusCircleIcon className="h-5 w-5 mr-1" /> Adicionar Taxa
                    </>
                )}
            </PrimaryButton>

            {isAddingFee && paymentMethodId && (
                <AddPaymentFeeForm paymentMethodId={paymentMethodId} onSuccess={onSuccess} />
            )}
        </div>
    );
};

export default AddFeeControl;
