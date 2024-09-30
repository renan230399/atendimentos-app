import React, { useState, useCallback } from 'react';
import { useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import TextArea from '@/Components/TextArea';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';

const AddConsultation = ({ patient, employees, auth, onClose }) => {
    // Adicionar company_id baseado no usuário autenticado (auth.user)
    const { data, setData, post, errors, reset } = useForm({
        patient_id: patient.id,
        company_id: auth.user.company_id, // Pega o company_id a partir do usuário autenticado
        date: '',
        start_time: '',
        end_time: '',
        professional: '',
        notes: '',
        status: 'pending', // Status inicial
    });

    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMessage(''); // Limpa a mensagem de sucesso antes de nova submissão

        post(route('consultations.store'), {
            onSuccess: (response) => {
                setLoading(false);
                setSuccessMessage(response.message); // Define a mensagem de sucesso
                reset();  // Limpa os campos do formulário após o sucesso
            },
            onError: () => {
                setLoading(false);
            }
        });
    }, [post, reset]);

    return (
        <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Adicionar Nova Consulta</h2>

            {successMessage && (
                <div className="p-4 mb-4 text-green-700 bg-green-100 rounded-lg">
                    {successMessage}
                </div>
            )}

            <div className="flex flex-wrap gap-6">
                {/* Data da consulta */}
                <div className="md:w-[15%]">
                    <InputLabel htmlFor="date" value="Data da Consulta" className="text-lg font-medium" />
                    <TextInput
                        id="date"
                        type="date"
                        value={data.date}
                        onChange={(e) => setData('date', e.target.value)}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    <InputError message={errors.date} className="mt-2 text-red-500" />
                </div>

                {/* Hora de início */}
                <div className="md:w-[15%]">
                    <InputLabel htmlFor="start_time" value="Hora de Início" className="text-lg font-medium" />
                    <TextInput
                        id="start_time"
                        type="time"
                        value={data.start_time}
                        onChange={(e) => setData('start_time', e.target.value)}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    <InputError message={errors.start_time} className="mt-2 text-red-500" />
                </div>

                {/* Hora de término */}
                <div className="md:w-[15%]">
                    <InputLabel htmlFor="end_time" value="Hora de Término" className="text-lg font-medium" />
                    <TextInput
                        id="end_time"
                        type="time"
                        value={data.end_time}
                        onChange={(e) => setData('end_time', e.target.value)}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    <InputError message={errors.end_time} className="mt-2 text-red-500" />
                </div>

                {/* Profissional responsável (transformado em select) */}
                <div className="w-[35%]">
                    <InputLabel htmlFor="professional" value="Profissional Responsável" className="text-lg font-medium" />
                    <select
                        id="professional"
                        value={data.professional}
                        onChange={(e) => setData('professional', e.target.value)}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Selecione um profissional</option>
                        {employees.map((employee) => (
                            <option key={employee.id} value={employee.name}>
                                {employee.name}
                            </option>
                        ))}
                    </select>
                    <InputError message={errors.professional} className="mt-2 text-red-500" />
                </div>

                {/* Observações */}
                <div className="w-[70%]">
                    <InputLabel htmlFor="notes" value="Observações (opcional)" className="text-lg font-medium" />
                    <TextArea
                        id="notes"
                        value={data.notes}
                        onChange={(e) => setData('notes', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    <InputError message={errors.notes} className="mt-2 text-red-500" />
                </div>

                {/* Status da consulta */}
                <div className="w-[28%]">
                    <InputLabel htmlFor="status" value="Status da Consulta" className="text-lg font-medium" />
                    <select
                        id="status"
                        value={data.status}
                        onChange={(e) => setData('status', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="pending">Pendente</option>
                        <option value="completed">Realizada</option>
                        <option value="cancelled">Cancelada</option>
                    </select>
                    <InputError message={errors.status} className="mt-2 text-red-500" />
                </div>
            </div>

            {/* Botão de envio */}
            <div className="text-right">
                <PrimaryButton
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md"
                    disabled={loading}
                >
                    {loading ? 'Adicionando...' : 'Adicionar Consulta'}
                </PrimaryButton>
            </div>
        </form>
    );
};

export default AddConsultation;
