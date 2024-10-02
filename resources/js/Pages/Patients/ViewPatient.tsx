import React, { useEffect, useState } from 'react';
import { formatDateAndAge } from '@/Components/Utils/dateUtils';
import { FaPhone, FaMapMarkerAlt, FaIdCard } from 'react-icons/fa';
import { UserIcon, PhoneIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import PrimaryButton from '@/Components/PrimaryButton';
import ConsultationsList from '@/Pages/Consultations/ConsultationsList';
import FormResponseList from './FormResponseList';

const ViewPatient = ({ patient, handleOpenEditPopup, handleOpenAddConsultationPopup, handleOpenAddFormPopup, forms }) => {
    const [consultations, setConsultations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formResponses, setFormResponses] = useState([]); // Estado para respostas de formulários
    const [loadingFormResponses, setLoadingFormResponses] = useState(true);

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
                console.error('Erro ao buscar respostas de formulários:', error);
                setLoadingFormResponses(false);
            }
        };

        fetchFormResponses();
    }, [patient?.id]);

    if (!patient) {
        return <p>Paciente não encontrado</p>;
    }
    return (
        <>
            {/* Detalhes do Paciente */}
            <div className="p-1 rounded-lg bg-white flex flex-wrap space-y-6 pb-10">
                <h2 className="w-full text-2xl font-bold text-gray-800 mb-4">Detalhes do Paciente</h2>

                <div className="w-full md:w-1/4 flex justify-center md:justify-start">
                    {patient.profile_picture ? (
                        <img
                            src={patient.profile_picture}
                            alt={`Foto de ${patient.patient_name}`}
                            className="w-40 h-40 md:w-48 md:h-48 rounded-full m-auto shadow-lg object-cover"
                        />
                    ) : (
                        <div className="w-40 h-40 bg-gray-300 m-auto rounded-full flex items-center justify-center text-gray-600 shadow-lg">
                            N/A
                        </div>
                    )}
                </div>

                <div className="w-full md:w-3/4 text-left px-5 flex flex-wrap pb-10 shadow-lg">
                    <div className="w-[100%]">
                        <p className="text-sm font-medium text-gray-500">Nome</p>
                        <p className="text-3xl font-semibold text-gray-800">{patient.patient_name}</p>
                    </div>

                    <div className="w-[30%]">
                        <p className="text-sm font-medium text-gray-500">Data de Nascimento</p>
                        <p className="text-lg">{formatDateAndAge(patient.birth_date)}</p>
                    </div>
                    <div className="flex items-center space-x-2 w-[30%]">
                        <FaIdCard className="text-gray-600" />
                        <p className="text-lg">
                            <strong>CPF:</strong>
                            <br /> {patient.cpf ?? 'Não informado'}
                        </p>
                    </div>
                    <div className="flex items-center space-x-2 w-[30%]">
                        <FaPhone className="text-gray-600" />
                        <p className="text-lg">
                            <strong>Telefone:</strong> {patient.phone ?? 'Não informado'}
                        </p>
                    </div>

                    <PrimaryButton onClick={handleOpenEditPopup} className="mt-4">
                        Editar Paciente
                    </PrimaryButton>

                    <PrimaryButton onClick={handleOpenAddConsultationPopup} className="mt-4 ml-4 bg-green-500">
                        Adicionar Consulta
                    </PrimaryButton>
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
                                    onClick={(e) => handleOpenAddFormPopup(e, form)} // Passando o evento 'e' e o formulário
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

            {/* Detalhes de Contatos */}
            <div className="flex flex-wrap">
                <div className="w-[100%] md:w-[20%] m-auto py-5">
                    <img src="https://keyar-atendimentos.s3.amazonaws.com/icones/contatos.png" className="m-auto w-20 h-20 md:w-40 md:h-40" />
                </div>
                
                <div className="w-[100%] md:w-[78%] flex flex-wrap gap-1 border-b-2 p-5">
                    <div className="w-[100%]">
                        <p className="text-xl font-semibold mb-4"><strong>Contatos:</strong></p>

                        {typeof patient.contacts === 'string' ? (
                            (() => {
                                try {
                                    const contactsArray = JSON.parse(patient.contacts);
                                    return (
                                        Array.isArray(contactsArray) && contactsArray.length > 0 ? (
                                            <div className="flex flex-wrap gap-4">
                                                {contactsArray.map((contact, index) => (
                                                    <div key={index} className="w-full md:w-[30%] p-4 bg-white shadow-md rounded-lg border border-gray-200">
                                                        <div className="flex items-center mb-2">
                                                            <UserIcon className="h-5 w-5 text-blue-500 mr-2" />
                                                            <p><strong>Nome:</strong> {contact.name}</p>
                                                        </div>
                                                        <div className="flex items-center mb-2">
                                                            <UserGroupIcon className="h-5 w-5 text-green-500 mr-2" />
                                                            <p><strong>Relação:</strong> {contact.relation}</p>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <PhoneIcon className="h-5 w-5 text-red-500 mr-2" />
                                                            <p><strong>Telefone:</strong> {contact.phone}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-600">Não há contatos disponíveis.</p>
                                        )
                                    );
                                } catch (error) {
                                    console.error('Erro ao analisar JSON:', error);
                                    return <p className="text-red-600">Erro ao carregar os contatos.</p>;
                                }
                            })()
                        ) : (
                            <p className="text-gray-600">Não há contatos disponíveis.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Lista de Consultas do Paciente */}
            <ConsultationsList consultations={consultations} loading={loading} />
            
             {/* Exibição das respostas dos formulários */}
             <FormResponseList formResponses={formResponses} loadingFormResponses={loadingFormResponses} forms={forms}/>

        </>
    );
};

export default ViewPatient;
