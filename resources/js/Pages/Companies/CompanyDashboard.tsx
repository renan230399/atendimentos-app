import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import EmployeeManager from './Employees/EmployeeManager';
import { User } from '@/types';

interface Employee {
    id: number;
    name: string;
    email: string;
    role: number;
}
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
interface CompanyDashboardProps {
    auth: {
        user: User;  
    };
    employees: Employee[];
    accounts: Account[];
    paymentMethods: PaymentMethod[];
    paymentMethodsFees: PaymentMethodFee[];
}
const CompanyDashboard: React.FC<CompanyDashboardProps> = ({ auth, employees }) => {

    return (
        <AuthenticatedLayout user={auth.user}>
            {/*<Head title={auth.user.company.company_name} />*/}
            <div className="mx-auto p-6 overflow-y-auto h-[100%] pb-36 bg-gray-100">
            {/* Card para Gerenciamento de Funcionários */}
            <div className="w-full max-w-4xl mx-auto mb-8 p-6 bg-white shadow-lg rounded-lg">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center">
                    <img src='/images/icons/employees.png' className='w-24 h-24 mr-2'/>
                    Gerenciamento de Funcionários
                </h2>
                 <EmployeeManager employees={employees} />
            </div>

        </div>

        </AuthenticatedLayout>
    );
};

export default CompanyDashboard;
