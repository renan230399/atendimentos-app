import React, { useState } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import { Accordion, AccordionTab } from 'primereact/accordion'; // Certifique-se de importar Accordion e AccordionTab
import AddPaymentMethodForm from './Manager/AddPaymentMethodForm';
import PaymentFeesTable from './Manager/PaymentFeesTable';
import { PaymentMethod, PaymentMethodsFee, Account } from '../FinancialInterfaces';

interface PaymentMethodsManagerProps {
    paymentMethods: PaymentMethod[];
    paymentMethodsFees: PaymentMethodsFee[];
    accounts: Account[];
    selectedAccount: Account | null;
}

const PaymentMethodsManager: React.FC<PaymentMethodsManagerProps> = ({
    paymentMethods,
    paymentMethodsFees,
    accounts,
    selectedAccount,
}) => {
    const [isAddingPaymentMethod, setIsAddingPaymentMethod] = useState(false);

    const filteredPaymentMethods = selectedAccount
        ? paymentMethods.filter((method) => method.account_id === selectedAccount.id)
        : [];

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h1>
                <strong>Nome da conta:</strong> {selectedAccount ? selectedAccount.name : 'Conta não selecionada'}
            </h1>
            <PrimaryButton
                type="button"
                className="mt-2"
                onClick={() => setIsAddingPaymentMethod((prevState) => !prevState)}
            >
                {isAddingPaymentMethod ? 'Cancelar Adição de Método de Pagamento' : 'Adicionar Método de Pagamento para essa conta'}
            </PrimaryButton>

            {isAddingPaymentMethod && selectedAccount && (
                <AddPaymentMethodForm 
                    account={selectedAccount.id} 
                    setIsAddingPaymentMethod={() => setIsAddingPaymentMethod(false)} 
                />
            )}

            <div className="w-full max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center">
                    <span className="text-blue-500 mr-2">💳</span> Métodos de Pagamento
                </h2>
                <div className="flex flex-wrap justify-center">
                    <div className="w-full">
                        {filteredPaymentMethods.length === 0 ? (
                            <p>Nenhum método de pagamento disponível para esta conta.</p>
                        ) : (
                            <Accordion activeIndex={0}> {/* activeIndex controla a aba aberta */}
                                {filteredPaymentMethods.map((method, index) => (
                                    <AccordionTab key={method.id} header={`${method.name} - ${method.type}`}>
                                        <div className="mt-4">
                                            <div className="w-full relative">
                                                <PaymentFeesTable
                                                    methodId={method.id}
                                                    fees={paymentMethodsFees.filter(
                                                        (fee) => fee.payment_method_id === method.id
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </AccordionTab>
                                ))}
                            </Accordion>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentMethodsManager;
