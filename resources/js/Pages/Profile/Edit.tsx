import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import UpdateCompany from './Partials/UpdateCompany'; // Importando o novo componente
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';

export default function Edit({ auth, mustVerifyEmail, status }: PageProps<{ mustVerifyEmail: boolean, status?: string }>) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Profile</h2>}
        >
            <Head title="Profile" />

            <div className="flex flex-wrap max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                {/* Formulário de Atualização de Perfil */}
                <div className="w-1/2 p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                        className="max-w-xl"
                    />
                </div>

                {/* Formulário de Atualização de Senha */}
                <div className="p-4 w-1/2 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                    <UpdatePasswordForm className="max-w-xl" />
                </div>

                {/* Formulário de Atualização de Informações da Empresa */}
                <div className="p-4 w-full sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                    <UpdateCompany
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                        className=""
                    />
                </div>

                {/* Formulário de Deleção de Conta */}
                <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                    <DeleteUserForm className="max-w-xl" />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
