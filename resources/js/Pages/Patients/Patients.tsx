import React, { useState, useCallback, useEffect } from 'react';
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
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';

import IconButton from '@/Components/Utils/IconButton';
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
    const patientsPerPage = 21;
    const offset = currentPage * patientsPerPage;
    const currentPatients = filteredPatients.slice(offset, offset + patientsPerPage);
    const pageCount = Math.ceil(filteredPatients.length / patientsPerPage);

    // Estado de carregamento
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (patients.length > 0) {
            setFilteredPatients(patients);
            setLoading(false);
        }
    }, [patients]);

    const { data, setData, get, errors } = useForm({
        search: search || '',
    });

    // Função para buscar pacientes, ordenar e mostrar spinner
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData('search', e.target.value);
        
        // Ativa o loading enquanto filtra
        setLoading(true);
        
        const filtered = patients
            .filter((patient) =>
                patient.patient_name.toLowerCase().includes(e.target.value.toLowerCase())
            )
            .sort((a, b) => a.patient_name.localeCompare(b.patient_name)); // Ordena alfabeticamente

        // Atualiza os pacientes filtrados e desativa o loading
        setFilteredPatients(filtered);
        setCurrentPage(0);
        setLoading(false);  // Desativa o loading quando o filtro termina
    };


    const handlePageClick = (data: { selected: number }) => {
        setCurrentPage(data.selected);
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
const closePopupPatient = () =>{
    setSelectedPatient(null);
    setIsViewPopupOpen(false);
}
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Pacientes" />
              {/* Botões de ações */}
              <div className="fixed right-0 pl-2 ml-5 h-screen w-[15vw] md:w-[5vw] xl:w-[5vw]">
              <IconButton
                    icon={<FaUserPlus size={30} className="text-white" />}
                    title="Locais do estoque"
                    onClick={() => setIsCreatePopupOpen(true)}
                    bgColorFrom = 'from-blue-500'
                    bgColorTo = 'to-blue-700'
                /> 
              <IconButton
                    icon={<LiaBirthdayCakeSolid size={30} className="text-white" />}
                    title="Locais do estoque"
                    onClick={() => setIsBirthdaysPopupOpen(true)}
                    bgColorFrom="from-pink-300"
                    bgColorTo="to-pink-400"
                    hoverBgColorFrom="from-blue-800"
                    hoverBgColorTo="to-red-800"
                    text="Aniversariantes"
                /> 
            </div>

            <div className="bg-white overflow-y-hidden ">

                {/* Barra de busca */}
                <div className="w-4/5 pr-6 h-[10%] md:h-[6vh] xl:h-[10vh] overflow-hidden w-[90%] rounded-br-xl ">
                    <div className='md:w-[50%] w-[100%] pl-5 mt-6'>
                    <FloatLabel>
                        <InputText 
                            id="search" 
                            className='w-full rounded p-2 border-gray-700 border'
                            value={data.search} // Certifique-se de usar o valor do estado correto
                            onChange={(e) => handleSearchChange(e)} // Passe o evento completo
                        />
                        <label htmlFor="search">Digite o nome do paciente...</label>
                    </FloatLabel>
                        <InputError message={errors.search} className="mt-2" />
                    </div>
                </div>

                {/* Lista de pacientes e paginação */}
                <div className='w-[88%] md:w-[94vw] h-[75vh] top-0 xl:h-[68vh] md:h-[85%] pb-6 xl:border bg-gray-100 rounded overflow-x-hidden overflow-y-auto'>
                <div className='flex flex-wrap md:p-1'>
                    {/* Se estiver carregando, mostra o spinner, caso contrário, renderiza os pacientes */}
                    {loading ? (
                        <div className="flex justify-center items-center w-full h-full">
                            <ProgressSpinner />
                        </div>
                    ) : (
                        currentPatients.map((patient) => (
                            <PatientListItem
                                key={patient.id}
                                patient={patient}
                                openViewPatient={handleOpenPopup} // Corrigido para passar o método de abertura de popup
                            />
                        ))
                    )}
                </div>
            </div>

  
                <div className="mt-6 m-auto w-full h-[20%] bottom-0 p-4 justify-center bg-white">
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
                onHide={() => closePopupPatient()}
                className="w-[96vw] h-[98vh] m-auto rounded-xl "
            >
                {selectedPatient && (
                    <ViewPatient
                        patient={selectedPatient}
                        forms={forms}
                        closePopupPatient={() => closePopupPatient() }

                    />
                )}
            </Dialog>
        </AuthenticatedLayout>
    );
};

export default Patients;
