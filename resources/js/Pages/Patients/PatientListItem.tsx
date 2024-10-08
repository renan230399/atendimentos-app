import { HiPencilAlt, HiEye } from 'react-icons/hi'; // Importando os ícones da biblioteca react-icons
import { MdPerson, MdPhone, MdCake } from 'react-icons/md';
import { FcCellPhone, FcCalendar } from "react-icons/fc";

const PatientListItem = ({ patient, handleOpenEditPopup, handleOpenViewPopup, formatDateAndAge }) => (
    <div className="zoom md:w-[32%] w-[100%] m-auto z-10 rounded/2 p-2 border border-gray-300 flex flex-wrap gap-1 shadow-md bg-white my-3 rounded-xl"
    onClick={handleOpenViewPopup}
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
        <button
            onClick={handleOpenViewPopup}
            className="hidden m-auto flex items-center justify-center bg-blue-500 text-white px-4 py rounded hover:bg-blue-600 transition-colors duration-300"
        >
            <HiEye className="h-5 w-5 mr-2" /> {/* Ícone de visualização */}
            Ver Informações
        </button>
        </div>
        <div className="md:w-[100%] m-auto flex justify-center space-x-4 text-center items-center">

        </div>
    </div>
);

export default PatientListItem;
