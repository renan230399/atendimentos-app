// src/components/Employee/EmployeeTable.tsx
import React from 'react';
import { FaEdit } from 'react-icons/fa';
import { MdBlock } from "react-icons/md";

interface Employee {
    id: number;
    name: string;
    email: string;
    role: number;
}

interface EmployeeTableProps {
    employees: Employee[];
    loading: boolean;
    onEdit: (employee: Employee) => void;
    onDelete: (employee: Employee) => void;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({ employees = [], loading, onEdit, onDelete }) => {
    return (
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
                                    onClick={() => onEdit(employee)}
                                    className="text-blue-500 hover:text-blue-700 mr-4"
                                    aria-label={`Editar ${employee.name}`}
                                >
                                    <FaEdit className="inline-block mr-1" /> Editar
                                </button>
                                <button
                                    onClick={() => onDelete(employee)}
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
    );
};

export default EmployeeTable;
