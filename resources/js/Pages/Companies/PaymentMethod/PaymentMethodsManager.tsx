import React, { useState } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import AddPaymentMethodForm from './Manager/AddPaymentMethodForm';
import PaymentFeesTable from './Manager/PaymentFeesTable';
import { PlusCircleIcon } from '@heroicons/react/24/solid';

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

interface SelectedAccount {
    id: number;
    name: string;
    type: string;
}

interface PaymentMethodsManagerProps {
    paymentMethods: PaymentMethod[];
    paymentMethodsFees: PaymentMethodFee[];
    selectedAccount: SelectedAccount;
}

const PaymentMethodsManager: React.FC<PaymentMethodsManagerProps> = ({
    paymentMethods,
    paymentMethodsFees,
    selectedAccount,
}) => {
    const [isAddingPaymentMethod, setIsAddingPaymentMethod] = useState(false);

    // Filtra os métodos de pagamento relacionados à conta selecionada
    const filteredPaymentMethods = paymentMethods.filter(
        (method) => method.account_id === selectedAccount.id
    );

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h1><strong>Nome da conta:</strong> {selectedAccount.name}</h1>
            <PrimaryButton
                type="button"
                className="mt-2"
                onClick={() => setIsAddingPaymentMethod(prevState => !prevState)}
            >
                {isAddingPaymentMethod ? (
                    'Cancelar Adição de Método de Pagamento'
                ) : (
                    'Adicionar Método de Pagamento para essa conta'
                )}
            </PrimaryButton>

            {isAddingPaymentMethod && <AddPaymentMethodForm account={selectedAccount.id} setIsAddingPaymentMethod={setIsAddingPaymentMethod} />}

            {/* Card para Métodos de Pagamento */}
            <div className="w-full max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center">
                    <span className="text-blue-500 mr-2">💳</span> Métodos de Pagamento
                </h2>
                <div className="flex flex-wrap justify-center">
                    <div className="w-full">
                        {filteredPaymentMethods.length === 0 ? (
                            <p>Nenhum método de pagamento disponível para esta conta.</p>
                        ) : (
                            <Stepper 
                                orientation="vertical"
                            >
                                {filteredPaymentMethods.map((method, index) => (
                                    <StepperPanel 
                                        key={`step-${index}`} 
                                        header={`${method.name} - ${method.type}`} 
                                    >
                                        <div className="flex flex-col h-12rem">
                                            <div className="">
                                                {/* Exibe as taxas (parcelas) associadas a este método de pagamento */}
                                                <div className=" shadow w-full relative">
                                                    <PaymentFeesTable
                                                        methodId={method.id}
                                                        fees={paymentMethodsFees.filter(
                                                            (fee) => fee.payment_method_id === method.id
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </StepperPanel>
                                ))}
                            </Stepper>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentMethodsManager;
