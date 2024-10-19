// PersonalContactsSection.tsx
import React from 'react';
import ContactInput from '@/Components/ContactInput';
import { ContactDetail } from '../interfacesPatients';

interface PersonalContactSection {
    personal_contacts: ContactDetail[];
    setData: (field: string, value: any) => void;
}

const PersonalContactSection: React.FC<PersonalContactSection> = ({ personal_contacts, setData }) => {
    const handlePersonalContactChange = (index: number, field: keyof ContactDetail, value: string) => {
        const updatedContacts = [...personal_contacts];
        
        // Verifica se o campo é 'category' e faz a atribuição adequada
        if (field === 'category') {
            // Certifica-se de que o valor é um dos tipos esperados
            if (value === 'phone' || value === 'link' || value === 'string') {
                updatedContacts[index][field] = value; // Atribui o valor diretamente
            } else {
                console.error(`Valor inválido para category: ${value}`);
            }
        } else if(field === 'type') {
            updatedContacts[index][field] = Number(value); // Para outros campos, o tipo é string
        }else{
            updatedContacts[index][field] = String(value); // Para outros campos, o tipo é string
        }          


        setData('personal_contacts', updatedContacts);

    };
    

    const handleAddPersonalContact = () => {
        setData('personal_contacts', [...personal_contacts, { type: 1, value: '', category: 'phone' }]);
    };

    const handleRemovePersonalContact = (index: number) => {
        const updatedContacts = personal_contacts.filter((_, i) => i !== index);
        setData('personal_contacts', updatedContacts);
    };

    return (
        <div className=''>
            <h2 className="font-bold">Outros Contatos</h2>
            {personal_contacts.map((contact, index) => (
                <ContactInput
                    key={index}
                    contact={contact}
                    index={index}
                    onChange={(index, field, value) => handlePersonalContactChange(index, field, value)} // Mantenha o parâmetro como string
                    onRemove={() => handleRemovePersonalContact(index)}
                />

            ))}
            <button
                type="button"
                className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                onClick={handleAddPersonalContact}
            >
                Adicionar novo contato pessoal
            </button>
        </div>
    );
};

export default PersonalContactSection;
