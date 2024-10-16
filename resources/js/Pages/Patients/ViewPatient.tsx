import React, { useEffect, useState, useCallback } from 'react';
import { formatDateAndAge } from '@/Components/Utils/dateUtils';
import { FaPhone, FaMapMarkerAlt, FaIdCard } from 'react-icons/fa';
import { UserIcon, PhoneIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import PrimaryButton from '@/Components/PrimaryButton';
import ConsultationsList from '@/Pages/Patients/ConsultationsList';
import FormResponseList from './FormResponseList';
import { FaTransgender } from "react-icons/fa6";
import CreatePatient from './FormPatient/CreatePatient';
import { Sidebar } from 'primereact/sidebar';
import DynamicForm from './Forms/DynamicForm';
import InputLabel from '@/Components/InputLabel';
import {Patient, Form, Contact, ContactDetail} from './interfacesPatients'
interface ViewPatientProps {
    patient: Patient; // O paciente a ser visualizado
    forms: Form[]; // Lista de formulários
    closePopupPatient: () =>void;
}
const ViewPatient: React.FC<ViewPatientProps> = ({ patient, forms, closePopupPatient }) => {
    const [consultations, setConsultations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formResponses, setFormResponses] = useState([]); // Estado para respostas de formulários
    const [loadingFormResponses, setLoadingFormResponses] = useState(true);
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const [isFormResponse, setIsFormResponse] = useState(false);
    const [selectedForm, setSelectedForm] = useState<Form | null>(null);


    
    // Função para buscar as consultas do paciente usando fetch
    useEffect(() => {
        if (!patient?.id) return; // Verifica se o ID do paciente está disponível antes de fazer a requisição
        const fetchConsultations = async () => {
            try {
                const response = await fetch(`/patients/${patient.id}/consultations`);
                const data = await response.json();
                setConsultations(data);
                setLoading(false);
            } catch (error) {
                console.error('Erro ao buscar consultas:', error);
                setLoading(false);
            }
        };

        fetchConsultations();
    }, [patient?.id]);

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
    return (
        <>

        <div className={`absolute  p-2 top-0 left-0 rounded-b-lg shadow-xl flex flex-col w-[90%]`}>
            {patient.profile_picture ? (
                <div className="fixed mt-0 pt-0 top-2 left-2 shadow-xl rounded-full overflow-hidden text-left">
                    <img 
                        src={patient.profile_picture}
                        alt={`Foto de ${patient.patient_name}`}
                        className="w-36 h-36 md:w-36 md:h-36 rounded-full m-auto -lg object-cover"
                        />
                     </div>
                ) : (
                <div className="w-36 h-36 fixed mt-0 pt-0 top-2 left-2 bg-gray-400 shadow-xl rounded-full overflow-hidden text-white text-left">
                    N/A
                </div>
            )}

            {/* Título */}
            <p className="text-3xl font-semibold text-gray-600 pl-36 p-1">{patient.patient_name}</p>

        </div>
            {/* Detalhes do Paciente */}
                <div className="w-full text-left ml-40 flex flex-wrap pb-10 border-b border-gray-400">
                    <div className="w-[30%]">
                    <p className="text-lg">
                        {patient.birth_date ? formatDateAndAge(patient.birth_date) : 'Data de nascimento não disponível'}
                    </p>
                    </div>
                    
                    <div className="flex items-center space-x-2 w-[30%]">
                        <FaIdCard className="w-8 text-blue-500 h-auto" />
                        <p className="text-lg">
                            <InputLabel value='CPF'/>
                            {patient.cpf ?? 'Não informado'}
                        </p>
                    </div>
                    <div className="flex items-center space-x-2 w-[30%]">
                        <FaTransgender className="text-gray-600" />
                        <p className="text-lg">
                            <strong>Gênero:</strong>
                            <br /> {patient.gender ?? 'Não informado'}
                        </p>
                    </div>


            <PrimaryButton onClick={() => setIsEditPopupOpen(true)} className="mt-4">
                Editar Paciente
            </PrimaryButton>

            <PrimaryButton className="mt-4 ml-4 bg-green-500">
                Adicionar Consulta
            </PrimaryButton>

                </div>

  

            {/* Detalhes de Localização */}
            <div className="flex flex-wrap bg-white shadow-lg rounded-lg p-6">
                <div className="w-full md:w-1/4 flex justify-center py-5">
                    <img 
                        src="https://keyar-atendimentos.s3.amazonaws.com/icones/localizacao.png" 
                        className="w-24 h-24 md:w-40 md:h-40 object-cover rounded-full shadow-md"
                        alt="Ícone de localização" 
                    />
                </div>

                <div className="w-full md:w-3/4 flex flex-col gap-6 ">
                    <div>
                        <p className="text-xl font-semibold text-gray-800"><strong>Localização:</strong></p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col">
                            <p className="text-lg text-gray-700">   
                                <strong>Estado:</strong> {patient.state ?? 'Não informado'}
                            </p>
                            <p className="text-lg text-gray-700">
                                <strong>Cidade:</strong> {patient.city ?? 'Não informado'}
                            </p>
                        </div>

                        <div className="flex flex-col">
                            <p className="text-lg text-gray-700">
                                <strong>Bairro:</strong> {patient.neighborhood ?? 'Não informado'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center text-lg text-gray-700">
                        <FaMapMarkerAlt className="text-blue-500 mr-3" />
                        <h1>
                            <strong>Endereço:</strong>
                            {patient.street && patient.house_number ? (
                                `${patient.street}, ${patient.house_number}`
                            ) : (
                                'Endereço não informado'
                            )}
                        </h1>
                    </div>

                    <div className="text-lg text-gray-700">
                        <p><strong>Complemento:</strong> {patient.address_complement ?? 'Não informado'}</p>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap">
                <div className="w-[100%] md:w-[20%] m-auto py-5">
                    <img src="https://keyar-atendimentos.s3.amazonaws.com/icones/contatos.png" className="m-auto w-20 h-20 md:w-40 md:h-40" />
                </div>
                
                <div className="w-[100%] md:w-[78%] flex flex-wrap gap-1 border-b-2 p-5">
    <div className="w-[100%]">
        <p className="text-xl font-semibold mb-4"><strong>Contatos:</strong></p>
                    {Array.isArray(patient.personal_contacts) && patient.personal_contacts.length > 0 ? (
                        patient.personal_contacts.map((detail, contactIndex) => (
                            <div key={contactIndex} className="flex items-center m-auto w-full">
                                <div className='m-2'>
                                    <p><strong>Tipo:</strong> {detail.type}</p>
                                </div>
                                <div className='m-2'>
                                    <p><strong>Categoria:</strong> {detail.category}</p>
                                </div>
                                <div className='m-2'>
                                    {detail.category === 'link' ? (
                                        <a
                                            href={detail.value}
                                            className="text-blue-500 underline"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {detail.value}
                                        </a>
                                    ) : (
                                        <p>{detail.value}</p>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-600">Nenhum detalhe de contato disponível.</p>
                    )}
        {Array.isArray(parsedContacts) && parsedContacts.length > 0 ? (
    <div className="flex flex-wrap gap-4">
        {parsedContacts.map((contact, index) => (
            <div
                key={index}
                className="w-full md:w-[100%] py-3 bg-white flex flex-wrap shadow-md rounded-lg border border-gray-200"
            >
                <div className="flex items-center m-auto">
                    <UserIcon className="h-5 w-5 text-blue-500 mr-2" />
                    <p><strong>Nome:</strong> {contact.name}</p>
                </div>
                <div className="flex items-center m-auto">
                    <UserGroupIcon className="h-5 w-5 text-green-500 mr-2" />
                    <p><strong>Relação:</strong> {contact.relation}</p>
                </div>
                <div className="flex flex-wrap items-center m-auto w-full">
                    {Array.isArray(contact.contacts) && contact.contacts.length > 0 ? (
                        contact.contacts.map((detail, contactIndex) => (
                            <div key={contactIndex} className="flex items-center m-auto w-full">
                                <div className='m-2'>
                                    <p><strong>Tipo:</strong> {detail.type}</p>
                                </div>
                                <div className='m-2'>
                                    <p><strong>Categoria:</strong> {detail.category}</p>
                                </div>
                                <div className='m-2'>
                                    {detail.category === 'link' ? (
                                        <a
                                            href={detail.value}
                                            className="text-blue-500 underline"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {detail.value}
                                        </a>
                                    ) : (
                                        <p>{detail.value}</p>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-600">Nenhum detalhe de contato disponível.</p>
                    )}
                </div>
            </div>
        ))}
    </div>
) : (
    <p className="text-gray-600">Não há contatos disponíveis.</p>
)}


    </div>
</div>

            </div>
            {forms.length > 0 ? (
                <div className="flex m-auto flex-wrap">
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


            {/* Lista de Consultas do Paciente */}
            <ConsultationsList consultations={consultations} loading={loading} />
            
             {/* Exibição das respostas dos formulários */}
             <FormResponseList 
                formResponses={formResponses} 
                loadingFormResponses={loadingFormResponses} 
            />
             <Sidebar
                visible={isEditPopupOpen}
                position="left"
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
                position="left"
                className="pt-0 xl:w-[96vw] md:w-[96vw] w-[96vw] h-screen overflow-auto bg-white"
                onHide={handleCloseAddFormPopup}
            >

            {selectedForm && (

                    <DynamicForm
                        patient={patient}
                        form={selectedForm}
                        onClose={handleCloseAddFormPopup}
                    />
            )}
            </Sidebar>

        </>
    );
};

export default ViewPatient;
