import React from 'react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import TelefoneInput from '@/Components/TelefoneInput';
import { RiDeleteBin5Fill } from "react-icons/ri";

const ContactSection = ({ data, setData, errors, handleContactChange, removeContact, addContact }) => {
    return (
        <>
            <div className='w-[100%] md:w-[20%] m-auto'>
                <img src="https://keyar-atendimentos.s3.amazonaws.com/icones/contatos.png" className="m-auto w-20 h-20 md:w-40 md:h-40" />
            </div>
    
            <div className='w-[100%] md:w-[78%] flex flex-wrap gap-1 border-b-2 pb-5'>
                <div className='w-[100%]'>
                    <div>
                        <h2 className="font-bold">Contatos</h2>
                        {Array.isArray(data.contacts) && data.contacts.length > 0 ? (
                            data.contacts.map((contact, index) => (
                                <div
                                    key={index}
                                    className="space-y-4 md:space-y-0 md:space-x-4 flex flex-col md:flex-row items-start gap-4 p-4 border rounded-lg shadow-sm bg-white"
                                >
                                    <div className="flex-1">
                                        <InputLabel htmlFor={`contact_name_${index}`} value="Nome do contato" />
                                        <TextInput
                                            id={`contact_name_${index}`}
                                            value={contact.name}
                                            className="mt-1 block w-full border-gray-300 rounded-md"
                                            onChange={(e) => handleContactChange(index, 'name', e.target.value)}
                                        />
                                    </div>
                                
                                    <div className="flex-1">
                                        <InputLabel htmlFor={`contact_phone_${index}`} value="Número do contato" />
                                        <TelefoneInput
                                            label="Contact Phone"
                                            value={contact.phone}
                                            onChange={(e) => handleContactChange(index, 'phone', e.target.value)}
                                            errors={errors} // Passa os erros caso haja validação
                                        />
                                    </div>
                                
                                    <div className="flex-1">
                                        <InputLabel htmlFor={`contact_relation_${index}`} value="Relação com o paciente" />
                                        <TextInput
                                            id={`contact_relation_${index}`}
                                            value={contact.relation}
                                            className="mt-1 block w-full border-gray-300 rounded-md"
                                            onChange={(e) => handleContactChange(index, 'relation', e.target.value)}
                                        />
                                    </div>
                                
                                    {/* Ícone de exclusão */}
                                    <div
                                        className="mt-4 md:mt-0 my-auto flex items-center justify-center bg-red-500 text-white rounded-full w-10 h-10 cursor-pointer transition hover:bg-red-600"
                                        onClick={() => removeContact(index)}
                                    >
                                        <RiDeleteBin5Fill className="w-5 h-5" />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">Nenhum contato inserido.</p>
                        )}
                        
                        <button
                            type="button"
                            className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                            onClick={addContact}
                        >
                            Adicionar contato
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ContactSection;
