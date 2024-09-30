import React, { useState, useCallback } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import PopUpComponent from '@/Layouts/PopupComponent';
import CreatePatient from './CreatePatient';
import ViewPatient from './ViewPatient';
import PatientListItem from '@/Pages/Patients/PatientListItem';
import DynamicForm from '@/Pages/Forms/DynamicForm';
import AddConsultation from '@/Pages/Consultations/AddConsultation';
import PropTypes from 'prop-types';
import { formatDateAndAge } from '@/Components/Utils/dateUtils';
import ReactPaginate from 'react-paginate';
import { FaUserPlus } from 'react-icons/fa';

const Patients = ({ auth, patients = [], employees = [], forms = [], search }) => {
    const { data, setData, get, post, put, errors } = useForm({
        search: search || '',
        patient_name: '',
        phone: '',
        birth_date: '',
    });

    // Estados para paginação
    const [currentPage, setCurrentPage] = useState(0);
    const patientsPerPage = 10;
    const offset = currentPage * patientsPerPage;
    const currentPatients = patients.slice(offset, offset + patientsPerPage);
    const pageCount = Math.ceil(patients.length / patientsPerPage);

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const [isViewPopupOpen, setIsViewPopupOpen] = useState(false);
    const [isAddConsultationPopupOpen, setIsAddConsultationPopupOpen] = useState(false);
    const [isAddFormPopupOpen, setIsAddFormPopupOpen] = useState(false);

    const [selectedPatient, setSelectedPatient] = useState(null);
    const [selectedForm, setSelectedForm] = useState(null);
    const [loading, setLoading] = useState(false);
    const [popupParams, setPopupParams] = useState({});

    const handleOpenPopup = useCallback((e, popupType, patient = null) => {
        setPopupParams({ clientX: e.clientX, clientY: e.clientY });
        if (popupType === 'create') {
            setIsCreatePopupOpen(true);
        }
        if (popupType === 'edit') {
            setSelectedPatient(patient);
            setIsEditPopupOpen(true);
        }
        if (popupType === 'view') {
            setSelectedPatient(patient);
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

    const handleOpenAddFormPopup = useCallback((e, form) => {
        setSelectedForm(form);
        setPopupParams({ clientX: e.clientX, clientY: e.clientY });
        setIsAddFormPopupOpen(true);
    }, []);

    const handleOpenAddConsultationPopup = useCallback((e, patient) => {
        setSelectedPatient(patient);
        setPopupParams({
            clientX: e.clientX,
            clientY: e.clientY,
            paddingBottom: '0px',
        });
        setIsAddConsultationPopupOpen(true);
    }, []);

    const handleCloseAddConsultationPopup = useCallback(() => {
        setIsAddConsultationPopupOpen(false);
    }, []);

    const handleCloseAddFormPopup = useCallback(() => {
        setIsAddFormPopupOpen(false);
    }, []);

    const handleSearchChange = useCallback((e) => {
        setData('search', e.target.value);
    }, [setData]);

    const handleSearchSubmit = useCallback((e) => {
        e.preventDefault();
        setLoading(true);
        get(route('patients.index'), { replace: true, preserveState: true });
        setLoading(false);
    }, [get]);

    const handleNewPatientSubmit = useCallback((e) => {
        e.preventDefault();
        setLoading(true);
        post(route('patients.store'), {
            onSuccess: () => {
                setIsCreatePopupOpen(false);
                setLoading(false);
            },
        });
    }, [post]);

    const handleEditPatientSubmit = useCallback((e) => {
        e.preventDefault();
        put(route('patients.update', selectedPatient.id), {
            onSuccess: () => handleCloseEditPopup(),
        });
    }, [put, selectedPatient, handleCloseEditPopup]);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Patients" />

            <div className="p-10">
                <form onSubmit={handleSearchSubmit} className="mb-5">
                    <div>
                        <InputLabel htmlFor="search" value="Pesquisar pacientes" />
                        <TextInput
                            id="search"
                            value={data.search}
                            className="mt-1 block w-full"
                            placeholder="Digite o nome do paciente que você procura..."
                            onChange={handleSearchChange}
                            autoComplete="off"
                        />
                        <InputError message={errors.search} className="mt-2" />

                        {loading ? (
                            <div className="loading-spinner">Loading...</div>
                        ) : (
                            <PrimaryButton className="mt-2" onClick={handleSearchSubmit}>
                                Buscar
                            </PrimaryButton>
                        )}
                    </div>
                </form>

                <button
    onClick={(e) => handleOpenPopup(e, 'create')}
    className="ml-auto flex bg-green-500 text-white px-6 py-3 rounded-lg mb-5 inline-block font-semibold shadow-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 transition-all duration-300 transform hover:scale-105"
  >
    <FaUserPlus className="mr-2 m-auto" />
    Cadastrar novo Paciente
  </button>


                {/* Renderizando pacientes da página atual */}
                {currentPatients.map((patient) => (
                    <PatientListItem
                        key={patient.id}
                        patient={patient}
                        handleOpenEditPopup={(e) => handleOpenPopup(e, 'edit', patient)}
                        handleOpenViewPopup={(e) => handleOpenPopup(e, 'view', patient)}
                        formatDateAndAge={formatDateAndAge}
                    />
                ))}

                {/* Componente de paginação */}
                <div className="mt-6 flex justify-center">
                    <ReactPaginate
                        previousLabel={'← Anterior'}
                        nextLabel={'Próxima →'}
                        pageCount={pageCount}
                        onPageChange={handlePageClick}
                        containerClassName={'pagination flex flex-wrap space-x-2 justify-center'}
                        activeClassName={'active bg-blue-500 text-white px-3 py-1 rounded-md'}
                        pageClassName={'page-item px-3 py-1 border rounded-md text-sm'}
                        previousClassName={'page-item px-3 py-1 border rounded-md text-sm'}
                        nextClassName={'page-item px-3 py-1 border rounded-md text-sm'}
                        disabledClassName={'disabled opacity-50 cursor-not-allowed'}
                    />
                </div>
            </div>

            {/* Popups para criar, editar, visualizar e adicionar consulta */}
            {isCreatePopupOpen && (
                <PopUpComponent
                    id="new_patient_popup"
                    params={popupParams}
                    onClose={handleCloseCreatePopup}
                >
                    <CreatePatient auth={auth} onSubmit={handleNewPatientSubmit} />
                </PopUpComponent>
            )}

            {isEditPopupOpen && selectedPatient && (
                <PopUpComponent
                    id="edit_patient_popup"
                    params={popupParams}
                    onClose={handleCloseEditPopup}
                >
                    <CreatePatient auth={auth} patient={selectedPatient} onSubmit={handleEditPatientSubmit} />
                </PopUpComponent>
            )}

            {isViewPopupOpen && selectedPatient && (
                <PopUpComponent
                    id="view_patient_popup"
                    zindex="99"
                    params={popupParams}
                    onClose={handleCloseViewPopup}
                >
                    <ViewPatient
                        patient={selectedPatient}
                        handleOpenEditPopup={(e) => handleOpenPopup(e, 'edit', selectedPatient)}
                        handleOpenAddConsultationPopup={(e) => handleOpenAddConsultationPopup(e, selectedPatient)}
                        handleOpenAddFormPopup={(e, form) => handleOpenAddFormPopup(e, form)}
                        forms={forms}
                    />
                </PopUpComponent>
            )}

            {isAddConsultationPopupOpen && selectedPatient && (
                <PopUpComponent
                    id="add_consultation_popup"
                    width="80vw"
                    height="80vh"
                    zindex="100"
                    params={popupParams}
                    onClose={handleCloseAddConsultationPopup}
                >
                    <AddConsultation
                        patient={selectedPatient}
                        employees={employees}
                        auth={auth}
                        onClose={handleCloseAddConsultationPopup}
                    />
                </PopUpComponent>
            )}

            {isAddFormPopupOpen && selectedForm && (
                <PopUpComponent
                    id="add_form_popup"
                    width="95vw"
                    height="95vh"
                    zindex="100"
                    params={popupParams}
                    onClose={handleCloseAddFormPopup}
                >
                    <DynamicForm
                        patient={selectedPatient}
                        form={selectedForm}
                        auth={auth}
                        onClose={handleCloseAddFormPopup}
                    />
                </PopUpComponent>
            )}
        </AuthenticatedLayout>
    );
};

Patients.propTypes = {
    auth: PropTypes.object.isRequired,
    patients: PropTypes.array.isRequired,
    employees: PropTypes.array.isRequired,
    forms: PropTypes.array.isRequired,
    search: PropTypes.string,
};

export default Patients;
