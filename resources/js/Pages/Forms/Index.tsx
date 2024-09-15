import React, { useState } from 'react';
import { Link, usePage, Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PropTypes from 'prop-types';
import FormBuilder from '@/Pages/FormBuilder'; // Componente de criação de formulário
import PopUpComponent from '@/Layouts/PopupComponent'; // Popup genérico

const Index = () => {
    const { auth, forms } = usePage().props; // Recebe 'auth' e 'forms' via Inertia
    const [isPopupOpen, setIsPopupOpen] = useState(false); // Estado para controlar o popup

    const { post } = useForm(); // Hook do Inertia para POST

    const openPopup = () => setIsPopupOpen(true); // Abre o popup
    const closePopup = () => setIsPopupOpen(false); // Fecha o popup

    const handleSaveForm = (formData) => {
        // Função para salvar o formulário via Inertia POST
        post('/forms', formData, {
            onSuccess: () => {
                closePopup(); // Fecha o popup ao salvar com sucesso
            }
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
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
                    <ul className="space-y-4">
                        {forms.map((form) => (
                            <li key={form.id} className="p-4 bg-gray-100 rounded-lg shadow">
                                <h2 className="text-xl font-semibold">{form.name}</h2>
                                <p>{form.description}</p>
                                <Link href={`/forms/${form.id}`} className="text-blue-500 hover:underline">
                                    Ver Detalhes
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Nenhum formulário encontrado.</p>
                )}
            </div>

            {/* Popup de criação de formulário */}
            {isPopupOpen && (
                <PopUpComponent id="formulario_popup" onClose={closePopup}>
                    <FormBuilder onSave={handleSaveForm} /> {/* Passa a função handleSaveForm para o FormBuilder */}
                </PopUpComponent>
            )}
        </AuthenticatedLayout>
    );
};

Index.propTypes = {
    auth: PropTypes.object.isRequired,
    forms: PropTypes.array.isRequired,
};

export default Index;
