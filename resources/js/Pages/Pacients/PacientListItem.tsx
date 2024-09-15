const PacientListItem = ({ pacient, handleOpenEditPopup, handleOpenViewPopup, formatDateAndAge }) => (
    <li className="w-[100%] z-10 rounded/2 p-5 border-b-2 flex flex-wrap gap-1 shadow-2xl bg-white">
        <div className="md:w-[10%] m-auto">
            {pacient.foto_perfil ? (
                <img
                    src={pacient.foto_perfil}
                    alt={`Foto de ${pacient.nome_paciente}`}
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
                <p className="text-lg font-semibold"><strong>Nome:</strong> {pacient.nome_paciente}</p>
                <p><strong>Telefone:</strong> {pacient.telefone || 'Não informado'}</p>
                <p><strong>Data de Nascimento:</strong> {formatDateAndAge(pacient.data_nascimento)}</p>
            </div>
        </div>
        <div className="md:w-[20%]">
            <button
                onClick={handleOpenEditPopup}
                className="m-auto bg-blue-500 text-white px-4 py-2 rounded"
            >
                Editar 
           </button>
            <button
                onClick={handleOpenViewPopup}
                className="m-auto bg-gray-500 text-white px-4 py-2 rounded"
            >
                Visualizar Informações
            </button>
        </div>
    </li>
);

export default PacientListItem;
