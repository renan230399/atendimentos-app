import React, { useState, useCallback, useEffect } from 'react';
import PopUpComponent from '@/Layouts/PopupComponent';
import moment from 'moment';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import TextArea from '@/Components/TextArea';
import { Dialog } from 'primereact/dialog';
import { User } from '@/types';
import { Event } from 'react-big-calendar';
import DynamicForm from '../Patients/Forms/DynamicForm';
import PatientDetails from './PatientDetails';
import { Form, Patient } from '../Patients/interfacesPatients';
import { EventPatient } from './AgendaInterfaces'
interface EventPopupProps {
    auth: {
        user:User;
    }
    selectedEvent: EventPatient;

    onClose: () => void;
    onDelete: (id: number) => void;
    logo?: string;
    forms?: Form[];
  }
const EventPopup: React.FC<EventPopupProps> = ({
    auth,
    selectedEvent,
    onClose,
    onDelete,
    logo,
    forms = []
  }) => {
    // Estado para controlar a exibição do popup de visualização do paciente
    const [isViewPatientPopupOpen, setIsViewPatientPopupOpen] = useState(false);
    const [isAddFormPopupOpen, setIsAddFormPopupOpen] = useState(false);
    const [selectedForm, setSelectedForm] = useState<Form | null>(null);
    const [consultations, setConsultations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formResponses, setFormResponses] = useState([]); // Estado para respostas de formulários
    const [loadingFormResponses, setLoadingFormResponses] = useState(true);

    useEffect(() => {
        if (!selectedEvent.patient?.id) return; // Verifica se o ID do paciente está disponível antes de fazer a requisição

        const fetchConsultations = async () => {
            try {
                const response = await fetch(`/patients/${selectedEvent.patient?.id}/consultations`);
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
                    const response = await fetch(`/patients/${selectedEvent.patient?.id}/form-responses`);
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
        setIsViewPatientPopupOpen(true);
    }, []);

    // Função para fechar o popup de visualização do paciente
    const handleCloseViewPatientPopup = useCallback(() => {
        setIsViewPatientPopupOpen(false);
    }, []);
    const handleOpenAddFormPopup = useCallback((form: Form) => {
        setSelectedForm(form);
        setIsAddFormPopupOpen(true);
      }, []);
    const handleCloseAddFormPopup = useCallback(() => {
        setIsAddFormPopupOpen(false);
    }, []);

    return (
        <>

                <div className='flex flex-wrap px-10 py-5'>
                    {/* Título do evento/consulta */}
                    <div className='text-center flex w-[64%]'>
                        <div className="">
                            {selectedEvent.patient?.profile_picture ? (
                                <img
                                    src={selectedEvent.patient.profile_picture}
                                    alt={`Foto de ${selectedEvent.patient.patient_name}`}
                                    className="w-30 h-0 md:w-40 md:h-40 rounded-full m-auto shadow-lg object-cover"
                                />
                            ) : (
                                <div className="w-30 h-30 md:w-40 md:h-40 bg-gray-300 m-auto rounded-full flex items-center justify-center text-gray-600 shadow-lg">
                                    N/A
                                </div>
                            )}
                        </div>
                        <div className='mx-2 my-auto'>
                            <h2 className='text-2xl font-bold mb-4'>{selectedEvent.title}</h2>

                        </div>

                    </div>
                    {logo ? (
                    <div className='w-[35%]'>

                            <img
                            src={logo}
                            alt='logo da empresa'
                            className="h-40 w-auto m-auto "
                        />
     
                    </div>
                    ) : ('')}



                    <div className='w-full md:w-1/2 px-4'>
                        <InputLabel htmlFor='profissional' value='Preço:' />
                        <p>
                            {(Number(selectedEvent.price) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </p> 
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
                        <TextArea
                            id="observacoes"
                            value={selectedEvent.notes || 'Nenhuma observação'}
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
 

<Dialog  visible={isViewPatientPopupOpen} style={{ width: '50vw' }} onHide={handleCloseViewPatientPopup}>
                {isViewPatientPopupOpen && (
                    <PatientDetails
                            selectedEvent={selectedEvent}
                            forms={forms}
                            logo={logo}
                            handleOpenAddFormPopup={handleOpenAddFormPopup}
                            formResponses={formResponses}
                            loadingFormResponses={loadingFormResponses}
                        />
                )}
      </Dialog>

        <Dialog visible={isAddFormPopupOpen} style={{ width: '50vw' }} onHide={handleCloseAddFormPopup}>
            {isAddFormPopupOpen && selectedForm && selectedEvent.patient &&(
                    <DynamicForm
                        patient={selectedEvent.patient}
                        form={selectedForm}
                        onClose={handleCloseAddFormPopup}
                    />
                )}
      </Dialog>

        </>
    );
};

export default EventPopup;
