import React, { useState, useEffect } from 'react';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextArea from '@/Components/TextArea';
import InputLabel from '@/Components/InputLabel';
import AddressSection from '@/Pages/Patients/FormPatient/AddressSection';
import DocumentSection from '@/Pages/Patients/FormPatient/DocumentSection';
import ContactSection from '@/Pages/Patients/FormPatient/ContactSection';
import PopupHeader from '@/Layouts/PopupHeader';
import { useForm } from '@inertiajs/react';
import {Patient, Contact} from '../interfacesPatients';




// Definindo as propriedades do componente
interface CreatePatientProps {
    patient?: Patient; // Paciente pode ser undefined no modo de criação
    onSave: (saved: boolean) => void;
    handleClosePatientForm: () => void;
}
const CreatePatient: React.FC<CreatePatientProps> = ({ patient, onSave, handleClosePatientForm }) => {
    const initialContacts: Contact[] = Array.isArray(patient?.contacts) ? patient.contacts : [];

    const { data, setData, post, put, processing, errors, reset } = useForm<Patient>({
        id: patient?.id || 0,
        company_id: patient?.company_id || 0,
        patient_name: patient?.patient_name || '',
        phone: patient?.phone || '',
        birth_date: patient?.birth_date || '',
        gender: patient?.gender || '',
        neighborhood: patient?.neighborhood || '',
        street: patient?.street || '',
        house_number: patient?.house_number || '',
        address_complement: patient?.address_complement || '',
        city: patient?.city || '',
        state: patient?.state || '',
        cpf: patient?.cpf || '',
        contacts: Array.isArray(patient?.contacts) ? patient.contacts : [],
        complaints: patient?.complaints || null,
        notes: patient?.notes || '',
        profile_picture: patient?.profile_picture || null,
        status: patient?.status || true,
        created_at: patient?.created_at || '',
        updated_at: patient?.updated_at || '',
    });
    
    useEffect(() => {
        if (patient) {
            setData({
                patient_name: patient.patient_name || '',
                phone: patient.phone || '',
                birth_date: patient.birth_date || '',
                gender: patient.gender || '',
                neighborhood: patient.neighborhood || '',
                street: patient.street || '',
                house_number: patient.house_number || '',
                address_complement: patient.address_complement || '',
                city: patient.city || '',
                state: patient.state || '',
                cpf: patient.cpf || '',
                contacts: Array.isArray(patient.contacts) ? patient.contacts : [], // Converte para array se necessário
                notes: patient.notes || '',
                profile_picture: patient.profile_picture || null,
                status: patient.status ?? true, // Usa true como padrão se indefinido
                complaints: patient.complaints || '', // Adiciona complaints com valor padrão
            });
        }
    }, [patient, setData]);
    
    

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (patient) {
            // Modo de edição
            put(route('patients.update', patient.id!), {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    onSave(true);
                    handleClosePatientForm();
                },
                onError: (error) => console.log('Erro ao atualizar paciente', error),
            });
        } else {
            // Modo de criação
            post(route('patients.store'), {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    onSave(true);
                    handleClosePatientForm();
                },
                onError: (error) => console.log('Erro ao criar paciente', error),
            });
        }
    };

    return (
        <>
            <PopupHeader icon='' title={patient ? 'Editar Paciente' : 'Cadastrar novo paciente'} />

            <div className="w-[90%] mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6 flex flex-wrap gap-1">
                    <div className='w-[100%] z-10 rounded p-5 border-b-2 flex flex-wrap gap-1'>
                        <DocumentSection
                            data={data}
                            setData={setData}
                            errors={errors}
                        />
                    </div>
                    <div className='w-[100%] z-20 rounded p-5 border-b-2 border-black-200 flex flex-wrap'>
                        <AddressSection data={data} setData={setData} errors={errors} />
                    </div>
                    <div className='w-[100%] z-30 rounded border-2 border-black-200 flex flex-wrap gap-1 shadow-2xl'>
                    <ContactSection
                            data={{
                                ...data,
                                contacts: Array.isArray(data.contacts) ? data.contacts : [], // Garante que contacts seja um array
                            }}
                            setData={setData}
                        />
                    </div>
                    <div className='w-[100%] md:w-[50%] pt-5'>
                        <InputLabel htmlFor="notes" value="Observações" />
                        <TextArea
                            id="notes"
                            value={data.notes}
                            className="mt-1 block w-full"
                            onChange={(e) => setData('notes', e.target.value)}
                        />
                        <InputError message={errors.notes} className="mt-2" />
                    </div>

                    <div className="m-auto pt-20">
                        <PrimaryButton disabled={processing}>
                            {patient ? 'Atualizar informações' : 'Cadastrar paciente'}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </>
    );
};

export default CreatePatient;
