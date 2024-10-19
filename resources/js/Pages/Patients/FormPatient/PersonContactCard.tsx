import React from 'react';
import { RiDeleteBin5Fill } from "react-icons/ri";
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import ContactInput from '@/Components/ContactInput';
import { Contact } from '../interfacesPatients';

interface PersonContactCardProps {
    person: Contact;
    personIndex: number;
    handlePersonChange: (personIndex: number, field: keyof Contact, value: any) => void;
    handlePersonContactChange: (personIndex: number, contactIndex: number, field: string, value: any) => void;
    addNewContactForPerson: (personIndex: number) => void;
    removeContact: (personIndex: number, contactIndex: number) => void;
    removePerson: (personIndex: number) => void;
}

const PersonContactCard: React.FC<PersonContactCardProps> = ({
    person,
    personIndex,
    handlePersonChange,
    handlePersonContactChange,
    addNewContactForPerson,
    removeContact,
    removePerson,
}) => {
    return (
        <div className="space-y-4 bg-gray-100 md:space-y-0 md:space-x-4 flex flex-wrap flex-col md:flex-row items-start gap-4 px-4 border rounded-lg shadow-sm">
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
                        onChange={(e) => handlePersonChange(personIndex, 'relation', e.target.value)}
                    />
                </div>
            </div>
            {/* Ícone de exclusão de pessoa */}
            <div
                className="mt-4 md:mt-0 m-auto flex items-center justify-center bg-red-500 text-white rounded-full w-10 h-10 cursor-pointer transition hover:bg-red-600"
                onClick={() => removePerson(personIndex)}
            >
                <RiDeleteBin5Fill className="w-5 h-5 m-auto" />
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
            {/* Adicionar novo contato */}
            <div className=''>
                <button
                    type="button"
                    className="bg-green-500 text-white px-4 rounded mt-2"
                    onClick={() => addNewContactForPerson(personIndex)}
                >
                    Adicionar novo contato
                </button>
            </div>

        </div>
    );
};

export default PersonContactCard;
