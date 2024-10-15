import React, { useState } from 'react';
import moment from 'moment';
import { FaWhatsapp } from "react-icons/fa";
import {Patient} from './interfacesPatients'

// Definindo a interface para as props do componente
interface BirthdaysProps {
    patients: Patient[];
}

const Birthdays: React.FC<BirthdaysProps> = ({ patients }) => {
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Define o mês atual como padrão

    // Função para alterar o mês selecionado
    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedMonth(parseInt(e.target.value, 10));
    };

    // Função para calcular a idade que o paciente vai fazer ou já fez neste ano
    const calculateAge = (birthDate: string) => {
        const currentYear = moment().year();
        const birthYear = moment(birthDate).year();
        return currentYear - birthYear;
    };

    // Filtra os pacientes que fazem aniversário no mês selecionado
    const filteredPatients = patients.filter((patient) => {
        const birthDate = moment(patient.birth_date);
        return birthDate.isValid() && birthDate.month() + 1 === selectedMonth; // Verifica se o mês do aniversário coincide com o selecionado
    });

    const birthdayMessage ='Parabéns!';
    
    return (
        <div className="w-full p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Aniversariantes</h2>

            {/* Seleção de mês */}
            <div className="mb-4 w-[20%] m-auto">
                <label htmlFor="month-select" className="block text-gray-700 mb-2">
                    Selecione o mês:
                </label>
                <select
                    id="month-select"
                    value={selectedMonth}
                    onChange={handleMonthChange}
                    className="border-gray-300 rounded-lg shadow-sm w-full text-xl"
                >
                    {moment.months().map((month, index) => (
                        <option key={index + 1} value={index + 1}>
                            {month}
                        </option>
                    ))}
                </select>
            </div>

            {/* Lista de pacientes filtrados */}
            <div>
                {filteredPatients.length > 0 ? (
                    <ul className="space-y-4">
                        {filteredPatients.map((patient) => (
                            <li key={patient.id} className="p-4 bg-gray-100 rounded-lg shadow">
                                <div className="flex items-center w-full">
                                    <div className="w-32 h-32 rounded-full bg-gray-300 overflow-hidden mr-4">
                                        {patient.profile_picture ? (
                                            <img
                                                src={patient.profile_picture}
                                                alt={`Foto de ${patient.patient_name}`}
                                                className="object-cover w-full h-full"
                                            />
                                        ) : (
                                            <span className="flex items-center justify-center h-full text-gray-600">
                                                N/A
                                            </span>
                                        )}
                                    </div>
                                    <div className='flex flex-wrap justify-between w-full'>
                                        <h3 className="text-lg font-bold w-full text-left">{patient.patient_name}</h3>
                                        <p>Data de nascimento: {moment(patient.birth_date).format('DD/MM/YYYY')}</p>
                                        <p>
                                            Idade: {patient.birth_date ? calculateAge(patient.birth_date) : 'Idade não disponível'} anos
                                        </p>
                                        <a href={`https://wa.me/5535997785809?text=${birthdayMessage}`} target="_blank" rel="noopener noreferrer">
                                            <div className='bg-green-500 text-white flex p-3 rounded gap-2 zoom'>
                                                <FaWhatsapp className='m-auto'/>
                                                <b className='m-auto'>Mandar mensagem pelo whatsapp</b>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Nenhum aniversariante encontrado para o mês selecionado.</p>
                )}
            </div>
        </div>
    );
};

export default Birthdays;
