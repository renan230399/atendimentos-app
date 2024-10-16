import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import UpdateCompany from './Partials/UpdateCompany'; // Importando o novo componente
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import {User} from '@/Pages/ProfileInterfaces'
interface EditProps extends PageProps<{ mustVerifyEmail: boolean; status?: string }> {}

export default function Edit({ auth, mustVerifyEmail, status }: EditProps) {
    return (
        <AuthenticatedLayout
            user={auth.user}
        >
            <Head title="Profile" />

            <div className="flex flex-wrap mx-auto sm:px-6 lg:px-8 h-screen overflow-y-auto pt-6">
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
