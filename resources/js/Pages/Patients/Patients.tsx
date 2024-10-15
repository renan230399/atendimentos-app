import React, { useState, useCallback } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import { Dialog } from 'primereact/dialog';
import TextInput from '@/Components/TextInput';
import CreatePatient from './FormPatient/CreatePatient';
import ViewPatient from './ViewPatient';
import PatientListItem from '@/Pages/Patients/PatientListItem';
import ReactPaginate from 'react-paginate';
import { FaUserPlus } from 'react-icons/fa';
import { LiaBirthdayCakeSolid } from 'react-icons/lia';
import Birthdays from './Birthdays';
import PopupHeader from '@/Layouts/PopupHeader';
import { FloatLabel } from 'primereact/floatlabel';
import {Patient, Form, Employee} from './interfacesPatients';
import { User } from '@/types';

interface PatientsProps {
    auth: {
        user: User;
    };
    patients: Patient[];
    employees: Employee[];
    forms: Form[];
    search?: string;
}

const Patients: React.FC<PatientsProps> = ({ auth, patients = [], employees = [], forms = [], search }) => {
    const [filteredPatients, setFilteredPatients] = useState<Patient[]>(patients);
    const [currentPage, setCurrentPage] = useState(0);
    const patientsPerPage = 18;
    const offset = currentPage * patientsPerPage;
    const currentPatients = filteredPatients.slice(offset, offset + patientsPerPage);
    const pageCount = Math.ceil(filteredPatients.length / patientsPerPage);

    const { data, setData, get, errors } = useForm({
        search: search || '',
    });

    const handlePageClick = (data: { selected: number }) => {
        setCurrentPage(data.selected);
    };
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData('search', e.target.value);
        const filtered = patients.filter((patient) =>
            patient.patient_name.toLowerCase().includes(e.target.value.toLowerCase())
        );
        setFilteredPatients(filtered);
        setCurrentPage(0);
    };

    const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);
    const [isViewPopupOpen, setIsViewPopupOpen] = useState(false);
    const [isBirthdaysPopupOpen, setIsBirthdaysPopupOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [savePatient, setSavePatient] = useState(false);

    const handleOpenPopup = useCallback((e: React.MouseEvent, patient: Patient | null = null) => {
        setSelectedPatient(patient);
        setIsViewPopupOpen(true);
    }, []);

    const handleClosePatientForm = () => {
        setIsCreatePopupOpen(false);
        setSelectedPatient(null);
    };
    console.log(forms);


    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Pacientes" />

            <div className="flex flex-wrap bg-white">

                {/* Barra de busca */}
                <form className="w-4/5 pr-6 h-[10vh] overflow-hidden w-[80%] rounded-br-xl ">
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
                            <label htmlFor='search'>Digite o nome do paciente que você procura...</label>
                        </FloatLabel>
                        <InputError message={errors.search} className="mt-2" />
                    </div>
                </form>

                {/* Botões de ações */}
                <div className='fixed justify-items-end right-0 z-50'>
                    <div
                        className='bg-blue-900 w-[4vw] cursor-pointer mt-6 p-2 shadow-xl rounded-l-md'
                        title='Cadastrar novo paciente'
                        onClick={(e) => setIsCreatePopupOpen(true)}
                    >
                        <FaUserPlus size={30} className='m-auto text-white' />
                    </div>
                    <div
                        className='bg-pink-600 w-[4vw] cursor-pointer mt-6 p-2 shadow-xl rounded-l-md'
                        title='Ver aniversariantes'
                        onClick={(e) => setIsCreatePopupOpen(true)}
                    >
                        <LiaBirthdayCakeSolid size={30} className='m-auto text-white' />
                    </div>
                </div>

                {/* Lista de pacientes e paginação */}
                <div className='w-[94vw] h-[75vh] overflow-x-hidden overflow-y-auto'>
                    <div className='flex flex-wrap'>
                        {currentPatients.map((patient) => (
                            <PatientListItem
                                key={patient.id}
                                patient={patient}
                                openViewPatient={handleOpenPopup} // Corrigido para passar o método de abertura de popup
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
            {/* Modal de criação de paciente */}
            <Dialog
                visible={isCreatePopupOpen}
                onHide={handleClosePatientForm}
                className="w-[96vw] h-[98vh] m-auto rounded-xl "
            >
                <CreatePatient 
                    onSave={setSavePatient} 
                    handleClosePatientForm={handleClosePatientForm}
                />
            </Dialog>

            {/* Popups de aniversariantes */}
            <Dialog
                visible={isBirthdaysPopupOpen}
                onHide={() => setIsBirthdaysPopupOpen(false)}
                className="w-[96vw] h-[98vh] m-auto rounded-xl "
            >
                <PopupHeader
                    icon='/images/icons/birthdays_icon.png'
                    title='Aniversariantes'
                    bgColor='bg-pink-500 '
                />
                <Birthdays patients={filteredPatients} />
            </Dialog>

            {/* Modal de visualização de paciente */}
            <Dialog
                visible={isViewPopupOpen}
                onHide={() => setIsViewPopupOpen(false)}
                className="w-[96vw] h-[98vh] m-auto rounded-xl "
            >
                {selectedPatient && (
                    <ViewPatient
                        patient={selectedPatient}
                        handleClosePatientForm={(e) => handleOpenPopup(e, selectedPatient)}
                        forms={forms}
                    />
                )}
            </Dialog>
        </AuthenticatedLayout>
    );
};

export default Patients;
