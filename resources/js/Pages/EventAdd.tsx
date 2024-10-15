import React, { useEffect, useRef, useState, Suspense } from 'react';
import PropTypes from 'prop-types';
import { Calendar } from 'primereact/calendar';
import { Stepper } from 'primereact/stepper';
import { format, parseISO, addDays } from 'date-fns';
import { StepperPanel } from 'primereact/stepperpanel';
import { Button } from 'primereact/button';
import { useForm } from '@inertiajs/react';
import Dinero from 'dinero.js';
import InputLabel from '@/Components/InputLabel';
import { Patient } from './Patients/interfacesPatients';
import { ProgressSpinner } from 'primereact/progressspinner';
interface EventAddProps {
    start: Date;
    end: Date;
    onClose: () => void;
}
interface FormData {
    title: string;
    description: string;
    date: string;
    start_time: string;
    end_time: string;
    price: string;
    patient_id: number | null; // Garantir que patient_id é null quando não há paciente selecionado
}
interface StepperRefAttributes {
    getElement: () => HTMLDivElement;  // Altere para garantir que retorne HTMLDivElement
    getActiveStep: () => number;
    setActiveStep: (step: number) => void;
    nextCallback: () => void;
    prevCallback: () => void;
}

const EventAdd: React.FC<EventAddProps> = ({ start, end, onClose }) => {
    const stepperRef = useRef<StepperRefAttributes | null>(null);
    const [patients, setPatients] = useState<Patient[]>([]); // Lista de pacientes
    const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]); // Pacientes filtrados
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null); // Paciente selecionado
    const [searchTerm, setSearchTerm] = useState<string>(''); // Termo de busca
    const [isLoading, setIsLoading] = useState<boolean>(true); // Carregamento


  // Usando o hook useForm do Inertia para gerenciar o estado do formulário
  const { data, setData, post, reset, errors } = useForm<FormData>({
    title: '',
    description: '',
    date: '',
    start_time: '',
    end_time: '',
    price: '',
    patient_id: null, // ID do paciente selecionado
});

    const formatPrice = (value:any) => {
        const price = Dinero({ amount: parseInt(value || 0), currency: 'BRL' });
        return price.toFormat('$0,0.00');
    };
    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, ''); // Remove caracteres não numéricos
        setData('price', value); // Atualiza o valor no estado em centavos
    };
    
    
    useEffect(() => {
        // Verifica se ambos os valores `start` e `end` estão disponíveis e só então atualiza os valores
        const formattedStart = start ? format(new Date(start), 'HH:mm') : '';
        const formattedEnd = end ? format(new Date(end), 'HH:mm') : '';
        const formattedDate = end ? format(new Date(start), 'yyyy-MM-dd') : '';

        // Atualiza ambos os campos de uma só vez para evitar inconsistências
        setData((prevData) => ({
            ...prevData,
            start_time: formattedStart,
            end_time: formattedEnd,
            date:formattedDate,
        }));
    }, [start, end]); // Dependências `start` e `end`
    
    
    

    // Função para buscar todos os pacientes do backend ao carregar o componente
    useEffect(() => {
        const url = route('patients.consultation.add'); // Usa o Laravel para obter a URL completa da rota
        
        fetch(url)
            .then(response => response.json())
            .then(data => {
                // Simula um tempo de espera de 2 segundos
                setTimeout(() => {
                    setPatients(data);
                    setFilteredPatients(data);
                    setIsLoading(false); // Atualiza o estado para indicar que o carregamento foi concluído
                }, 0); 
            })
            .catch(error => {
                console.error('Erro ao buscar pacientes:', error);
                setIsLoading(false); // Atualiza o estado mesmo em caso de erro
            });
    }, []);
    // Filtra os pacientes conforme o usuário digita na barra de busca
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        const filtered = patients.filter(patient =>
            patient.patient_name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredPatients(filtered);
    };
    

    const handlePatientSelect = (patient: Patient | null) => {
        if (patient) {
            setSelectedPatient(patient);
            setData((prevData) => ({
                ...prevData,
                patient_id: patient.id ?? null, // Garante que patient_id é número ou null
                title: `Atendimento de ${patient.patient_name}`,
            }));
        } else {
            // Quando não há paciente selecionado, defina patient_id como null
            setSelectedPatient(null);
            setData((prevData) => ({
                ...prevData,
                patient_id: null, // Explicitamente null
                title: '',
            }));
        }
    };
    
    
