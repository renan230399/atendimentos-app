// src/components/Employee/EmployeeManager.tsx
import React, { useState, useCallback } from 'react';
import { useForm } from '@inertiajs/react';
import NewEmployeeForm from '@/Pages/Companies/Employees/EmployeesManager/NewEmployeeForm';
import PopUpComponent from '@/Layouts/PopupComponent';
import EmployeeTable from './EmployeesManager/EmployeeTable';
import DeleteConfirmationModal from './EmployeesManager/DeleteConfirmationModal';

import { Dialog } from 'primereact/dialog';

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
    const [popupParams, setPopupParams] = useState<{ [key: string]: any }>({});
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


                <Dialog
                visible={isEditPopupOpen}
                onHide={() => setIsEditPopupOpen(false)}
                className="w-[96vw] h-[98vh] m-auto rounded-xl "
                >
                {selectedEmployee && (
                    <NewEmployeeForm employee={selectedEmployee} onClose={handleCloseEditPopup} isEditMode={true} />
                )}
                </Dialog>
                <DeleteConfirmationModal
                    isOpen={showModal} // Deve estar correto
                    employeeName={selectedEmployee?.name || null} // Deve estar correto
                    loading={loading} // Deve estar correto
                    onClose={closeDeleteModal} // Deve estar correto
                    onConfirm={handleDelete} // Deve estar correto
                />

        </div>
    );
};

export default EmployeeManager;
