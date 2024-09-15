import React, { useState, useCallback } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import PopUpComponent from '@/Layouts/PopupComponent';
import PropTypes from 'prop-types';

interface Employee {
    id: number;
    name: string;
    email: string;
    cargo: number;
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
    const { post, delete: destroy, data, setData, errors } = useForm({
        name: '',
        email: '',
        cargo: 2, // Valor padrão para 'Funcionário'
        password: '',
        password_confirmation: ''
    });

    const [loading, setLoading] = useState(false);
    const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);
    const [popupParams, setPopupParams] = useState({});

    const handleOpenPopup = useCallback((e) => {
        setPopupParams({ clientX: e.clientX, clientY: e.clientY });
        setIsCreatePopupOpen(true);
    }, []);

    const handleCloseCreatePopup = useCallback(() => {
        setIsCreatePopupOpen(false);
    }, []);

    const handleNewEmployeeSubmit = useCallback((e) => {
        e.preventDefault();
        setLoading(true);
        post(route('employees.store'), {
            onSuccess: () => {
                setIsCreatePopupOpen(false);
                setLoading(false);
            }
        });
    }, [post]);

    const handleDelete = useCallback((employeeId: number) => {
        if (confirm('Você tem certeza que deseja excluir este funcionário?')) {
            setLoading(true);
            destroy(route('employees.destroy', employeeId), {
                onSuccess: () => setLoading(false),
            });
        }
    }, [destroy]);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Funcionários" />
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Funcionários da Empresa</h1>

                <button 
                    onClick={(e) => handleOpenPopup(e)} 
                    className="ml-auto bg-green-500 text-white px-4 py-2 rounded mb-5 inline-block"
                >
                    Adicionar Funcionário
                </button>

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
                                        {employee.cargo === 1 ? 'Administrador' : 'Funcionário'}
                                    </td>
                                    <td className="border px-4 py-2">
                                        <a
                                            href={route('employees.edit', employee.id)}
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            Editar
                                        </a>
                                        &nbsp;|&nbsp;
                                        <button
                                            onClick={() => handleDelete(employee.id)}
                                            className="text-red-500 hover:text-red-700"
                                            disabled={loading}
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
            </div>

            {/* Popup para adicionar um novo funcionário */}
            {isCreatePopupOpen && (
                <PopUpComponent
                    id="novo_funcionario_popup"
                    params={popupParams}
                    onClose={handleCloseCreatePopup}
                >
                    <form onSubmit={handleNewEmployeeSubmit} className="space-y-4 p-5">
                        <div>
                            <InputLabel htmlFor="name" value="Nome do Funcionário" />
                            <TextInput
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="mt-1 block w-full"
                                required
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="email" value="Email" />
                            <TextInput
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="mt-1 block w-full"
                                required
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="cargo" value="Cargo" />
                            <select
                                id="cargo"
                                value={data.cargo}
                                onChange={(e) => setData('cargo', parseInt(e.target.value))}
                                className="mt-1 block w-full"
                            >
                                <option value={2}>Funcionário</option>
                                <option value={1}>Administrador</option>
                            </select>
                            <InputError message={errors.cargo} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="password" value="Senha" />
                            <TextInput
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="mt-1 block w-full"
                                required
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="password_confirmation" value="Confirmar Senha" />
                            <TextInput
                                id="password_confirmation"
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                className="mt-1 block w-full"
                                required
                            />
                            <InputError message={errors.password_confirmation} className="mt-2" />
                        </div>

                        <PrimaryButton type="submit" className="w-full">
                            Adicionar Funcionário
                        </PrimaryButton>
                    </form>
                </PopUpComponent>
            )}
        </AuthenticatedLayout>
    );
};

Employees.propTypes = {
    auth: PropTypes.object.isRequired,
    employees: PropTypes.array.isRequired,
};

export default Employees;
