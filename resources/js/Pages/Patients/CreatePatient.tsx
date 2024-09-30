import React, { useState, useEffect } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextArea from '@/Components/TextArea';
import InputLabel from '@/Components/InputLabel'; // Certifique-se de importar InputLabel corretamente
import AddressSection from '@/Pages/Patients/FormPatient/AddressSection';
import DocumentSection from '@/Pages/Patients/FormPatient/DocumentSection';
import ContactSection from '@/Pages/Patients/FormPatient/ContactSection';
import PopupHeader from '@/Layouts/PopupHeader';

const CreatePatient = ({ patient, onSubmit }) => {
    const { errors } = usePage().props;
    const { data, setData, post, put, reset } = useForm({
        patient_name: patient?.patient_name || '',
        phone: patient?.phone || '',
        birth_date: patient?.birth_date || '',
        neighborhood: patient?.neighborhood || '',
        street: patient?.street || '',
        house_number: patient?.house_number || '',
        address_complement: patient?.address_complement || '',
        city: patient?.city || '',
        state: patient?.state || '',
        cep: patient?.cep || '',
        cpf: patient?.cpf || '',
        rg: patient?.rg || '',
        contacts: Array.isArray(patient?.contacts) ? patient.contacts : [],
        notes: patient?.notes || '',
        profile_picture: null,
    });

    useEffect(() => {
        if (patient) {
            setData({
                ...data,
                patient_name: patient.patient_name,
                phone: patient.phone,
                birth_date: patient.birth_date,
                neighborhood: patient.neighborhood,
                street: patient.street,
                house_number: patient.house_number,
                address_complement: patient.address_complement,
                city: patient.city,
                state: patient.state,
                cep: patient.cep,
                cpf: patient.cpf,
                rg: patient.rg,
                contacts: Array.isArray(patient.contacts) ? patient.contacts : [],
                notes: patient.notes,
            });
        }
    }, [patient]);

    const handleContactChange = (index, field, value) => {
        const updatedContacts = [...data.contacts];
        updatedContacts[index][field] = value;
        setData('contacts', updatedContacts);
    };

    const handleFileChange = (e) => {
        setData('profile_picture', e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            if (Array.isArray(data[key])) {
                formData.append(key, JSON.stringify(data[key]));
            } else {
                formData.append(key, data[key]);
            }
        });

        if (patient) {
            put(route('patients.update', patient.id), {
                data: formData,
                onSuccess: () => reset(),
                onError: (error) => console.log('Error editing', error),
            });
        } else {
            post(route('patients.store'), {
                data: formData,
                onSuccess: () => reset(),
                onError: (error) => console.log('Error registering', error),
            });
        }
    };

    const addContact = () => {
        setData('contacts', [
            ...data.contacts,
            { name: '', phone: '', relation: '' },
        ]);
    };

    const removeContact = (index) => {
        setData(
            'contacts',
            data.contacts.filter((_, i) => i !== index)
        );
    };

    return (
    <>            
        <PopupHeader icon='' title={patient ? 'Edit Patient' : 'Register New Patient'} />

        <div className="w-[90%] mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6 flex flex-wrap gap-1">
                <div className='w-[100%] z-10 rounded p-5 border-b-2 flex flex-wrap gap-1 shadow-2xl'>
                    <DocumentSection 
                        data={data} 
                        setData={setData} 
                        errors={errors} 
                        patient_name={data.patient_name}
                        profile_picture={data.profile_picture}
                        handleFileChange={handleFileChange}
                    />
                </div>
                <div className='w-[100%] z-20 rounded p-5 border-2 border-black-200 flex flex-wrap gap-1 shadow-2xl'>
                    <AddressSection data={data} setData={setData} errors={errors} />
                </div>
                <div className='w-[100%] z-30 rounded p-5 border-2 border-black-200 flex flex-wrap gap-1 shadow-2xl'>
                    <ContactSection 
                        data={data} 
                        setData={setData} 
                        errors={errors} 
                        handleContactChange={handleContactChange} 
                        removeContact={removeContact} 
                        addContact={addContact} 
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
                    <PrimaryButton>
                        {patient ? 'Atualizar informações' : 'Cadastrar paciente'}
                    </PrimaryButton>
                </div>
            </form>
        </div>
    </>
    );
};

export default CreatePatient;
