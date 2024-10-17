import React from 'react';
import { MdPerson } from 'react-icons/md';
import { FcCellPhone, FcCalendar } from 'react-icons/fc';
import { formatDateAndAge } from '@/Components/Utils/dateUtils';
import {Patient} from './interfacesPatients'
// Definindo a interface para os dados do paciente
import { FaUser } from 'react-icons/fa';


// Definindo a interface para as props do componente
interface PatientListItemProps {
    patient: Patient;
    openViewPatient: (e: React.MouseEvent<HTMLDivElement>, patient: Patient) => void;
}

const PatientListItem: React.FC<PatientListItemProps> = ({ patient, openViewPatient }) => (
    <div 
        className="zoom md:w-[32%] w-[96%] m-auto  rounded/2 p-2 border border-gray-300 flex flex-wrap gap-1 shadow-md bg-white my-3 rounded-xl"
        onClick={(e) => openViewPatient(e, patient)}  // Passando o paciente ao abrir o popup
        key={patient.id}
    >

<div className="md:w-[30%] w-[25%] text-left my-auto">
    {patient.profile_picture ? (
        <img
            src={patient.profile_picture}
            alt={`Photo of ${patient.patient_name}`}
            className="md:w-22 md:h-22 w-20 h-20 rounded-full m-auto object-cover"
        />
    ) : (
        <div className="md:w-22 md:h-22 w-20 h-20 rounded-full m-auto flex items-center justify-center bg-gray-200">
            <FaUser className="md:w-12 md:h-12 w-10 h-10 text-gray-500" />
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
                    <FcCalendar className='my-auto' size={30} />
                    {patient.birth_date ? formatDateAndAge(patient.birth_date) : 'Idade não disponível'}
                </p>

            </div>
        </div>
    </div>
);

export default PatientListItem;
