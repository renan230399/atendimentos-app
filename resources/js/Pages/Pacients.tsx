import React, { useState, useCallback } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import PopUpComponent from '@/Layouts/PopupComponent';
import CreatePacient from './Pacients/CreatePacient';
import ViewPacient from './Pacients/ViewPacient';
import PacientListItem from '@/Pages/Pacients/PacientListItem';
import PropTypes from 'prop-types';
import { formatDateAndAge } from '@/Components/Utils/dateUtils'; // Importa a função de utilitário

const Pacients = ({ auth, pacients = [], search }) => {
    const { data, setData, get, post, put, errors } = useForm({
        search: search || '',
        nome_paciente: '',
        telefone: '',
        data_nascimento: '',
    });

    const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const [isViewPopupOpen, setIsViewPopupOpen] = useState(false);
    const [selectedPacient, setSelectedPacient] = useState(null);
    const [loading, setLoading] = useState(false);
    const [popupParams, setPopupParams] = useState({});

    const handleOpenPopup = useCallback((e, popupType, pacient = null) => {
        setPopupParams({ clientX: e.clientX, clientY: e.clientY });
        if (popupType === 'create') {
            setIsCreatePopupOpen(true);
        }
        if (popupType === 'edit') {
            setSelectedPacient(pacient);
            setIsEditPopupOpen(true);
        }
        if (popupType === 'view') {
            setSelectedPacient(pacient);
            setIsViewPopupOpen(true);
        }
    }, []);

    const handleCloseCreatePopup = useCallback(() => {
        setIsCreatePopupOpen(false);
    }, []);
    
    const handleCloseEditPopup = useCallback(() => {
        setIsEditPopupOpen(false);
    }, []);
    
    const handleCloseViewPopup = useCallback(() => {
        setIsViewPopupOpen(false);
    }, []);
    

    const handleSearchChange = useCallback((e) => {
        setData('search', e.target.value);
    }, [setData]);

    const handleSearchSubmit = useCallback((e) => {
        e.preventDefault();
        setLoading(true);
        get(route('pacients'), { replace: true, preserveState: true });
        setLoading(false);
    }, [get]);

    const handleNewPatientSubmit = useCallback((e) => {
        e.preventDefault();
        setLoading(true);
        post(route('pacients.store'), {
            onSuccess: () => {
                setIsCreatePopupOpen(false);
                setLoading(false);
            },
        });
    }, [post]);

    // Substitui handleClosePopup por handleCloseEditPopup
    const handleEditPatientSubmit = useCallback((e) => {
        e.preventDefault();
        put(route('pacients.update', selectedPacient.id), {
            onSuccess: () => handleCloseEditPopup(), // Fechar o popup de edição ao salvar
        });
    }, [put, selectedPacient, handleCloseEditPopup]);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Pacientes" />

            <div className="p-10">
                <form onSubmit={handleSearchSubmit} className="mb-5">
                    <div>
                        <InputLabel htmlFor="search" value="Buscar Paciente" />
                        <TextInput
                            id="search"
                            value={data.search}
                            className="mt-1 block w-full"
                            placeholder="Digite o nome do paciente e pressione Enter ou clique em Buscar..."
                            onChange={handleSearchChange}
                            autoComplete="off"
                        />
                        <InputError message={errors.search} className="mt-2" />

                        {loading ? (
                            <div className="loading-spinner">Carregando...</div>
                        ) : (
                            <PrimaryButton className="mt-2" onClick={handleSearchSubmit}>
                                Buscar
                            </PrimaryButton>
                        )}
                    </div>
                </form>

                <button 
                    onClick={(e) => handleOpenPopup(e, 'create')} 
                    className="ml-auto bg-green-500 text-white px-4 py-2 rounded mb-5 inline-block"
                >
                    Cadastrar Novo Paciente
                </button>

                {pacients.map((pacient) => (
                    <PacientListItem
                        key={pacient.id}
                        pacient={pacient}
                        handleOpenEditPopup={(e) => handleOpenPopup(e, 'edit', pacient)}
                        handleOpenViewPopup={(e) => handleOpenPopup(e, 'view', pacient)}
                        formatDateAndAge={formatDateAndAge}
                    />
                ))}
            </div>

            {isCreatePopupOpen && (
                <PopUpComponent
                    id="novo_paciente_popup"
                    params={popupParams}
                    onClose={handleCloseCreatePopup} // Fechar o popup de criação
                >
                    <CreatePacient auth={auth} onSubmit={handleNewPatientSubmit} />
                </PopUpComponent>
            )}

            {isEditPopupOpen && selectedPacient && (
                <PopUpComponent
                    id="editar_paciente_popup"
                    params={popupParams}
                    onClose={handleCloseEditPopup} // Fechar o popup de edição
                >
                    <CreatePacient auth={auth} pacient={selectedPacient} onSubmit={handleEditPatientSubmit} />
                </PopUpComponent>
            )}

            {isViewPopupOpen && selectedPacient && (
                <PopUpComponent
                    id="visualizar_paciente_popup"
                    params={popupParams}
                    onClose={handleCloseViewPopup} // Fechar o popup de visualização
                >
                    <ViewPacient pacient={selectedPacient} handleOpenEditPopup={(e) => handleOpenPopup(e, 'edit', selectedPacient)} />
                </PopUpComponent>
            )}

        </AuthenticatedLayout>
    );
};

Pacients.propTypes = {
    auth: PropTypes.object.isRequired,
    pacients: PropTypes.array.isRequired,
    search: PropTypes.string,
};

export default Pacients;
