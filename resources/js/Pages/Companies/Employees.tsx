import React, { useState, useCallback } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import NewEmployeeForm from '@/Pages/Companies/Partials/NewEmployeeForm';
import PopUpComponent from '@/Layouts/PopupComponent';
import { Inertia } from '@inertiajs/inertia';

interface Employee {
    id: number;
    name: string;
    email: string;
    role: number;
}

interface EmployeesProps {
    auth: {
        user: {
            name: string;
            email: string;
        };
    };
    employees: Employee[];
}

const Employees: React.FC<EmployeesProps> = ({ auth, employees }) => {
    const { delete: destroy } = useForm();
    const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false); // Estado para popup de edição
    const [popupParams, setPopupParams] = useState({});
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [loading, setLoading] = useState(false);

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
        setSelectedEmployee(null); // Limpa o funcionário selecionado após fechar
    }, []);

    const handleDelete = useCallback((employeeId: number) => {
        if (confirm('Você tem certeza que deseja excluir este funcionário?')) {
            setLoading(true);
            
            // Enviando solicitação de exclusão usando Inertia e o useForm
            destroy(route('employees.destroy', employeeId), {
                onFinish: () => setLoading(false), // Parar o loading após o término
                onSuccess: () => alert('Funcionário excluído com sucesso!'), // Notifica sucesso
                onError: () => alert('Ocorreu um erro ao excluir o funcionário.'), // Notifica erro
            });
        }
    }, [destroy]);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Funcionários" />
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Funcionários da Empresa</h1>

                <div className="flex justify-end">
                    <button 
                        onClick={handleOpenCreatePopup} 
                        className="bg-green-500 text-white px-4 py-2 rounded mb-5"
                    >
                        Adicionar Funcionário
                    </button>
                </div>

                {employees.length > 0 ? (
                    <table className="table-auto w-full">
                        <thead>
                            <tr>
                                <th className="px-4 py-2">Nome</th>
                                <th className="px-4 py-2">Email</th>
                                <th className="px-4 py-2">Cargo</th>
                                <th className="px-4 py-2">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((employee) => (
                                <tr key={employee.id}>
                                    <td className="border px-4 py-2">{employee.name}</td>
                                    <td className="border px-4 py-2">{employee.email}</td>
                                    <td className="border px-4 py-2">
                                        {employee.role === 1 ? 'Administrador' : 'Funcionário'}
                                    </td>
                                    <td className="border px-4 py-2">
                                        <button
                                            onClick={() => handleOpenEditPopup(employee)} // Abre o popup de edição
                                            className="text-blue-500 hover:text-blue-700"
                                            aria-label={`Editar ${employee.name}`}
                                        >
                                            Editar
                                        </button>
                                        &nbsp;|&nbsp;
                                        <button
                                            onClick={() => handleDelete(employee.id)}
                                            className="text-red-500 hover:text-red-700"
                                            disabled={loading}
                                            aria-label={`Excluir ${employee.name}`}
                                        >
                                            {loading ? 'Excluindo...' : 'Excluir'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>Nenhum funcionário encontrado.</p>
                )}

                {/* Popup para adicionar funcionário */}
                {isCreatePopupOpen && (
                    <PopUpComponent
                        id="novo_funcionario_popup"
                        params={popupParams}
                        onClose={handleCloseCreatePopup}
                    >
                        <NewEmployeeForm onClose={handleCloseCreatePopup} />
                    </PopUpComponent>
                )}

                {/* Popup para editar funcionário */}
                {isEditPopupOpen && selectedEmployee && (
                    <PopUpComponent
                        id="editar_funcionario_popup"
                        params={popupParams}
                        onClose={handleCloseEditPopup}
                    >
                        <NewEmployeeForm
                            employee={selectedEmployee} // Passa o funcionário selecionado para o formulário
                            onClose={handleCloseEditPopup}
                            isEditMode={true} // Indica que é modo de edição
                        />
                    </PopUpComponent>
                )}
            </div>
        </AuthenticatedLayout>
    );
};

export default Employees;
