import React from 'react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import TelefoneInput from '@/Components/TelefoneInput';
import { RiDeleteBin5Fill } from "react-icons/ri";

// Tipos de contato permitidos
const contactTypes = [
    { label: 'Instagram', value: 'instagram' },
    { label: 'Facebook', value: 'facebook' },
    { label: 'WhatsApp', value: 'whatsapp' },
    { label: 'Email', value: 'email' },
    { label: 'LinkedIn', value: 'linkedin' },
];

const ContactSection = ({ data, setData, errors, handleContactChange, handlePersonContactChange, handleRelationChange, addContact, addNewContactForPerson, removeContact, removePerson }) => {
    return (
        <>
            <div className='w-[100%] md:w-[20%] m-auto'>
                <img src="https://keyar-atendimentos.s3.amazonaws.com/icones/contatos.png" className="m-auto w-20 h-20 md:w-40 md:h-40" />
            </div>

            <div className='w-[100%] md:w-[78%] flex flex-wrap gap-1 border-b-2 pb h-auto overflow-y-auto'>

                        <h2 className="font-bold">Contatos</h2>
                        {Array.isArray(data.contacts) && data.contacts.length > 0 ? (
                            data.contacts.map((person, personIndex) => (
                                <div key={personIndex} className="space-y-4 bg-gray-100  md:space-y-0 md:space-x-4 flex flex-wrap flex-col md:flex-row items-start gap-4 px-4 border rounded-lg shadow-sm">
                                    {/* Nome da pessoa */}
                                    <div className="flex-1">
                                        <InputLabel htmlFor={`person_name_${personIndex}`} value="Nome da pessoa" />
                                        <TextInput
                                            id={`person_name_${personIndex}`}
                                            value={person.name}
                                            className="mt-1 block w-full border-gray-300 rounded-md"
                                            onChange={(e) => handleContactChange(personIndex, 'name', e.target.value)}
                                        />
                                    </div>
                                    {/* Relação com o paciente - Radio para "Próprios" ou familiar */}
                                    <div className="flex-1 " >
                                    <InputLabel htmlFor={`relation_${personIndex}`} value="(A/O) paciente é o que dessa pessoa?" />
                                    <div className="flex items-center gap-2">
                                            <TextInput
                                                id={`person_name_${personIndex}`}
                                                value={person.relation}
                                                className="mt-1 block w-full border-gray-300 rounded-md"
                                                onChange={(e) => handleContactChange(personIndex, 'relation', e.target.value)}
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
                                    <div className="w-full ">
                                        {person.contacts.map((contact, contactIndex) => (
                                            <div key={contactIndex} className="flex border flex-col md:flex-row gap-4 mb-2">
                                                <div className='flex-1'>
                                                    <InputLabel value="Tipo de contato" />
                                                    <select
                                                        className="mt-1 block w-full border p-2 rounded"
                                                        value={contact.type}
                                                        onChange={(e) => handlePersonContactChange(personIndex, contactIndex, 'type', e.target.value)}
                                                    >
                                                        {contactTypes.map((type) => (
                                                            <option key={type.value} value={type.value}>
                                                                {type.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="flex-1">
                                                    <InputLabel value="Valor do contato" />
                                                    <TextInput
                                                        value={contact.value}
                                                        className="mt-1 block w-full border-gray-300 rounded-md"
                                                        onChange={(e) => handlePersonContactChange(personIndex, contactIndex, 'value', e.target.value)}
                                                    />
                                                </div>

                                                {/* Ícone de exclusão de contato */}
                                                <div
                                                    className="mt-4 md:mt-0 my-auto flex items-center justify-center bg-red-500 text-white rounded-full w-10 h-10 cursor-pointer transition hover:bg-red-600"
                                                    onClick={() => removeContact(personIndex, contactIndex)}
                                                >
                                                    <RiDeleteBin5Fill className="w-5 h-5 m-auto" />
                                                </div>
                                            </div>
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