// Função para lidar com a submissão do formulário
// Função para lidar com a submissão do formulário
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Formata a data no formato ISO 8601 (yyyy-MM-ddTHH:mm:ssZ)
    const formattedDate = data.date ? new Date(data.date).toISOString() : '';

    // Cria o payload com os dados formatados
    const payload = {
        ...data,
        date: formattedDate, // Atualiza o campo de data com o formato ISO 8601
    };

    console.log(payload); // Para ver como o payload foi formatado

    // Envia o payload para o backend
    post(route('consultation.store'), {
        data: payload,
        onSuccess: () => {
            reset();
            console.log('Consulta criada com sucesso!');
        },
        onError: (errors) => {
            console.error('Erro ao criar consulta', errors);
        },
    });
};




    return (
        <div className="fixed inset-0 flex w-[100vw] items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[96vw] h-[96vh] overflow-auto">
                <h2 className="text-xl font-semibold mb-4">Adicionar Nova Consulta</h2>
                <form onSubmit={handleSubmit}>
                    <div className="card">
                        <Stepper ref={stepperRef} orientation="vertical">
                        <StepperPanel header="SELECIONAR PACIENTE">
                        {selectedPatient && (
                                    <div className="mb-4">

                                        <div className='flex bg-sky-500	text-white rounded-md shadow-md p-1 justify-between'>
                                        <div  className='flex'>
                                            <div className="text-left my-auto">
                                                {selectedPatient.profile_picture ? (
                                                    <img
                                                        src={selectedPatient.profile_picture}
                                                        alt={`Photo of ${selectedPatient.patient_name}`}
                                                        className="w-16 h-16 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-gray-600">
                                                    N/A
                                                    </div>
                                                )}
                                            </div>
                                            <div className='my-auto ml-4'>
                                                <strong>Paciente Selecionado:</strong>
                                                <p>{selectedPatient.patient_name}</p>
                                            </div>
                                        </div>
                     
                                            <div
                                                className="cursor-pointer my-auto p-1 text-xl"
                                                onClick={() => handlePatientSelect(null)}
                                            >
                                                    x
                                            </div>
                                        </div>

                                    </div>
                                )}
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="search">
                                        Buscar Paciente
                                    </label>
                                    <input
                                        id="search"
                                        type="text"
                                        autoComplete="off"
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        placeholder="Digite o nome do paciente"
                                    />
                                </div>


                                {isLoading ? (
                                    <ProgressSpinner className='w-8 h-8 m-auto' strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
                                ) : (
                                <ul className="max-h-50 h-40 overflow-y-auto shadow resize-y">
                                    {filteredPatients.map(patients => (
                                        <li
                                             key={`patients_consultation-${patients.id}`}
                                            className="cursor-pointer py-2 px-4 hover:bg-gray-100 flex"
                                            onClick={() => handlePatientSelect(patients)}
                                        >
                                            
                                            <div className="text-left my-auto">
                                                {patients.profile_picture ? (
                                                    <img
                                                        src={patients.profile_picture}
                                                        alt={`Photo of ${patients.patient_name}`}
                                                        className="w-14 h-14 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-14 h-14 bg-gray-300 rounded-full flex items-center justify-center text-gray-600">
                                                    N/A
                                                    </div>
                                                )}
                                            </div>
                                            <div className='my-auto ml-4'>
                                                {patients.patient_name}
                                            </div>
                                        </li>

                                    ))}
                                </ul>
                                    )}


                                <div className="flex py-4 gap-2">
                                    <Button 
                                        type="button" 
                                        label="Anterior" 
                                        className='opacity-25 bg-red-500 text-white p-1 rounded shadow'
                                        icon="pi pi-arrow-left" 
                                    />
                                    <Button 
                                        type="button" 
                                        label="Próximo" 
                                        icon="pi pi-arrow-right" 
                                        className='bg-blue-500 text-white p-1 rounded shadow'
                                        iconPos="right" 
                                        onClick={() => {
                                            if (stepperRef.current) {
                                                stepperRef.current.nextCallback(); // Garante que stepperRef.current não é null
                                            }
                                        }} 
                                    />

                                </div>
                            </StepperPanel>
                            <StepperPanel header="INFORMAÇÕES DA CONSULTA">
                                <div className="flex flex-column h-12rem">
                                    <div className="surface-ground flex-auto flex flex-wrap justify-content-center align-items-center font-medium">
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 w-full">
    <div className="flex flex-col">
        <label htmlFor="title" className="text-sm font-semibold text-gray-600 mb-1">
            Título da Consulta
        </label>
        <input
            id="title"
            type="text"
            readOnly
            value={data.title}
            onChange={(e) => setData('title', e.target.value)}
            className="border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition duration-200"
            placeholder="Insira o título da consulta"
            required
        />
    </div>

    <div className="flex flex-col md:col-span-2">
        <label htmlFor="description" className="text-sm font-semibold text-gray-600 mb-1">
            Descrição
        </label>
        <textarea
            id="description"
            value={data.description}
            onChange={(e) => setData('description', e.target.value)}
            className="border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition duration-200"
            placeholder="Insira uma breve descrição ou observações em relação a consulta"
        ></textarea>
    </div>
    <div className="flex flex-col">
        <label htmlFor="start_time" className="text-sm font-semibold text-gray-600 mb-1">
            Hora Início
        </label>
        <input
            id="start_time"
            type="date"
            className="border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition duration-200"
            value={data.date || ''}
            onChange={(e) => setData('date', e.target.value)}
        />
    </div>
    <div className="flex flex-col">
        <label htmlFor="start_time" className="text-sm font-semibold text-gray-600 mb-1">
            Hora Início
        </label>
        <input
            id="start_time"
            type="time"
            className="border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition duration-200"
            value={data.start_time || ''}
            onChange={(e) => setData('start_time', e.target.value)}
        />
    </div>

    <div className="flex flex-col">
        <label htmlFor="end_time" className="text-sm font-semibold text-gray-600 mb-1">
            Hora Fim
        </label>
        <input
            id="end_time"
            type="time"
            className="border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition duration-200"
            value={data.end_time || ''}
            onChange={(e) => setData('end_time', e.target.value)}
        />
    </div>
</div>

                                    </div>
                                </div>
                                <div className="flex py-4 gap-2">
                                    <Button 
                                        type="button" 
                                        label="Anterior" 
                                        severity="secondary" 
                                        className='bg-red-600 text-white p-1 rounded shadow'

                                        icon="pi pi-arrow-left" 
                                        onClick={() => {
                                            if (stepperRef.current) {
                                                stepperRef.current.prevCallback(); // Verifica se stepperRef.current não é null
                                            }
                                        }} 
                                    />
                                            <Button 
                                                type="button" 
                                                label="Próximo" 
                                                icon="pi pi-arrow-right" 
                                                className='bg-blue-500 text-white p-1 rounded shadow'
                                                iconPos="right" 
                                                onClick={() => {
                                                    if (stepperRef.current) {
                                                        stepperRef.current.nextCallback(); // Verifica se stepperRef.current não é null
                                                    }
                                                }} 
                                            />

                                </div>
                            </StepperPanel>
                            <StepperPanel header="FINANCEIRO">
                                <div className="flex flex-column h-12rem">
                                    <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">
                                        <label htmlFor="price" className="text-lg font-medium">Preço (R$)</label>
                                        <input
                                            id="price"
                                            type="text"
                                            value={formatPrice(data.price)}
                                            onChange={handlePriceChange}
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="R$ 0,00"
                                        />
                                        {errors.price && <span className="text-red-500 mt-2">{errors.price}</span>}
                                    </div>
                                </div>
                                <div className="flex py-4">
                                    <Button 
                                        type="button" 
                                        label="Anterior" 
                                        severity="secondary" 
                                        icon="pi pi-arrow-left"
                                        onClick={() => {
                                            if (stepperRef.current) {
                                                stepperRef.current.prevCallback(); // Verifica se stepperRef.current não é null
                                            }
                                        }} 
                                    />
                                </div>
                            </StepperPanel>
                        </Stepper>
                    </div>

                    <div className="flex justify-between mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Cadastrar Consulta
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


export default EventAdd;
