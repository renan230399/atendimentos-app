import React, { useCallback, useState } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';

interface NewEmployeeFormProps {
    onClose: () => void;
    employee?: {
        id: number;
        name: string;
        email: string;
        role: number;
    };
    isEditMode?: boolean;
}

const NewEmployeeForm: React.FC<NewEmployeeFormProps> = ({ onClose, employee, isEditMode = false }) => {
    const { post, put, data, setData, reset, errors } = useForm({
        name: employee ? employee.name : '',
        email: employee ? employee.email : '',
        role: employee ? employee.role : 2, // Valor padrão para 'Funcionário'
        password: '',
        password_confirmation: ''
    });

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // Estado para alternar visibilidade da senha
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false); // Para confirmação

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const action = isEditMode && employee
            ? put(route('employees.update', employee.id), {
                  onSuccess: () => {
                      reset(); // Reset the form
                      setLoading(false);
                      onClose();
                  },
                  onError: () => {
                      setLoading(false); // Handle error case
                  },
              })
            : post(route('employees.store'), {
                onSuccess: () => {
                    onClose();
                    setLoading(false);
                },
                onError: (errors) => {
                    console.error(errors); // Exibe os erros no console
                    setLoading(false);
                },
            });
            

        action;
    }, [post, put, isEditMode, employee, onClose, reset]);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const togglePasswordConfirmationVisibility = () => {
        setShowPasswordConfirmation(!showPasswordConfirmation);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-wrap space-y-6 gap-4 p-8 bg-white rounded-lg shadow-lg">
            {/* Campo Nome */}
            <div className="flex flex-col md:w-[65%] w-full m-auto">
                <InputLabel htmlFor="name" value="Nome do Funcionário" className="font-semibold text-gray-700" />
                <TextInput
                    id="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                />
                <InputError message={errors.name} className="mt-2 text-red-600 text-sm" />
            </div>

            {/* Campo Cargo */}
            <div className="flex flex-col md:w-[30%] w-full m-auto">
                <InputLabel htmlFor="role" value="Cargo" className="font-semibold text-gray-700" />
                <select
                    id="role"
                    value={data.role}
                    onChange={(e) => setData('role', parseInt(e.target.value))}
                    className="block w-full mt-1 rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value={2}>Funcionário</option>
                    <option value={1}>Administrador</option>
                </select>
                <InputError message={errors.role} className="mt-2 text-red-600 text-sm" />
            </div>

            {/* Campo Email */}
            <div className="flex flex-col md:w-[50%] w-full">
                <InputLabel htmlFor="email" value="Email" className="font-semibold text-gray-700" />
                <TextInput
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                />
                <InputError message={errors.email} className="mt-2 text-red-600 text-sm" />
            </div>

            {/* Campo Senha (exibe apenas se não estiver no modo de edição) */}
            {!isEditMode && (
                <>
                    <div className="flex flex-col md:w-[45%] w-full m-auto relative">
                        <InputLabel htmlFor="password" value="Senha" className="font-semibold text-gray-700" />
                        <div className="relative">
                            <TextInput
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                required={!isEditMode}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 px-3 py-1 text-gray-600"
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                            </button>
                        </div>
                        <InputError message={errors.password} className="mt-2 text-red-600 text-sm" />
                    </div>

                    {/* Campo Confirmar Senha */}
                    <div className="flex flex-col md:w-[45%] w-full m-auto relative">
                        <InputLabel htmlFor="password_confirmation" value="Confirmar Senha" className="font-semibold text-gray-700" />
                        <div className="relative">
                            <TextInput
                                id="password_confirmation"
                                type={showPasswordConfirmation ? "text" : "password"}
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                required={!isEditMode}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 px-3 py-1 text-gray-600"
                                onClick={togglePasswordConfirmationVisibility}
                            >
                                {showPasswordConfirmation ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                            </button>
                        </div>
                        <InputError message={errors.password_confirmation} className="mt-2 text-red-600 text-sm" />
                    </div>
                </>
            )}

            {/* Botão de Submissão */}
            <div className="md:w-[30%] w-full m-auto text-center">
                <PrimaryButton
                    type="submit"
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    {loading ? (isEditMode ? 'Atualizando...' : 'Adicionando...') : (isEditMode ? 'Atualizar Funcionário' : 'Adicionar Funcionário')}
                </PrimaryButton>
            </div>
        </form>
    );
};

export default NewEmployeeForm;
