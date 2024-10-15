import React, { useState, useCallback } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import FormBuilder from '@/Pages/Patients/Forms/FormBuilder'; // Componente de criação de formulário
import PopUpComponent from '@/Layouts/PopupComponent'; // Popup genérico
import FormEdit from '@/Pages/Patients/Forms/FormEdit'; // Novo componente de visualização de formulário
import { CiEdit } from "react-icons/ci";
import { User } from '@/types';

// Definição da interface para os formulários
interface Form {
    id: number;
    name: string;
    description?: string;
    icon?: string;
}

// Interface das props do componente
interface IndexProps {
    user: User;
    forms: Form[];
}

const Index: React.FC<IndexProps> = ({ user, forms }) => {
    const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false); // Estado para controlar o popup de criação
    const [isViewPopupOpen, setIsViewPopupOpen] = useState<boolean>(false); // Estado para controlar o popup de visualização
    const [popupParams, setPopupParams] = useState<{ clientX?: number; clientY?: number }>({}); // Estado para coordenadas do popup
    const [selectedForm, setSelectedForm] = useState<Form | null>(null); // Estado para armazenar o formulário selecionado para visualização

    const { post, processing } = useForm(); // Hook do Inertia para POST

    // Função para abrir o popup de criação de formulário e armazenar as coordenadas do clique
    const openPopup = useCallback((e: React.MouseEvent) => {
        setPopupParams({ clientX: e.clientX, clientY: e.clientY });
        setIsPopupOpen(true); // Abre o popup de criação
    }, []);

    // Função para abrir o popup de visualização de formulário
    const openViewPopup = useCallback((e: React.MouseEvent, form: Form) => {
        setPopupParams({
            clientX: e.clientX,
            clientY: e.clientY,
        });
        setSelectedForm(form); // Armazena o formulário selecionado
        setIsViewPopupOpen(true); // Abre o popup de visualização
    }, []);

    // Função para fechar os popups
    const closePopup = useCallback(() => {
        setIsPopupOpen(false); // Fecha o popup de criação
        setIsViewPopupOpen(false); // Fecha o popup de visualização
    }, []);

    // Função para salvar o formulário via Inertia POST
    const handleSaveForm = useCallback((formData: Record<string, any>) => {
        post('/forms', {
            ...formData, // Dados do formulário
            onSuccess: () => {
                closePopup(); // Fecha o popup ao salvar com sucesso
            },
        });
    }, [post, closePopup]);

    return (
        <AuthenticatedLayout user={user}>
            <Head title="Lista de Formulários" />
            <div className="p-6 bg-white rounded-lg shadow">
                <h1 className="text-2xl font-bold mb-4">Lista de Formulários</h1>

                {/* Botão para abrir o popup de criação de formulário */}
                <button
                    onClick={openPopup}
                    className="mb-5 bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Adicionar Novo Formulário
                </button>

                {forms.length > 0 ? (
                    <div className="flex flex-wrap">
                        {forms.map((form) => (
                            <div key={form.id} className="w-[32%] m-auto border rounded-xl shadow-lg p-3 text-center mb-6">
                                <img
                                    src={form.icon}
                                    alt={`Ícone de ${form.name}`}
                                    className="w-[50%] md:w-16 md:h-16 m-auto"
                                />
                                <h2 className="text-xl font-semibold">{form.name}</h2>
                                <p>{form.description}</p>
                                <div className="flex space-x-4">
                                    <div
                                        onClick={(e) => openViewPopup(e, form)}
                                        className="text-white bg-blue-500 hover:bg-blue-600 cursor-pointer flex px-2 py-1 rounded-md m-auto"
                                    >
                                        <CiEdit className="text-white cursor-pointer m-auto" size={30} />
                                        <p className='m-auto'>Ver Detalhes</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>Nenhum formulário encontrado.</p>
                )}
            </div>

            {/* Popup de criação de formulário */}
            {isPopupOpen && (
                <PopUpComponent
                    id="formulario_popup"
                    width="96vw"
                    height="90vh"
                    zindex="100"
                    params={popupParams}
                    onClose={closePopup}
                >
                    <FormBuilder onSave={handleSaveForm} processing={processing} />
                </PopUpComponent>
            )}

            {/* Popup de visualização de formulário */}
            {isViewPopupOpen && selectedForm && (
                <PopUpComponent
                    id="formulario_visualizacao_popup"
                    width="95vw"
                    height="95vh"
                    zindex="100"
                    params={popupParams}
                    onClose={closePopup}
                >
                    <FormEdit form={selectedForm} />
                </PopUpComponent>
            )}
        </AuthenticatedLayout>
    );
};

export default Index;
