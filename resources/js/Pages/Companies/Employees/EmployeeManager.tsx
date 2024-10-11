// src/components/Employee/EmployeeManager.tsx
import React, { useState, useCallback } from 'react';
import { useForm } from '@inertiajs/react';
import NewEmployeeForm from '@/Pages/Companies/Employees/EmployeesManager/NewEmployeeForm';
import PopUpComponent from '@/Layouts/PopupComponent';
import EmployeeTable from './EmployeesManager/EmployeeTable';
import DeleteConfirmationModal from './EmployeesManager/EmployeeTable';

interface Employee {
    id: number;
    name: string;
    email: string;
    role: number;
}

interface EmployeeManagerProps {
    employees: Employee[];
}

const EmployeeManager: React.FC<EmployeeManagerProps> = ({ employees }) => {
    const { delete: destroy } = useForm();
    const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const [popupParams, setPopupParams] = useState({});
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleOpenCreatePopup = useCallback((e: React.MouseEvent) => {
        setPopupParams({ clientX: e.clientX, clientY: e.clientY });
        setIsCreatePopupOpen(true);
    }, []);

    const handleOpenEditPopup = useCallback((employee: Employee) => {
        setSelectedEmployee(employee);
        setIsEditPopupOpen(true);
    }, []);

    const handleCloseCreatePopup = useCallback(() => {
        setIsCreatePopupOpen(false);
    }, []);

    const handleCloseEditPopup = useCallback(() => {
        setIsEditPopupOpen(false);
        setSelectedEmployee(null);
    }, []);

    const openDeleteModal = useCallback((employee: Employee) => {
        setSelectedEmployee(employee);
        setShowModal(true);
    }, []);

    const closeDeleteModal = useCallback(() => {
        setShowModal(false);
        setSelectedEmployee(null);
    }, []);

    const handleDelete = useCallback(() => {
        if (selectedEmployee) {
            setLoading(true);
            destroy(route('employees.destroy', selectedEmployee.id), {
                onFinish: () => {
                    setLoading(false);
                    closeDeleteModal();
                },
                onSuccess: () => alert('Funcionário excluído com sucesso!'),
                onError: () => alert('Ocorreu um erro ao excluir o funcionário.'),
            });
        }
    }, [selectedEmployee, destroy, closeDeleteModal]);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Funcionários da Empresa</h1>
            <div className="flex justify-end">
                <button 
                    onClick={handleOpenCreatePopup} 
                    className="bg-green-500 text-white px-4 py-2 rounded mb-5"
                >
                    Adicionar Funcionário
                </button>
            </div>

            <EmployeeTable 
                employees={employees} 
                loading={loading} 
                onEdit={handleOpenEditPopup} 
                onDelete={openDeleteModal} 
            />

            {isCreatePopupOpen && (
                <PopUpComponent id="novo_funcionario_popup" params={popupParams} onClose={handleCloseCreatePopup}>
                    <NewEmployeeForm onClose={handleCloseCreatePopup} />
                </PopUpComponent>
            )}

            {isEditPopupOpen && selectedEmployee && (
                <PopUpComponent id="editar_funcionario_popup" params={popupParams} onClose={handleCloseEditPopup}>
                    <NewEmployeeForm employee={selectedEmployee} onClose={handleCloseEditPopup} isEditMode={true} />
                </PopUpComponent>
            )}

            <DeleteConfirmationModal
                isOpen={showModal}
                employeeName={selectedEmployee?.name || null}
                loading={loading}
                onClose={closeDeleteModal}
                onConfirm={handleDelete}
            />
        </div>
    );
};

export default EmployeeManager;
