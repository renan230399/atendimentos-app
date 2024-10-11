import React from 'react';

interface PaymentMethodFee {
    id: number;
    payment_method_id: number;
    installments: number;
    fixed_fee: number;
    percentage_fee: number;
}

interface PaymentFeesTableProps {
    methodId: number;
    fees: PaymentMethodFee[];
    isEditing: boolean;
    editedFees: { [key: number]: { fixed_fee: number; percentage_fee: number } };
    handleFeeChange: (feeId: number, field: string, value: any) => void;
}

const PaymentFeesTable: React.FC<PaymentFeesTableProps> = ({ methodId, fees, isEditing, editedFees, handleFeeChange }) => {
    return (
        <div className="overflow-x-auto border shadow relative">
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
                            <tr key={methodFee.id} className="border-b hover:bg-gray-50">
                                <td className="py-2 px-4 text-gray-700 text-center">
                                    {methodFee.installments === 1 ? 'À vista' : `${methodFee.installments} parcelas`}
                                </td>
                                <td className="py-2 px-4 text-gray-700 text-center">
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            value={editedFees[methodFee.id]?.fixed_fee || ''}
                                            onChange={(e) => handleFeeChange(methodFee.id, 'fixed_fee', e.target.value)}
                                            className="w-full px-2 py-1 border rounded"
                                        />
                                    ) : (
                                        `R$ ${Number(methodFee.fixed_fee).toFixed(2)}`
                                    )}
                                </td>
                                <td className="py-2 px-4 text-gray-700 text-center">
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            value={editedFees[methodFee.id]?.percentage_fee || ''}
                                            onChange={(e) => handleFeeChange(methodFee.id, 'percentage_fee', e.target.value)}
                                            className="w-full px-2 py-1 border rounded"
                                        />
                                    ) : (
                                        `${Number(methodFee.percentage_fee).toFixed(2)}%`
                                    )}
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
};

export default PaymentFeesTable;
