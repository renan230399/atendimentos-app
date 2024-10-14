import React from 'react';
import { MdPerson, MdPhone, MdCake } from 'react-icons/md';
import { FcCellPhone, FcCalendar } from 'react-icons/fc';
import { formatDateAndAge } from '@/Components/Utils/dateUtils';

// Definindo a interface para os dados do paciente
interface ContactDetail {
    type: string;
    value: string;
    category: 'phone' | 'link' | 'string'; // Definindo categorias como literais
}

interface Contact {
    name: string;
    relation: string;
    contacts: ContactDetail[]; // Aqui você deve ter a lista de contatos
}

interface Patient {
    id: number;
    company_id: number;
    patient_name: string;
    phone: string;
    birth_date: string; // ou Date, se você estiver lidando com objetos Date
    gender: string | null;
    neighborhood: string;
    street: string;
    house_number: string;
    address_complement: string;
    city: string;
    state: string;
    cpf: string;
    contacts: Contact[] | string; // Aqui você pode ajustar se sempre receberá um array ou uma string
    complaints: string | null;
    notes: string;
    profile_picture: string | null;
    status: boolean;
    created_at: string; // ou Date
    updated_at: string; // ou Date
}

// Definindo a interface para as props do componente
interface PatientListItemProps {
    patient: Patient;
    openViewPatient: (e: React.MouseEvent<HTMLDivElement>, patient: Patient) => void;
}

const PatientListItem: React.FC<PatientListItemProps> = ({ patient, openViewPatient }) => (
    <div 
        className="zoom md:w-[32%] w-[100%] m-auto z-10 rounded/2 p-2 border border-gray-300 flex flex-wrap gap-1 shadow-md bg-white my-3 rounded-xl"
        onClick={(e) => openViewPatient(e, patient)}  // Passando o paciente ao abrir o popup
        key={patient.id}
    >
        <div className="md:w-[30%] text-left my-auto">
            {patient.profile_picture ? (
                <img
                    src={patient.profile_picture}
                    alt={`Photo of ${patient.patient_name}`}
                    className="w-28 h-28 rounded-full object-cover"
                />
            ) : (
                <div className="w-28 h-28 bg-gray-300 rounded-full flex items-center justify-center text-gray-600">
                    Sem foto
                </div>
            )}
        </div>
        <div className="md:w-[68%] m-auto">
            <div className='space-y-1'>
                <p className="text-xl font-semibold flex items-center gap-2">
                    <MdPerson size={30} className="text-gray-500" />
                    {patient.patient_name}
                </p>
                <p className="flex items-center gap-2">
                    <FcCellPhone className='my-auto' size={30} />
                    {patient.phone || 'Não cadastrado'}
                </p>
                <p className="flex items-center gap-2">
                    <FcCalendar className='my-auto' size={30} />
                    {formatDateAndAge(patient.birth_date)}
                </p>
            </div>
        </div>
    </div>
);

export default PatientListItem;
