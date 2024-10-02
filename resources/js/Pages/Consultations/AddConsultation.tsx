import React, { useState, useCallback } from 'react';
import { useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import TextArea from '@/Components/TextArea';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';
import Dinero from 'dinero.js'; // Importando corretamente Dinero.js v1.9.1

const AddConsultation = ({ patient, employees, auth, onClose }) => {
    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Inicializa os dados do formulário
    const { data, setData, post, errors, reset } = useForm({
        patient_id: patient.id,
        company_id: auth.user.company_id,
        date: getCurrentDate(),
        start_time: '',
        end_time: '',
        professional: '',
        notes: '',
        status: 'pending',
        price: '', // Vamos armazenar o valor do preço em centavos
    });

    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Função para formatar o preço para exibição no input
    const formatPrice = (value) => {
        const price = Dinero({ amount: parseInt(value || 0), currency: 'BRL' });
        return price.toFormat('$0,0.00'); // Formata em R$
    };

    // Função para lidar com a mudança no campo de preço
    const handlePriceChange = (e) => {
        const value = e.target.value.replace(/\D/g, ''); // Remove caracteres não numéricos
        setData('price', value); // Atualiza o valor no estado em centavos
    };

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMessage('');

        // Converte o valor de price para número inteiro (centavos) antes de enviar
        const numericPrice = parseInt(data.price || 0);

        post(route('consultations.store'), {
            ...data,
            price: numericPrice, // Envia o valor do preço em centavos
        }, {
            onSuccess: (response) => {
                setLoading(false);
                setSuccessMessage('Consulta adicionada com sucesso!');
                reset();
            },
            onError: () => {
                setLoading(false);
            }
        });
    }, [post, reset, data]);

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

                {/* Profissional responsável */}
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

                {/* Preço da consulta */}
                <div className="md:w-[15%]">
                    <InputLabel htmlFor="price" value="Preço (R$)" className="text-lg font-medium" />
                    <TextInput
                        id="price"
                        type="text"
                        value={formatPrice(data.price)}
                        onChange={handlePriceChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="R$ 0,00"
                    />
                    <InputError message={errors.price} className="mt-2 text-red-500" />
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
