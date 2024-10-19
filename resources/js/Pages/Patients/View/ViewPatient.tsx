import React, { useEffect, useState, useCallback, Suspense, lazy, useRef } from 'react';
import { FaPhone, FaMapMarkerAlt, FaIdCard,FaCalendarAlt } from 'react-icons/fa';
import { Image } from 'primereact/image';
import PrimaryButton from '@/Components/PrimaryButton';
import { CiEdit } from "react-icons/ci";
import FormResponseList from '../FormResponseList';
import CreatePatient from '../FormPatient/CreatePatient';
import { Sidebar } from 'primereact/sidebar';
import { TabView, TabPanel } from 'primereact/tabview';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import ContactsTabView from './ContactsTabView';
//import DynamicForm from './Forms/DynamicForm';
const DynamicForm = lazy(() => import('../Forms/DynamicForm'));

import InputLabel from '@/Components/InputLabel';
import {Patient, Form, Contact, ContactDetail} from '../interfacesPatients'
interface ViewPatientProps {
    patient: Patient; // O paciente a ser visualizado
    forms: Form[]; // Lista de formulários
    closePopupPatient: () =>void;
}

const ViewPatient: React.FC<ViewPatientProps> = ({ patient, forms, closePopupPatient }) => {

    const [formResponses, setFormResponses] = useState([]); // Estado para respostas de formulários
    const [loadingFormResponses, setLoadingFormResponses] = useState(true);
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const [isFormResponse, setIsFormResponse] = useState(false);
    const [selectedForm, setSelectedForm] = useState<Form | null>(null);
    console.log(patient);
    
  

    if (!patient) {
        return <p>Paciente não encontrado</p>;
    }

       // Função para buscar as respostas de formulários do paciente
       useEffect(() => {
        if (!patient?.id) return;

        const fetchFormResponses = async () => {
            try {
                const response = await fetch(`/patients/${patient.id}/form-responses`);
                const data = await response.json();
                setFormResponses(data);
                setLoadingFormResponses(false);
            } catch (error) {
                //console.error('Erro ao buscar respostas de formulários:', error);
                setLoadingFormResponses(false);
            }
        };

        fetchFormResponses();
    }, [patient?.id]);

    if (!patient) {
        return <p>Paciente não encontrado</p>;
    }
    const handleOpenAddFormPopup = useCallback((form: Form) => {
        setSelectedForm(form);
        setIsFormResponse(true);
    }, []);
    
    const handleCloseAddFormPopup = useCallback(() => {
        setSelectedForm(null);
        setIsFormResponse(false);
    }, []);
        console.log(patient);
        // Verifique se contacts é uma string antes de fazer o parsing
        let parsedContacts: Contact[] = [];

        // Verifique se contacts é uma string e faça o parsing, ou se já é um array
        if (typeof patient.contacts === 'string') {
            try {
                parsedContacts = JSON.parse(patient.contacts);
            } catch (error) {
                console.error("Erro ao fazer o parsing dos contatos:", error);
            }
        } else if (Array.isArray(patient.contacts)) {
            parsedContacts = patient.contacts;
        }
        let parsedPersonalContacts: ContactDetail[] = [];

        // Verifique se contacts é uma string e faça o parsing, ou se já é um array
        if (typeof patient.personal_contacts === 'string') {
            try {
                parsedPersonalContacts = JSON.parse(patient.personal_contacts);
            } catch (error) {
                console.error("Erro ao fazer o parsing dos contatos:", error);
            }
        } else if (Array.isArray(patient.personal_contacts)) {
            parsedPersonalContacts = patient.personal_contacts;
        } 
        const address = {
            state: patient.state ?? 'Não informado',
            city: patient.city ?? 'Não informado',
            neighborhood: patient.neighborhood ?? 'Não informado',
            street: patient.street ?? null,
            house_number: patient.house_number ?? null,
            address_complement: patient.address_complement ?? 'Não informado',
        };
        
    return (
        <>


            {/* Detalhes do Paciente */}
<div className="w-[90%] absolute top-0 p-1 border-gray-100 border-b bg-white rounded-lg shadow-sm">
    <div className="flex gap-6">
    
        {/* Data de nascimento */}
        <div className="mt-2 w-full">
        <p className="xl:text-4xl text-gray-800">{patient.patient_name}</p>
    </div>
      
        {/* Botões de ação */}
        <div className="flex space-x-4 my-auto ">
            <PrimaryButton onClick={() => setIsEditPopupOpen(true)} className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md transition-all duration-300">
                <CiEdit className='w-6 h-6'/>
            </PrimaryButton>
        </div>
    </div>


</div>
<div className='flex flex-wrap '>
<div className="m-auto w-full md:w-full xl:w-[20%] text-center">
{patient.profile_picture ? (
                <Image 
                    src={patient.profile_picture}
                    alt="Image"
                    className='w-[30%] xl:w-[100%] shadow-md zoom'
                    preview 
                />

    
    ) : (
        <div className="top-2 left-2 w-36 h-36 bg-gray-400 rounded-full flex items-center justify-center text-white text-lg shadow-xl">
            N/A
        </div>
    )}
    </div>
<div className='xl:w-[78%] w-full'>
<ContactsTabView 
    patientId={patient.id}
    personalContacts={patient.personal_contacts || []} 
    contacts={patient.contacts || []} 
    address={address} 
    patient={patient}
    />

</div>
</div>


              

            {forms.length > 0 ? (
                <div className="flex m-auto flex-wrap ">
                    {forms.map((form) => (
                        <div key={form.id} className="md:w-[18%] w-[50%] p-4 m-auto bg-gray-100 rounded-lg shadow">
                        <img
                            src={form.icon}
                            alt={`Ícone  de ${form.name}`}
                            className="w-[50%] md:w-16 md:h-16 m-auto"
                        />
                            <h2 className="font-semibold">{form.name}</h2>
                            <div className="flex space-x-4">
                                <PrimaryButton 
                                    onClick={() => handleOpenAddFormPopup(form)} // Passando o evento 'e' e o formulário
                                    className="mt-4 ml-4 bg-green-500"
                                >
                                    Preencher Formulário
                                </PrimaryButton>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Nenhum formulário encontrado.</p>
            )}
            {/* Detalhes de Contatos */}


            
             {/* Exibição das respostas dos formulário
             <FormResponseList 
                formResponses={formResponses} 
                loadingFormResponses={loadingFormResponses} 
            />s */}
             <Sidebar
                visible={isEditPopupOpen}
                position="right"
                className="pt-0 xl:w-[96vw] md:w-[96vw] w-[96vw] h-screen overflow-auto bg-white"
                onHide={() => setIsEditPopupOpen(false)}
            >
                <CreatePatient
                    patient={patient}
                    handleClosePatientForm={() => setIsEditPopupOpen(false)} // Fecha apenas no modo de cadastro
                    onSave={() => {
                        // Não fecha o modal no modo de edição
                    }}
                />
            </Sidebar>
            <Sidebar
                visible={isFormResponse}
                position="right"
                className="pt-0 xl:w-[96vw] md:w-[96vw] w-[96vw] h-screen overflow-y-auto overflow-x-hidden bg-white"
                onHide={handleCloseAddFormPopup}
            >

            {selectedForm && (
                <Suspense fallback={<div>Carregando perfil...</div>}>
                        <DynamicForm
                        patient={patient}
                        form={selectedForm}
                        onClose={handleCloseAddFormPopup}
                    />
                </Suspense>
 
            )}
            </Sidebar>

        </>
    );
};

export default ViewPatient;
