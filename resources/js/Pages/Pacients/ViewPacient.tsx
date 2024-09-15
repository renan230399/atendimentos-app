import { formatDateAndAge } from '@/Components/Utils/dateUtils';
import { FaPhone, FaMapMarkerAlt, FaIdCard } from 'react-icons/fa';

const ViewPacient = ({ pacient, handleOpenEditPopup }) => {
    return (
        <>
            <div className="p-1 rounded-lg shadow-lg bg-white flex flex-wrap space-y-6">
                <h2 className="w-full text-2xl font-bold text-gray-800 mb-4">Detalhes do Paciente</h2>
                
                <div className="w-full md:w-1/3 flex justify-center md:justify-start">
                    {pacient.foto_perfil ? (
                        <img
                            src={pacient.foto_perfil}
                            alt={`Foto de ${pacient.nome_paciente}`}
                            className="w-40 h-40 rounded-full m-auto shadow-lg object-cover"
                        />
                    ) : (
                        <div className="w-40 h-40 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 shadow-lg">
                            N/A
                        </div>
                    )}
                </div>

                <div className="w-full md:w-2/3 text-left px-5 space-y-4">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Nome</p>
                        <p className="text-3xl font-semibold text-gray-800">{pacient.nome_paciente}</p>
                    </div>
                    <hr className="my-2" />
                    <div>
                        <p className="text-sm font-medium text-gray-500">Data de Nascimento</p>
                        <p className="text-lg">{formatDateAndAge(pacient.data_nascimento)}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <FaIdCard className="text-gray-600" />
                        <p className="text-lg"><strong>CPF:</strong> {pacient.cpf}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <FaPhone className="text-gray-600" />
                        <p className="text-lg"><strong>Telefone:</strong> {pacient.telefone}</p>
                    </div>
                    
                    {/* Botão de Editar */}
                    <button 
                        onClick={handleOpenEditPopup}
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Editar Paciente
                    </button>
                </div>
            </div>

            <div className='w-[100%] md:w-[20%] m-auto'>
                <img src="https://keyar-atendimentos.s3.amazonaws.com/icones/localizacao.png" className="m-auto w-20 h-20 md:w-40 md:h-40" />
            </div>

            <div className='w-[100%] md:w-[78%] flex flex-wrap gap-1 border-b-2 pb-5'>
                <div className='w-[20%]'>
                    <p><strong>Estado:</strong> {pacient.estado}</p>
                </div>
                <div className='w-[30%]'>
                    <p><strong>Cidade:</strong> {pacient.cidade}</p>
                </div>
                <div className='w-[30%]'>
                    <p><strong>Bairro:</strong> {pacient.bairro}</p>
                </div>
                <div className="flex items-center space-x-2">
                    <FaMapMarkerAlt className="text-gray-600" />
                    <p className="text-lg"><strong>Endereço:</strong> {`${pacient.rua}, ${pacient.numero}, ${pacient.bairro}, ${pacient.cidade}, ${pacient.estado}`}</p>
                </div>
                <div className='w-[10%]'>
                    <p><strong>Número:</strong>{pacient.numero}</p>
                </div>
                <div className='w-[100%]'>
                    <p><strong>Complemento:</strong> {pacient.complemento}</p>
                </div>
            </div>
        </>
    );
};

export default ViewPacient;
