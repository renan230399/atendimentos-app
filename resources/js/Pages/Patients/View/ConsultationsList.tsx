import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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
    patientId: number;
}

// Função para buscar os dados (agora isolada para ser usada no React Query)
const fetchConsultations = async (patientId: number): Promise<Consultation[]> => {
    const response = await fetch(`/patients/${patientId}/consultations`);
    if (!response.ok) {
        throw new Error('Erro ao buscar consultas');
    }
    return response.json();
};

const ConsultationsList: React.FC<ConsultationsListProps> = ({ patientId }) => {
    const [currentPage, setCurrentPage] = useState<number>(0);
    const itemsPerPage = 7;

    // Usando React Query para buscar os dados
    const { data: consultations = [], isLoading, error } = useQuery({
        queryKey: ['consultations', patientId], // queryKey
        queryFn: () => fetchConsultations(patientId), // queryFn
    });

    // Função para lidar com a mudança de página
    const handlePageClick = (selectedPage: { selected: number }) => {
        setCurrentPage(selectedPage.selected);
    };

    // Dados paginados
    const offset = currentPage * itemsPerPage;
    const currentConsultations = consultations.slice(offset, offset + itemsPerPage);
    const pageCount = Math.ceil(consultations.length / itemsPerPage);

    if (isLoading) {
        return <p className="text-gray-600">Carregando consultas...</p>;
    }

    if (error) {
        return <p className="text-red-600">Erro ao carregar consultas: {error.message}</p>;
    }

    return (
        <div className="flex flex-wrap md:w-full xl:w-full m-auto">
            <div className="w-full bg-gray-50 rounded-lg shadow-md">
                {consultations.length > 0 ? (
                    <>
                        <div className="overflow-x-hidden">
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
                                        const statusMap: Record<string, string> = {
                                            pending: 'Pendente',
                                            completed: 'Realizada',
                                            cancelled: 'Cancelada',
                                        };

                                        const formattedStartTime = consultation.start_time.slice(0, 5); // Pega apenas HH:mm
                                        const formattedEndTime = consultation.end_time.slice(0, 5); // Pega apenas HH:mm

                                        const start = moment(consultation.start_time, 'HH:mm');
                                        const end = moment(consultation.end_time, 'HH:mm');
                                        const duration = moment.duration(end.diff(start));

                                        const formattedDuration = [
                                            duration.hours() > 0 ? `${duration.hours()} ${duration.hours() === 1 ? 'hora' : 'horas'}` : '',
                                            duration.minutes() > 0 ? `${duration.minutes()} ${duration.minutes() === 1 ? 'minuto' : 'minutos'}` : ''
                                        ].filter(Boolean).join(' ');

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
