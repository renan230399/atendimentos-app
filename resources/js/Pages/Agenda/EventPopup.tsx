import React, { useState, useCallback, useEffect } from 'react';
import PopUpComponent from '@/Layouts/PopupComponent';
import moment from 'moment';
import PropTypes from 'prop-types';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import ViewPatient from '@/Pages/Patients/ViewPatient'; // Importando o componente de visualização do paciente
import PrimaryButton from '@/Components/PrimaryButton';
import DynamicForm from '../Forms/DynamicForm';
const EventPopup = ({auth, selectedEvent, params, onClose, onDelete, logo, forms = [] }) => {
    // Estado para controlar a exibição do popup de visualização do paciente
    const [isViewPatientPopupOpen, setIsViewPatientPopupOpen] = useState(false);
    const [popupParams, setPopupParams] = useState(params);
    const [isAddFormPopupOpen, setIsAddFormPopupOpen] = useState(false);
    const [selectedForm, setSelectedForm] = useState(null);
    const [consultations, setConsultations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formResponses, setFormResponses] = useState([]); // Estado para respostas de formulários
    const [loadingFormResponses, setLoadingFormResponses] = useState(true);

    useEffect(() => {
        if (!selectedEvent.patient?.id) return; // Verifica se o ID do paciente está disponível antes de fazer a requisição

        const fetchConsultations = async () => {
            try {
                const response = await fetch(`/patients/${selectedEvent.patient.id}/consultations`);
                const data = await response.json();
                setConsultations(data);
                setLoading(false);
            } catch (error) {
                console.error('Erro ao buscar consultas:', error);
                setLoading(false);
            }
        };

        fetchConsultations();
    }, [selectedEvent.patient?.id]);



          // Função para buscar as respostas de formulários do paciente
          useEffect(() => {
            if (!selectedEvent.patient?.id) return;
    
            const fetchFormResponses = async () => {
                try {
                    const response = await fetch(`/patients/${selectedEvent.patient.id}/form-responses`);
                    const data = await response.json();
                    setFormResponses(data);
                    setLoadingFormResponses(false);
                } catch (error) {
                    console.error('Erro ao buscar respostas de formulários:', error);
                    setLoadingFormResponses(false);
                }
            };
    
            fetchFormResponses();
        }, [selectedEvent.patient?.id]);
    // Função para abrir o popup de visualização do paciente
    const handleOpenConsultationPopup = useCallback(() => {
        setPopupParams(params);
        setIsViewPatientPopupOpen(true);
    }, [params]);

    // Função para fechar o popup de visualização do paciente
    const handleCloseViewPatientPopup = useCallback(() => {
        setIsViewPatientPopupOpen(false);
    }, []);
    const handleOpenAddFormPopup = useCallback((e, form) => {
        setSelectedForm(form);
        setPopupParams({ clientX: e.clientX, clientY: e.clientY });
        setIsAddFormPopupOpen(true);
    }, []);
    const handleCloseAddFormPopup = useCallback(() => {
        setIsAddFormPopupOpen(false);
    }, []);
    return (
        <>
            <PopUpComponent id="detalhesEvento" params={params} onClose={onClose} 
            
            width="80vw"
            height="80vh"
            zindex="100">
                <div className='flex flex-wrap px-10 py-5'>
                    <div className='w-[35%]'>
                        {logo ? (
                            <img
                            src={logo}
                            alt='logo da empresa'
                            className="h-40 w-auto m-auto "
                        />
                                ) : (
                                    <div className="w-30 h-30 bg-gray-300 m-auto rounded-full flex items-center justify-center text-gray-600 shadow-lg">
                                        N/A
                                    </div>
                                )}
                    </div>
                    
                    {/* Título do evento/consulta */}
                    <div className='text-center flex'>
                        <div className="w-full flex justify-center md:justify-start">
                            {selectedEvent.patient.profile_picture ? (
                                <img
                                    src={selectedEvent.patient.profile_picture}
                                    alt={`Foto de ${selectedEvent.patient.patient_name}`}
                                    className="w-30 h-0 md:w-40 md:h-40 rounded-full m-auto shadow-lg object-cover"
                                />
                            ) : (
                                <div className="w-30 h-30 bg-gray-300 m-auto rounded-full flex items-center justify-center text-gray-600 shadow-lg">
                                    N/A
                                </div>
                            )}
                        </div>
                        <h2 className='text-2xl font-bold mb-4'>{selectedEvent.title}</h2>

                    </div>

                    {/* Informações sobre a consulta */}
                    <div className='w-full md:w-1/2 px-4'>
                        <InputLabel htmlFor='paciente' value='Paciente:' />
                        <TextInput
                            id="paciente"
                            value={selectedEvent.patient_id ? selectedEvent.patient_id : 'Desconhecido'}
                            readOnly
                            className="mt-1 block w-full bg-gray-100"
                        />
                        </div>

                    <div className='w-full md:w-1/2 px-4'>
                        <InputLabel htmlFor='profissional' value='Profissional:' />
                        <TextInput
                            id="profissional"
                            value={selectedEvent.professional}
                            readOnly
                            className="mt-1 block w-full bg-gray-100"
                        />

                    </div>
                    <div className='w-full md:w-1/2 px-4'>
                        <InputLabel htmlFor='profissional' value='Preço:' />
                        <TextInput
                            id="profissional"
                            value={selectedEvent.price}
                            readOnly
                            className="mt-1 block w-full bg-gray-100"
                        />

                    </div>
                    <div className='w-full md:w-1/2 px-4'>
                        <InputLabel htmlFor='data_inicio' value='Início:' />
                        <TextInput
                            id="data_inicio"
                            value={moment(selectedEvent.start).format('DD/MM/YYYY HH:mm')}
                            readOnly
                            className="mt-1 block w-full bg-gray-100"
                        />
                    </div>

                    <div className='w-full md:w-1/2 px-4'>
                        <InputLabel htmlFor='data_fim' value='Fim:' />
                        <TextInput
                            id="data_fim"
                            value={moment(selectedEvent.end).format('DD/MM/YYYY HH:mm')}
                            readOnly
                            className="mt-1 block w-full bg-gray-100"
                        />
                    </div>

                    <div className='w-full px-4'>
                        <InputLabel htmlFor='observacoes' value='Observações:' />
                        <TextInput
                            id="observacoes"
                            value={selectedEvent.observacoes || 'Nenhuma observação'}
                            readOnly
                            className="mt-1 block w-full bg-gray-100"
                        />
                    </div>

                    {/* Ações: Concluir, Excluir e Visualizar Paciente */}
                    <div className='w-full flex justify-between mt-6'>
                        <button className='bg-green-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-green-600'>
                            Executar Consulta
                        </button>
                        <button
                            onClick={() => onDelete(selectedEvent.id)}
                            className='bg-red-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-red-600'
                        >
                            Excluir Consulta
                        </button>
                        <button
                            onClick={handleOpenConsultationPopup}
                            className='bg-blue-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-600'
                        >
                            Visualizar Paciente
                        </button>
                    </div>

                </div>
            </PopUpComponent>

            {/* Popup para visualização do paciente */}
            {isViewPatientPopupOpen && (
                <PopUpComponent
                    id="view_patient_popup"
                    zindex="102"
                    paddingBottom='0px'
                    params={popupParams}
                    onClose={handleCloseViewPatientPopup}
                >
                    <div className='h-[90%] overflow-y-auto'>
                        <div className='flex flex-wrap px-10 py-5 '>
                            <div className='w-[15%]'>
                                {logo ? (
                                    <img
                                    src={logo}
                                    alt='logo da empresa'
                                    className="h-auto w-full m-auto "
                                />
                                        ) : (
                                            <div className="w-30 h-30 bg-gray-300 m-auto rounded-full flex items-center justify-center text-gray-600 shadow-lg">
                                                N/A
                                            </div>
                                        )}
                            </div>
                            <div className='text-center flex w-[85%]'>
                            <div className="w-[20%] flex justify-center md:justify-start">
                                {selectedEvent.patient.profile_picture ? (
                                    <img
                                        src={selectedEvent.patient.profile_picture}
                                        alt={`Foto de ${selectedEvent.patient.patient_name}`}
                                        className="w-30 h-0 md:w-40 md:h-40 rounded-full m-auto shadow-lg object-cover"
                                    />
                                ) : (
                                    <div className="w-30 h-30 bg-gray-300 m-auto rounded-full flex items-center justify-center text-gray-600 shadow-lg">
                                        N/A
                                    </div>
                                )}
                            </div>
                            <div className='my-auto'>
                                <h2 className='text-4xl font-bold mb-4'>{selectedEvent.patient.patient_name}</h2>
                            </div>

                        </div>
                        
                        </div>
                        {forms.length > 0 ? (
                            <div className="flex flex-wrap w-[40%]">
                            {forms.map((form) => (
                                        <div key={form.id} className="md:w-[100%] flex p-4 m-auto bg-gray-100 rounded-lg shadow border-b border-black">
                                        <img
                                            src={form.icon}
                                            alt={`Ícone  de ${form.name}`}
                                            className="md:w-16 md:h-16 m-auto"
                                        />
                                            <h2 className="font-semibold w-[50%] m-auto text-left">{form.name}</h2>
                                            <div className="flex space-x-4">
                                                <PrimaryButton 
                                                    onClick={(e) => handleOpenAddFormPopup(e, form)} // Passando o evento 'e' e o formulário
                                                    className="mt-1 ml-1 bg-green-500"
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
                                        {/* Exibição das respostas dos formulários */}
                <div className="mt-8">
                    <h3 className="text-2xl font-bold mb-4">Respostas de Formulários</h3>
                        {loadingFormResponses ? (
                            <p>Carregando respostas...</p>
                        ) : formResponses.length > 0 ? (
                            <div className="space-y-4">
                                {formResponses.map((response) => (
                                    <div key={response.id} className="bg-gray-100 p-4 rounded-lg shadow">
                                        <img
                                            src={response.form.icon}
                                            alt={`Ícone  de ${response.form.name}`}
                                            className="w-[20%] md:w-10 md:h-10 m-auto"
                                        />
                                        <h4 className="text-lg font-semibold mb-2">{response.form.name}</h4>
                                        <h4 className="text-lg font-semibold mb-2">
                                            Preenchido em: {new Date(response.form.created_at).toLocaleDateString('pt-BR')}
                                        </h4>
                                        <ul className="list-disc pl-5">
                                            {response.form_response_details.map((detail) => (
                                                <li key={detail.id}>
                                                    <strong>{detail.form_field.label}:</strong> {detail.response}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>Nenhuma resposta de formulário encontrada para este paciente.</p>
                        )}

                    </div>
                    </div>
                    
                <div className='fixed b-0 h-[10%] w-full bg-white shadow-lg border-t border-black-500'>
                <PrimaryButton 
                    className="mt-1 ml-1 bg-green-500 text-3x1"
                >
                    Finalizar Consulta
                </PrimaryButton>
                </div>

                    </PopUpComponent>
            )}
            {isAddFormPopupOpen && selectedForm && (
                <PopUpComponent
                    id="add_form_popup"
                    width="95vw"
                    height="95vh"
                    zindex="120"
                    params={popupParams}
                    onClose={handleCloseAddFormPopup}
                >
                    <DynamicForm
                        patient={selectedEvent.patient}
                        form={selectedForm}
                        auth={auth}
                        onClose={handleCloseAddFormPopup}
                    />
                </PopUpComponent>
            )}
        </>
    );
};

EventPopup.propTypes = {
    selectedEvent: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired
};

export default EventPopup;
