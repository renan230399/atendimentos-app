import React from 'react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { RiDeleteBin5Fill } from "react-icons/ri";
import ContactInput from '@/Pages/Inventory/Suppliers/ContactInput';

interface Contact {
    type: string;
    value: string;
    category: 'phone' | 'link' | 'string'; // Definindo categorias como literais
}

interface Person {
    name: string;
    relation: string;
    contacts: Contact[];
}

interface ContactSectionProps {
    data: {
        contacts: Person[];
    };
    setData: (field: string, value: any) => void;
}

const contactTypes = [
    { label: 'Instagram', value: 'instagram' },
    { label: 'Facebook', value: 'facebook' },
    { label: 'WhatsApp', value: 'whatsapp' },
    { label: 'Email', value: 'email' },
    { label: 'LinkedIn', value: 'linkedin' },
];

const ContactSection: React.FC<ContactSectionProps> = ({ data, setData }) => {

    // Atualiza os dados gerais da pessoa (nome, relação)
    const handlePersonChange = (personIndex: number, field: keyof Person, value: any) => {
        const updatedContacts = [...data.contacts];
        updatedContacts[personIndex][field] = value;
        setData('contacts', updatedContacts);
    };
    
    
    

    // Atualiza os contatos de uma pessoa específica
    const handlePersonContactChange = (personIndex: number, contactIndex: number, field: string, value: any) => {
        const updatedContacts = data.contacts.map((person, pIndex) => {
            if (pIndex === personIndex) {
                const updatedPersonContacts = person.contacts.map((contact, cIndex) => {
                    if (cIndex === contactIndex) {
                        return { ...contact, [field]: value };
                    }
                    return contact;
                });
                return { ...person, contacts: updatedPersonContacts };
            }
            return person;
        });
        setData('contacts', updatedContacts);
    };
    

    // Atualiza o campo de relação da pessoa com o paciente
    const handleRelationChange = (personIndex: number, relationValue: string) => {
        const updatedContacts = data.contacts.map((person, index) => {
            if (index === personIndex) {
                return { ...person, relation: relationValue };
            }
            return person;
        });
        setData('contacts', updatedContacts);
    };
    

// Adiciona uma nova pessoa com um contato vazio
const addContact = () => {
    setData('contacts', [
        ...data.contacts,
        {
            name: '',
            relation: '',
            contacts: [{ type: '', value: '', category: 'phone' }] // Defina 'category' como um dos valores permitidos
        }
    ]);
};


    // Adiciona um novo contato para uma pessoa específica
    const addNewContactForPerson = (personIndex: number) => {
        const newContact = { type: '', value: '', category: 'phone' }; // Defina 'category' como 'phone', 'link' ou 'string'
        const updatedContacts = data.contacts.map((person, index) => {
            if (index === personIndex) {
                return {
                    ...person,
                    contacts: [...person.contacts, newContact],
                };
            }
            return person;
        });
        setData('contacts', updatedContacts);
    };
    
    

    // Remove um contato específico de uma pessoa
    const removeContact = (personIndex: number, contactIndex: number) => {
        const updatedContacts = data.contacts.map((person, pIndex) => {
            if (pIndex === personIndex) {
                const updatedPersonContacts = person.contacts.filter((_, cIndex) => cIndex !== contactIndex);
                return { ...person, contacts: updatedPersonContacts };
            }
            return person;
        });
        setData('contacts', updatedContacts);
    };
    

    // Remove uma pessoa inteira da lista de contatos
    const removePerson = (personIndex: number) => {
        setData('contacts', data.contacts.filter((_, index) => index !== personIndex));
    };
    

    return (
        <>
            <div className='w-[100%] md:w-[20%] m-auto'>
                <img src="https://keyar-atendimentos.s3.amazonaws.com/icones/contatos.png" className="m-auto w-20 h-20 md:w-40 md:h-40" alt="Contatos" />
            </div>

            <div className='w-[100%] md:w-[78%] flex flex-wrap gap-1 border-b-2 pb h-auto overflow-y-auto'>
                <h2 className="font-bold">Contatos</h2>
                {Array.isArray(data.contacts) && data.contacts.length > 0 ? (
                    data.contacts.map((person, personIndex) => (
                        <div key={personIndex} className="space-y-4 bg-gray-100 md:space-y-0 md:space-x-4 flex flex-wrap flex-col md:flex-row items-start gap-4 px-4 border rounded-lg shadow-sm">
                            {/* Nome da pessoa */}
                            <div className="flex-1">
                                <InputLabel htmlFor={`person_name_${personIndex}`} value="Nome da pessoa" />
                                <TextInput
                                    id={`person_name_${personIndex}`}
                                    value={person.name}
                                    className="mt-1 block w-full border-gray-300 rounded-md"
                                    onChange={(e) => handlePersonChange(personIndex, 'name', e.target.value)}
                                />
                            </div>
                            {/* Relação com o paciente */}
                            <div className="flex-1">
                                <InputLabel htmlFor={`relation_${personIndex}`} value="(A/O) paciente é o que dessa pessoa?" />
                                <div className="flex items-center gap-2">
                                    <TextInput
                                        id={`relation_${personIndex}`}
                                        value={person.relation}
                                        className="mt-1 block w-full border-gray-300 rounded-md"
                                        onChange={(e) => handleRelationChange(personIndex, e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className=''>
                                <button
                                    type="button"
                                    className="bg-green-500 text-white px-4 rounded mt-2"
                                    onClick={() => addNewContactForPerson(personIndex)}
                                >
                                    Adicionar novo contato
                                </button>
                            </div>
                            {/* Lista de contatos para cada pessoa */}
                            <div className="w-full">
                                {person.contacts.map((contact, contactIndex) => (
                                    <ContactInput
                                        key={contactIndex}
                                        contact={contact}
                                        index={contactIndex}
                                        onChange={(contactIndex, field, value) => handlePersonContactChange(personIndex, contactIndex, field, value)}
                                        onRemove={() => removeContact(personIndex, contactIndex)}
                                    />
                                ))}
                            </div>
                            {/* Ícone de exclusão de pessoa */}
                            <div
                                className="mt-4 md:mt-0 m-auto flex items-center justify-center bg-red-500 text-white rounded-full w-10 h-10 cursor-pointer transition hover:bg-red-600"
                                onClick={() => removePerson(personIndex)}
                            >
                                <RiDeleteBin5Fill className="w-5 h-5 m-auto" />
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">Nenhuma pessoa inserida.</p>
                )}
                <div className='w-full'>
                    <button
                        type="button"
                        className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                        onClick={addContact}
                    >
                        Adicionar nova pessoa
                    </button>
                </div>
            </div>
        </>
    );
};

export default ContactSection;
