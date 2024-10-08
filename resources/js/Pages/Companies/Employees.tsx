import React, { useState, useCallback } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import NewEmployeeForm from '@/Pages/Companies/Partials/NewEmployeeForm';
import PopUpComponent from '@/Layouts/PopupComponent';
import { Inertia } from '@inertiajs/inertia';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { MdBlock } from "react-icons/md";

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
        setSelectedEmployee(null); // Limpa o funcionário selecionado após fechar
    }, []);        

      
        // Função para abrir o modal de confirmação
        const openDeleteModal = useCallback((employee) => {
          setSelectedEmployee(employee);
          setShowModal(true);
        }, []);
      
        // Função para fechar o modal de confirmação
        const closeDeleteModal = useCallback(() => {
          setShowModal(false);
          setSelectedEmployee(null);
        }, []);
      
        // Função para deletar o funcionário
        const handleDelete = useCallback(() => {
          if (selectedEmployee) {
            setLoading(true);
      
            // Enviando solicitação de exclusão usando Inertia e o useForm
            destroy(route('employees.destroy', selectedEmployee.id), {
              onFinish: () => {
                setLoading(false);
                closeDeleteModal(); // Fecha o modal após o término
              },
              onSuccess: () => alert('Funcionário excluído com sucesso!'), // Notifica sucesso
              onError: () => alert('Ocorreu um erro ao excluir o funcionário.'), // Notifica erro
            });
          }
        }, [selectedEmployee]);

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
                        <div className="overflow-x-auto">
                            <table className="min-w-full table-auto bg-white shadow-lg rounded-lg">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-gray-600 font-semibold">Nome</th>
                                        <th className="px-4 py-2 text-left text-gray-600 font-semibold">Email</th>
                                        <th className="px-4 py-2 text-left text-gray-600 font-semibold">Cargo</th>
                                        <th className="px-4 py-2 text-left text-gray-600 font-semibold">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {employees.map((employee, index) => (
                                        <tr key={employee.id} className={`border-b ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                                            <td className="px-4 py-2 text-gray-700">{employee.name}</td>
                                            <td className="px-4 py-2 text-gray-700">{employee.email}</td>
                                            <td className="px-4 py-2 text-gray-700">
                                                {employee.role === 1 ? 'Administrador' : 'Funcionário'}
                                            </td>
                                            <td className="px-4 py-2 text-gray-700">
                                                <button
                                                    onClick={() => handleOpenEditPopup(employee)} // Abre o popup de edição
                                                    className="text-blue-500 hover:text-blue-700 mr-4"
                                                    aria-label={`Editar ${employee.name}`}
                                                >
                                                    <FaEdit className="inline-block mr-1" /> Editar
                                                </button>
                                                <button
                                                    onClick={() => openDeleteModal(employee)} // Abre o modal de deleção
                                                    className="text-red-500 hover:text-red-700"
                                                    disabled={loading}
                                                    aria-label={`Excluir ${employee.name}`}
                                                >
                                                    <MdBlock className="inline-block mr-1" /> {loading ? 'Inativando...' : 'Inativar'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-500">Nenhum funcionário encontrado.</p>
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
                 {/* Modal de Confirmação de Deleção */}
                 {showModal && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4">Confirmar Exclusão</h2>
                        <p className="mb-6">Tem certeza de que deseja inativar {selectedEmployee?.name}?</p>
                        <div className="flex justify-end">
                        <button
                            onClick={closeDeleteModal}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded mr-2"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleDelete}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            disabled={loading}
                        >
                            {loading ? 'Inativando...' : 'Sim, inativar!'}
                        </button>
                        </div>
                    </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
};

export default Employees;
