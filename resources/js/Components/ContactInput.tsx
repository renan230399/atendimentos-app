import React, { useState, useEffect } from 'react';
import TextInput from '@/Components/TextInput';
import { InputMask } from 'primereact/inputmask';
import { FaTrashAlt } from 'react-icons/fa';
import { FaInstagram, FaFacebook, FaTwitter, FaLinkedin, FaEnvelope,FaPhone } from 'react-icons/fa';
import { RiWhatsappFill } from "react-icons/ri";
import { ContactDetail } from '@/Pages/Patients/interfacesPatients';
import CustomDropdown from './CustomDropdown'; // Supondo que o CustomDropdown está no mesmo diretório
const linkOptions = [
    {
        value: 1,
        label: 'Instagram',
        icon: <FaInstagram className="text-pink-500" />,
    },
    {
        value: 2,
        label: 'Facebook',
        icon: <FaFacebook className="text-blue-600" />,
    },
    {
        value: 3,
        label: 'Twitter',
        icon: <FaTwitter className="text-blue-400" />,
    },
    {
        value: 4,
        label: 'LinkedIn',
        icon: <FaLinkedin className="text-blue-700" />,
    },
    {
        value: 5,
        label: 'E-mail',
        icon: <FaEnvelope className="text-gray-600" />,
    },
];
const phoneOptions = [
    {
        value: 1,
        label: 'Whatsapp',
        icon: <RiWhatsappFill className="text-green-500" />,
    },
    {
        value: 2,
        label: 'Telefone Fixo',
        icon: <FaPhone className="text-black" />,
    },
];


interface ContactInputProps {
    contact: ContactDetail;
    index: number;
    onChange: (index: number, field: keyof ContactDetail, value: string) => void;
    onRemove: (index: number) => void;
}

const ContactInput: React.FC<ContactInputProps> = ({ contact, index, onChange, onRemove }) => {
    const [mask, setMask] = useState('(99) 9999-9999?9'); // Máscara inicial para telefone fixo
console.log(contact.value);


    // Atualiza a máscara dinamicamente com base no comprimento do valor inserido
    useEffect(() => {
        const numericValue = contact.value.replace(/\D/g, ''); // Remove caracteres não numéricos
        if (numericValue.length > 11) {
            setMask('(99) 9 9999-9999'); // Celular: Adiciona o dígito extra
        } else {
            setMask('(99) 9999-9999'); // Telefone fixo
        }
    }, [contact.value]);
    return (
        <div className="flex w-[100%]">

            <select
                value={contact.category}
                onChange={(e) => onChange(index, 'category', e.target.value)}
                className="w-[32%] border px-2 py-1 m-auto"
            >
                <option value="phone">Telefone</option>
                <option value="link">Link</option>
                <option value="string">Texto</option>
            </select>

            <div className='w-[32%] m-auto'>
            {contact.category === 'link' ? (
                <>
                <CustomDropdown
                    value={Number(contact.type)}
                    onChange={(value) => onChange(index, 'type', value)} // Passa o valor correto
                    options={linkOptions} // Opções de link
                    id={`contact-type-${index}`}
                    placeholder="Selecione o tipo de contato"
                />
                </>

            ) : contact.category === 'phone' ? (
                <CustomDropdown
                    value={Number(contact.type)}
                    onChange={(value) => onChange(index, 'type', value)} // Passa o valor correto
                    options={phoneOptions} // Opções de link
                    id={`contact-type-${index}`}
                    placeholder="Selecione o tipo de contato"
                />
            ) : (
                <div>

                </div>
)}
            </div>

            <div className='w-[32%]'>

            {contact.category === 'phone' ? (
                <InputMask
                    id={`contact-value-${index}`}
                    mask={
                        contact.type === 1 ?(
                            '(99) 9 9999-9999'
                        ):(
                            '(99) 9999-9999'
                        )
                        }  // Aqui vai a máscara correta
                    value={contact.value}  // Aqui vai o valor atual do contato
                    onChange={(e) => onChange(index, 'value', e.target.value as string)}  
                    placeholder="Número ou Detalhe"
                    className="w-full"
                />



            ) : (
                <TextInput
                    id={`contact-value-${index}`}
                    type="text"
                    placeholder={contact.category === 'link' ? 'URL' : 'Número ou Detalhe'}
                    value={contact.value}
                    onChange={(e) => onChange(index, 'value', e.target.value)}
                    className="w-full"
                />
            )}
            </div>
            <button
                type="button"
                onClick={() => onRemove(index)}
                className="text-red-500 hover:text-red-700"
                title="Remover Contato"
            >
                <FaTrashAlt />
            </button>
        </div>
    );
};

export default ContactInput;
