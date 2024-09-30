import { HiPencilAlt, HiEye } from 'react-icons/hi'; // Importando os ícones da biblioteca react-icons

const PatientListItem = ({ patient, handleOpenEditPopup, handleOpenViewPopup, formatDateAndAge }) => (
    <li className="w-[100%] z-10 rounded/2 p-5 border-b-2 flex flex-wrap gap-1 shadow-2xl bg-white">
        <div className="md:w-[10%] m-auto">
            {patient.profile_picture ? (
                <img
                    src={patient.profile_picture}
                    alt={`Photo of ${patient.patient_name}`}
                    className="w-20 h-20 rounded-full object-cover"
                />
            ) : (
                <div className="w-20 h-20 bg-gray-300 rounded-full mr-4 flex items-center justify-center text-gray-600">
                    N/A
                </div>
            )}
        </div>
        <div className="md:w-[65%]">
            <div>
                <p className="text-lg font-semibold"><strong>Nome:</strong> {patient.patient_name}</p>
                <p><strong>Contato:</strong> {patient.phone || 'Não cadastrado'}</p>
                <p><strong>Nascimento:</strong> {formatDateAndAge(patient.birth_date)}</p>
            </div>
        </div>
        <div className="md:w-[20%] m-auto flex justify-center space-x-4 text-center items-center">
            <button
                onClick={handleOpenEditPopup}
                className="hidden flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
            >
                <HiPencilAlt className="h-5 w-5 mr-2" /> {/* Ícone de edição */}
                Editar
            </button>

            <button
                onClick={handleOpenViewPopup}
                className="m-auto flex items-center justify-center bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors duration-300"
            >
                <HiEye className="h-5 w-5 mr-2" /> {/* Ícone de visualização */}
                Ver Informações
            </button>
        </div>
    </li>
);

export default PatientListItem;
