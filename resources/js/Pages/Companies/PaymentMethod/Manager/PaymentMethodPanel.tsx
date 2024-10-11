import React from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import PaymentFeesTable from './PaymentFeesTable';

interface PaymentMethodFee {
    id: number;
    payment_method_id: number;
    installments: number;
    fixed_fee: number;
    percentage_fee: number;
}

interface PaymentMethodPanelProps {
    method: {
        id: number;
        name: string;
        type: string;
    };
    fees: PaymentMethodFee[];
    editedFees: Record<number, { fixed_fee: number; percentage_fee: number }>;
    handleFeeChange: (feeId: number, field: string, value: any) => void;
    isEditing: boolean;
    onEditToggle: () => void;
    onSave: () => void;
}

const PaymentMethodPanel: React.FC<PaymentMethodPanelProps> = ({
    method,
    fees,
    editedFees,
    handleFeeChange,
    isEditing,
    onEditToggle,
    onSave,
}) => {
    return (
        <div className="flex flex-column h-12rem">
            <div className="border-2 border-dashed w-full surface-border border-round surface-ground flex-wrap flex justify-content-center">
                <div className="flex justify-between w-full">
                    <PrimaryButton onClick={onEditToggle} className="ml-4">
                        {isEditing ? 'Salvar' : 'Editar'}
                    </PrimaryButton>
                    {isEditing && (
                        <PrimaryButton onClick={onSave} className="ml-4">
                            Confirmar
                        </PrimaryButton>
                    )}
                </div>

                {/* Exibe as taxas (parcelas) associadas a este método de pagamento */}
                <div className="overflow-x-auto border shadow w-full relative">
                    <PaymentFeesTable
                        methodId={method.id}
                        fees={fees}
                        isEditing={isEditing}
                        editedFees={editedFees}
                        handleFeeChange={handleFeeChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default PaymentMethodPanel;
