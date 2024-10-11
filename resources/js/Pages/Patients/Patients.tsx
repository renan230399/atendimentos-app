import React, { useState, useCallback } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import PopUpComponent from '@/Layouts/PopupComponent';
import CreatePatient from './FormPatient/CreatePatient';
import ViewPatient from './ViewPatient';
import PatientListItem from '@/Pages/Patients/PatientListItem';
import DynamicForm from '@/Pages/Forms/DynamicForm';
import AddConsultation from '@/Pages/Consultations/AddConsultation';
import PropTypes from 'prop-types';
import { formatDateAndAge } from '@/Components/Utils/dateUtils';
import ReactPaginate from 'react-paginate';
import { FaUserPlus } from 'react-icons/fa';
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import Birthdays from './Birthdays';
import PopupHeader from '@/Layouts/PopupHeader';
import { FloatLabel } from 'primereact/floatlabel';

const Patients = ({ auth, patients = [], employees = [], forms = [], search }) => {
    const { data, setData, get, post, put, errors } = useForm({
        search: search || '',
        patient_name: '',
        phone: '',
        birth_date: '',
    });

    // Estados para paginação
    const [currentPage, setCurrentPage] = useState(0);
    const patientsPerPage = 18;
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
    const [isBirthdaysPopupOpen, setIsBirthdaysPopupOpen] = useState(false);

    
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [selectedForm, setSelectedForm] = useState(null);
    const [loading, setLoading] = useState(false);
    const [popupParams, setPopupParams] = useState({});

    const handleOpenPopup = useCallback((e, popupType, patient = null) => {
        setPopupParams({
            clientX: e.clientX,
            clientY: e.clientY,
            classPopup: 'h-[98vh] bg-white w-[96vw]',
          });
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

    const handleOpenBirthdaysPopup = useCallback((e) => {
        setPopupParams({ clientX: e.clientX, clientY: e.clientY });
        setIsBirthdaysPopupOpen(true);
    }, []);
    const handleCloseBirthdaysPopup = useCallback(() => {
        setIsBirthdaysPopupOpen(false);
    }, []);

    const handleOpenAddConsultationPopup = useCallback((e, patient) => {
        setSelectedPatient(patient);
        setPopupParams({
            clientX: e.clientX,
            clientY: e.clientY,
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
        handleSearchSubmit(e);
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
            <Head title="Pacientes" />
 
            <div className="flex flex-wrap bg-white">

                <form onSubmit={handleSearchSubmit} className="w-4/5 pr-6 h-[10vh] overflow-hidden w-[80%] rounded-br-xl ">
                    <div className='md:w-[50%] w-[100%] pl-5 mt-6'>
                    <FloatLabel>
                        <TextInput
                            id="search"
                            value={data.search}
                            className="mt-1 block w-full"
                            placeholder=""
                            onChange={handleSearchChange}
                            autoComplete="off"
                        />                
                        <label htmlFor='username'>Digite o nome do paciente que você procura...</label>
                    </FloatLabel>
                        <InputError message={errors.search} className="mt-2" />
    
                    </div>
                </form>
                <div className='fixed justify-items-end right-0 z-50'  >
                    <div 
                        className=' bg-blue-900 w-[4vw] cursor-pointer mt-6 p-2 shadow-xl rounded-l-md'
                        title='Cadastrar novo paciente'
                        onClick={(e) => handleOpenPopup(e, 'create')}>
                        <FaUserPlus  size={30} className='m-auto  text-white' />
                    </div>
                    <div 
                        className=' bg-pink-600 w-[4vw] cursor-pointer mt-6 p-2 shadow-xl rounded-l-md'
                        title='Cadastrar novo paciente'
                        onClick={(e) => handleOpenBirthdaysPopup(e)}>
                        <LiaBirthdayCakeSolid   size={30} className='m-auto text-white' />
                    </div>
                </div>
 

                <div className='w-[94vw] h-[75vh] overflow-x-hidden overflow-y-auto'>
                     {/* Renderizando pacientes da página atual */}
                     <div className='flex flex-wrap'>
                        {currentPatients.map((patient) => (
                            <PatientListItem
                                key={patient.id}
                                patient={patient}
                                handleOpenEditPopup={(e) => handleOpenPopup(e, 'edit', patient)}
                                handleOpenViewPopup={(e) => handleOpenPopup(e, 'view', patient)}
                                formatDateAndAge={formatDateAndAge}
                            />
                        ))}
                     </div>


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
                    classPopup='bg-white w-[95vw] h-[98vh]'
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
                    zindex="100"
                    params={popupParams}
                    onClose={handleCloseAddConsultationPopup}
                >
                  {/*   <Dashboard
                        patient={selectedPatient}
                        employees={employees}
                        auth={auth}
                        onClose={handleCloseAddConsultationPopup}
                    />*/}
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
            {isBirthdaysPopupOpen && (
                <PopUpComponent
                    id="add_form_popup"
                    width="95vw"
                    height="95vh"
                    zindex="100"
                    params={popupParams}
                    classPopup='bg-white w-[90vw] h-[90vh]'
                    onClose={handleCloseBirthdaysPopup}
                >

                <PopupHeader 
                    icone='/images/icons/birthdays_icon.png'
                    titulo='Aniversariantes'
                    bgColor='bg-pink-500 '
                    />
                <Birthdays patients={patients} />

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
