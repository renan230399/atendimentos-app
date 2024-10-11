import React, { useState, useEffect } from 'react';
import TextInput from '@/Components/TextInput';
import { InputMask } from 'primereact/inputmask';
import { FaTrashAlt } from 'react-icons/fa';

const ContactInput = ({ contact, index, onChange, onRemove }) => {
    const [mask, setMask] = useState('(99) 9999-9999?9'); // Máscara flexível para 8 ou 9 dígitos

    // Atualiza a máscara dinamicamente com base no comprimento do valor inserido
    useEffect(() => {
        const numericValue = typeof contact.value === 'string' ? contact.value.replace(/\D/g, '') : '';
        // Se o valor tiver mais de 10 dígitos, ajustamos para a máscara com 9 dígitos
        if (numericValue.length > 10) {
            setMask('(99) 99999-9999'); // Máscara para números com 9 dígitos
        } else {
            setMask('(99) 9999-9999?9'); // Máscara flexível para números com 8 ou 9 dígitos
        }
    }, [contact.value]);
    

    return (
        <div className="flex items-center gap-2 mb-2">
            <TextInput
                id={`contact-type-${index}`}
                type="text"
                placeholder="Tipo de Contato (e.g. WhatsApp)"
                value={contact.type}
                onChange={(e) => onChange(index, 'type', e.target.value)}
                className="w-1/4"
            />
            <select
                value={contact.category}
                onChange={(e) => onChange(index, 'category', e.target.value)}
                className="w-1/4 border px-2 py-1"
            >
                <option value="phone">Telefone</option>
                <option value="link">Link</option>
                <option value="string">Texto</option>
            </select>
            {contact.category === 'phone' ? (
                <InputMask
                    id={`contact-value-${index}`}
                    mask={mask}
                    value={contact.value}
                    onChange={(e) => onChange(index, 'value', e.target.value)}
                    placeholder="Número ou Detalhe"
                    className="w-1/2"
                />
            ) : (
                <TextInput
                    id={`contact-value-${index}`}
                    type="text"
                    placeholder={contact.category === 'link' ? 'URL' : 'Número ou Detalhe'}
                    value={contact.value}
                    onChange={(e) => onChange(index, 'value', e.target.value)}
                    className="w-1/2"
                />
            )}
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
