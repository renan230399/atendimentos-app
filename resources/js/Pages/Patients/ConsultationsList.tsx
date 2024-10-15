import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';
import moment from 'moment';

// Interface para as consultas
interface Consultation {
    date: string;
    start_time: string;
    end_time: string;
    professional: string;
    status: 'pending' | 'completed' | 'cancelled'; // Ajuste de status com os valores aceitos
}

// Propriedades recebidas pelo componente
interface ConsultationsListProps {
    consultations: Consultation[];
    loading: boolean;
}

const ConsultationsList: React.FC<ConsultationsListProps> = ({ consultations, loading }) => {
    const [currentPage, setCurrentPage] = useState<number>(0);
    const itemsPerPage = 5;

    // Função para lidar com a mudança de página
    const handlePageClick = (selectedPage: { selected: number }) => {
        setCurrentPage(selectedPage.selected);
    };

    // Dados paginados
    const offset = currentPage * itemsPerPage;
    const currentConsultations = consultations.slice(offset, offset + itemsPerPage);
    const pageCount = Math.ceil(consultations.length / itemsPerPage);

    return (
        <div className="flex flex-wrap mt-8">
            <div className="w-full p-6 bg-gray-50 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Consultas do Paciente</h2>

                {loading ? (
                    <p className="text-gray-600">Carregando consultas...</p>
                ) : consultations.length > 0 ? (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white rounded-lg shadow">
                                <thead className="bg-blue-500 text-white">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-center">Data</th>
                                        <th className="px-4 py-3 text-left text-center">Hora de Início/Término</th>
                                        <th className="px-4 py-3 text-left text-center">Duração</th>
                                        <th className="px-4 py-3 text-left text-center">Profissional</th>
                                        <th className="px-4 py-3 text-left text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentConsultations.map((consultation, index) => {
                                        // Mapeamento de status para português
                                        const statusMap: Record<string, string> = {
                                            pending: 'Pendente',
                                            completed: 'Realizada',
                                            cancelled: 'Cancelada',
                                        };

                                        const formattedStartTime = consultation.start_time.slice(0, 5); // Pega apenas HH:mm
                                        const formattedEndTime = consultation.end_time.slice(0, 5); // Pega apenas HH:mm

                                        // Cálculo da duração da consulta usando moment.js
                                        const start = moment(consultation.start_time, 'HH:mm');
                                        const end = moment(consultation.end_time, 'HH:mm');
                                        const duration = moment.duration(end.diff(start));

                                        // Formatação elegante da duração, evitando mostrar "0 hora" ou "0 minutos" e ajustando o plural
                                        const formattedDuration = [
                                            duration.hours() > 0 ? `${duration.hours()} ${duration.hours() === 1 ? 'hora' : 'horas'}` : '',
                                            duration.minutes() > 0 ? `${duration.minutes()} ${duration.minutes() === 1 ? 'minuto' : 'minutos'}` : ''
                                        ].filter(Boolean).join(' '); // Remove partes vazias e junta com espaço

                                        return (
                                            <tr key={index} className="border-t border-gray-200 hover:bg-gray-100">
                                                <td className="px-4 py-3 text-center">
                                                    {new Date(consultation.date).toLocaleDateString('pt-BR')}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    {formattedStartTime} às {formattedEndTime}
                                                </td>
                                                <td className="px-4 py-3 text-center">{formattedDuration}</td>
                                                <td className="px-4 py-3 text-center">{consultation.professional}</td>
                                                <td
                                                    className={`px-4 py-3 text-center ${
                                                        consultation.status === 'pending'
                                                            ? 'text-blue-600'
                                                            : consultation.status === 'completed'
                                                            ? 'text-green-600'
                                                            : 'text-red-600'
                                                    }`}
                                                >
                                                    {statusMap[consultation.status] || consultation.status}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Paginação */}
                        <div className="mt-6 flex justify-center">
                            <ReactPaginate
                                previousLabel={'← Anterior'}
                                nextLabel={'Próxima →'}
                                pageCount={pageCount}
                                onPageChange={handlePageClick}
                                containerClassName={'pagination flex flex-wrap space-x-2 justify-center'}
                                activeClassName={'active bg-blue-500 text-white px-3 py-1 rounded-md'}
                                pageClassName={'page-item px-3 py-1 border rounded-md text-sm'}
                                previousClassName={'page-item px-3 py-1 border rounded-md text-sm'}
                                nextClassName={'page-item px-3 py-1 border rounded-md text-sm'}
                                disabledClassName={'disabled opacity-50 cursor-not-allowed'}
                            />
                        </div>
                    </>
                ) : (
                    <p className="text-gray-600">Não há consultas registradas para este paciente.</p>
                )}
            </div>
        </div>
    );
};

export default ConsultationsList;
