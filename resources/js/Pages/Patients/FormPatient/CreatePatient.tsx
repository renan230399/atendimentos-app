import React, { useState, useEffect } from 'react';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import InputStatus from '@/Components/InputStatus';
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

    const { data, setData, post, put, processing, errors, reset } = useForm<Patient>({
        id: patient?.id || 0,
        company_id: patient?.company_id || 0,
        patient_name: patient?.patient_name || '',
        personal_contacts: Array.isArray(patient?.personal_contacts) ? patient.personal_contacts : [],
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
        complaints: Array.isArray(patient?.complaints) ? patient.complaints : [],
        notes: patient?.notes || '',
        profile_picture: null,
        status: patient?.status || true,
        created_at: patient?.created_at || '',
        updated_at: patient?.updated_at || '',
    });
    

    
    console.log(data.personal_contacts);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    
        // Função para limpar espaços e caracteres especiais
        const cleanPhoneNumber = (number: string) => {
            return number.replace(/\D/g, ''); // Remove tudo que não é dígito
        };
        // Limpeza dos contatos pessoais
        const cleanedPersonalContacts = (data.personal_contacts || []).map(contact => ({
            ...contact,
            value: contact.category === 'phone' ? cleanPhoneNumber(contact.value) : contact.value,
        }));
    
        // Limpeza dos contatos da pessoa, garantindo que data.contacts não seja null
        const cleanedContacts = (data.contacts || []).map(person => ({
            ...person,
            contacts: (person.contacts || []).map(contact => ({
                ...contact,
                value: contact.category === 'phone' ? cleanPhoneNumber(contact.value) : contact.value,
            })),
        }));
        const cleanedComplaints = data.complaints ? JSON.stringify(data.complaints) : '[]';

        // Atualiza os dados com os contatos limpos
        const updatedData = {
            ...data,
            personal_contacts: cleanedPersonalContacts,
            contacts: cleanedContacts,
            complaints: cleanedComplaints, 

        };
    
        console.log('dados console',updatedData); // Exibir dados limpos no console
        if (patient) {
            // Modo de edição
            post(route('patients.update', patient.id!), {
                data: updatedData, // Use os dados atualizados aqui
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
                data: updatedData, // Use os dados atualizados aqui
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

            <div className="w-[100%] mx-auto">
                <form onSubmit={handleSubmit}  encType="multipart/form-data" className="space-y-6 flex flex-wrap gap-1">
                    <div className='w-[100%] z-10 rounded p-5 flex flex-wrap gap-1'>
                        <DocumentSection
                            data={data}
                            setData={setData}
                            errors={errors}
                        />
                    </div>
                    <div className='w-full z-30 rounded  border-black-200 flex flex-wrap gap-1'>
                    <ContactSection
                        data={{
                            ...data,
                            contacts: Array.isArray(data.contacts) ? data.contacts : [], // Garante que contacts seja um array
                            personal_contacts: Array.isArray(data.personal_contacts) ? data.personal_contacts : [], // Garante que other_contacts seja um array
                        }}

                            setData={setData}
                            errors={errors}
                        />
                    </div>

                    <InputStatus
                        value={data.status}
                        id={`status`}
                        label="Status"
                        onChange={(value) => setData('status', value)}
                        error={errors?.status}
                    />

                    <div className="m-auto pt-20">
                        <PrimaryButton disabled={processing} >
                            {patient ? 'Atualizar informações' : 'Cadastrar paciente'}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </>
    );
};

export default CreatePatient;
