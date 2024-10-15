import React, { useState } from 'react';
import { useForm } from '@inertiajs/react'; // Importando useForm do Inertia
import { Dialog } from 'primereact/dialog';
import PrimaryButton from '@/Components/PrimaryButton';
import PriceInput from '@/Components/PriceInput';
import AddPaymentFeeForm from './AddPaymentFeeForm';
import { PlusCircleIcon } from '@heroicons/react/24/solid';
import { PaymentMethod, PaymentMethodsFee, Account } from '../../FinancialInterfaces';

interface PaymentMethodFee {
    id: number;
    payment_method_id: number;
    installments: number;
    fixed_fee: number; // Em centavos
    percentage_fee: number;
    status:boolean;
}

interface PaymentFeesTableProps {
    methodId: number;
    fees: PaymentMethodFee[];
}

const PaymentFeesTable: React.FC<PaymentFeesTableProps> = ({ methodId, fees }) => {
    const { data, setData, put, errors } = useForm({
        editedFees: {} as Record<number, { installments: number; fixed_fee: string; percentage_fee: number }>
    });

    const [isEditing, setIsEditing] = useState(false);
    const [showAddFeeDialog, setShowAddFeeDialog] = useState(false);

    const toggleEditMode = () => {
        setIsEditing(!isEditing);
    };

    const initializeEditedFees = () => {
        const initialFees = fees.reduce((acc, fee) => {
            acc[fee.id] = {
                installments: fee.installments,
                fixed_fee: fee.fixed_fee.toString(),
                percentage_fee: fee.percentage_fee
            };
            return acc;
        }, {} as Record<number, { installments: number; fixed_fee: string; percentage_fee: number }>);
        setData('editedFees', initialFees);
    };

    const handleFeeChange = (feeId: number, field: string, value: any) => {
        setData('editedFees', {
            ...data.editedFees,
            [feeId]: {
                ...data.editedFees[feeId],
                [field]: value,
            },
        });
    };

    const handleSave = () => {
        
        put(route('payment_method_fees.update', { methodId }), {
            onSuccess: () => {
                console.log(data);

                toggleEditMode();
            }
        });
    };

    const openAddFeeDialog = () => {
        setShowAddFeeDialog(true);
    };

    const closeAddFeeDialog = () => {
        setShowAddFeeDialog(false);
    };

    const handleAddFeeSuccess = () => {
        closeAddFeeDialog();
    };

    return (
        <>
            <div className="overflow-x-auto border shadow relative">
                <div className="flex justify-between mb-4">
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={() => {
                            if (!isEditing) {
                                initializeEditedFees();
                            }
                            toggleEditMode();
                        }}
                    >
                        {isEditing ? 'Cancelar' : 'Editar'}
                    </button>
                    {isEditing && (
                        <button
                            className="bg-green-500 text-white px-4 py-2 rounded"
                            onClick={handleSave}
                        >
                            Salvar
                        </button>
                    )}
                    <PrimaryButton className="ml-2" onClick={openAddFeeDialog}>
                        <PlusCircleIcon className="h-5 w-5 mr-1" /> Adicionar Nova Taxa
                    </PrimaryButton>
                </div>

                {/* Tabela de Taxas */}
                <table className="min-w-full bg-white shadow-md rounded-lg">
                    <thead className="sticky top-0 bg-gray-900">
                        <tr className="border-b">
                            <th className="px-4 py-2 text-center font-semibold text-white">Parcelas</th>
                            <th className="px-4 py-2 text-center font-semibold text-white">Taxa Fixa (R$)</th>
                            <th className="px-4 py-2 text-center font-semibold text-white">Taxa Percentual (%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fees
                            .filter((fee) => fee.payment_method_id === methodId)
                            .map((methodFee) => (

                                <tr key={`fee-${methodFee.id}`} className="border-b hover:bg-gray-50">

                                    <td className="py-2 px-4 text-gray-700 text-center">
                                        {isEditing ? (
                                            <input
                                                type="number"
                                                value={data.editedFees[methodFee.id]?.installments || 1}
                                                onChange={(e) => handleFeeChange(methodFee.id, 'installments', e.target.value)}
                                                className="w-full px-2 py-1 border rounded"
                                            />
                                        ) : (
                                            methodFee.installments === 1 ? 'À vista' : `${methodFee.installments} parcelas`
                                        )}
                                    </td>
                                    <td className="py-2 px-4 text-gray-700 text-center">
                                        {isEditing ? (
                                            <PriceInput
                                                id={`fixed_fee_${methodFee.id}`}
                                                label=""
                                                value={data.editedFees[methodFee.id]?.fixed_fee || '0'}
                                                onChange={(value) => handleFeeChange(methodFee.id, 'fixed_fee', value)}
                                                required
                                            />
                                        ) : (
                                            `R$ ${(methodFee.fixed_fee / 100).toFixed(2).replace('.', ',')}`
                                        )}
                                    </td>
                                    <td className="py-2 px-4 text-gray-700 text-center">
                                        {isEditing ? (
                                            <input
                                                type="number"
                                                value={data.editedFees[methodFee.id]?.percentage_fee || ''}
                                                onChange={(e) => handleFeeChange(methodFee.id, 'percentage_fee', e.target.value)}
                                                className="w-full px-2 py-1 border rounded"
                                            />
                                        ) : (
                                            `${Number(methodFee.percentage_fee || 0).toFixed(2)}%`
                                        )}
                                    </td>
                                    <td className="py-2 px-4 text-gray-700 text-center">
                                        {isEditing ? (
                                            <input
                                                type="number"
                                                value={data.editedFees[methodFee.id]?.percentage_fee || ''}
                                                onChange={(e) => handleFeeChange(methodFee.id, 'percentage_fee', e.target.value)}
                                                className="w-full px-2 py-1 border rounded"
                                            />
                                        ) : (
                                            `${Number(methodFee.status || 0)}`
                                        )}
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>

                {errors && (
                    <div className="mt-2 text-red-500">
                        {Object.values(errors).map((error: any, idx: number) => (
                            <div key={idx}>{error}</div>
                        ))}
                    </div>
                )}
            </div>

            {/* Caixa de diálogo para adicionar nova taxa */}
            <Dialog
                header="Adicionar Nova Taxa"
                visible={showAddFeeDialog}
                onHide={closeAddFeeDialog}
                className="w-[70vw] m-auto"
            >
                <AddPaymentFeeForm paymentMethodId={methodId} onSuccess={handleAddFeeSuccess} />
            </Dialog>
        </>
    );
};

export default PaymentFeesTable;
