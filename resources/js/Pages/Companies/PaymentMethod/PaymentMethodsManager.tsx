import React, { useState, useRef } from 'react';
import { useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import AddPaymentMethodForm from './Manager/AddPaymentMethodForm';
import AddPaymentFeeForm from './Manager/AddPaymentFeeForm';
import PaymentMethodControls from './Manager/PaymentMethodControls';
import PaymentMethodPanel from './Manager/PaymentMethodPanel';
import AddFeeControl from './Manager/AddFeeControl';

interface PaymentMethod {
    id: number;
    account_id: number;
    name: string;
    type: string;
}

interface PaymentMethodFee {
    id: number;
    payment_method_id: number;
    installments: number;
    fixed_fee: number;
    percentage_fee: number;
}
interface Account {
    id: number;
    name: string;
    type: string;
}
interface PaymentMethodsManagerProps {
    paymentMethods: PaymentMethod[];
    paymentMethodsFees: PaymentMethodFee[];
    accounts:Account[];
}

const PaymentMethodsManager: React.FC<PaymentMethodsManagerProps> = ({ paymentMethods, paymentMethodsFees, accounts }) => {
    const { data, setData, post, reset, errors } = useForm({
        name: '',
        type: '',
        installments: 1,
        fixed_fee: 0,
        percentage_fee: 0,
    });

    const [isEditing, setIsEditing] = useState<Record<number, boolean>>({});
    const [editedFees, setEditedFees] = useState<Record<number, { fixed_fee: number; percentage_fee: number }>>({});
    const [isAddingPaymentMethod, setIsAddingPaymentMethod] = useState(false);
    const [selectedMethodId, setSelectedMethodId] = useState<number | null>(null);
    const [isAddingFee, setIsAddingFee] = useState(false);

    // Função para ativar/desativar o modo de edição para um método específico
    const handleEditToggle = (methodId: number) => {
        setIsEditing((prev) => ({
            ...prev,
            [methodId]: !prev[methodId],
        }));

        // Inicializa os valores de edição com os valores atuais se o modo de edição for ativado
        if (!isEditing[methodId]) {
            const currentFees = paymentMethodsFees
                .filter((fee) => fee.payment_method_id === methodId)
                .reduce((acc, fee) => {
                    acc[fee.id] = { fixed_fee: fee.fixed_fee, percentage_fee: fee.percentage_fee };
                    return acc;
                }, {});
            setEditedFees((prev) => ({ ...prev, ...currentFees }));
        }
    };

    // Função para atualizar o valor de edição das taxas
    const handleFeeChange = (feeId: number, field: string, value: any) => {
        setEditedFees((prev) => ({
            ...prev,
            [feeId]: {
                ...prev[feeId],
                [field]: value,
            },
        }));
    };

    // Função para salvar as alterações
    const handleSave = (methodId: number) => {
        console.log('Salvando alterações para o método:', methodId, editedFees);
        setIsEditing((prev) => ({ ...prev, [methodId]: false }));
        // Aqui você pode implementar a lógica para salvar as edições no backend, utilizando uma chamada à API.
    };


    return (
        <div className="bg-white shadow rounded-lg p-6">
            <PaymentMethodControls
                isAddingPaymentMethod={isAddingPaymentMethod}
                onToggleAddMethod={() => setIsAddingPaymentMethod(!isAddingPaymentMethod)}
            />
            {isAddingPaymentMethod && <AddPaymentMethodForm onSuccess={() => setIsAddingPaymentMethod(false)} />}

            <AddFeeControl
                isAddingFee={isAddingFee}
                onToggleAddFee={() => setIsAddingFee(!isAddingFee)}
                paymentMethodId={selectedMethodId}
                onSuccess={() => setIsAddingFee(false)}
            />

            <div className="card">
                <Stepper style={{ flexBasis: '50rem' }} orientation="vertical">
                    {paymentMethods.map((method) => (
                        <StepperPanel key={method.id} header={`${method.name} - ${method.type}`} > 
                            <PaymentMethodPanel
                                method={method}
                                fees={paymentMethodsFees.filter((fee) => fee.payment_method_id === method.id)}
                                editedFees={editedFees}
                                handleFeeChange={handleFeeChange}
                                isEditing={isEditing[method.id]}
                                onEditToggle={() => handleEditToggle(method.id)}
                                onSave={() => handleSave(method.id)}
                            />
                        </StepperPanel>
                    ))}
                </Stepper>
            </div>
        </div>
    );
};

export default PaymentMethodsManager;
