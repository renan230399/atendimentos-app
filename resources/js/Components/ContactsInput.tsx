import React, { useState } from 'react';
import PropTypes from 'prop-types';
import PrimaryButton from '@/Components/PrimaryButton';

// Tipos de contato permitidos
const contactTypes = [
  { label: 'Instagram', value: 'instagram' },
  { label: 'Facebook', value: 'facebook' },
  { label: 'WhatsApp', value: 'whatsapp' },
  { label: 'Email', value: 'email' },
  { label: 'LinkedIn', value: 'linkedin' },
];

const ContactsInput = ({ contacts, setContacts }) => {
  // Estados para armazenar o tipo e o valor do contato atual
  const [currentContactType, setCurrentContactType] = useState(contactTypes[0].value);
  const [currentContactValue, setCurrentContactValue] = useState('');

  // Função para adicionar um novo contato à lista
  const addContact = () => {
    if (!currentContactValue) return; // Não adiciona se o valor estiver vazio

    const newContact = {
      type: currentContactType,
      value: currentContactValue,
    };

    setContacts([...contacts, newContact]);
    setCurrentContactValue(''); // Limpa o valor do input após adicionar
  };

  // Função para remover um contato da lista
  const removeContact = (index) => {
    const updatedContacts = contacts.filter((_, i) => i !== index);
    setContacts(updatedContacts);
  };

  return (
    <div className="w-full p-4 border rounded bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">Adicionar Contato</h3>
      
      {/* Seleção do tipo de contato */}
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700">Tipo de Contato</label>
        <select
          className="mt-1 block w-full border p-2 rounded"
          value={currentContactType}
          onChange={(e) => setCurrentContactType(e.target.value)}
        >
          {contactTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Input do valor do contato */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Contato</label>
        <input
          type="text"
          className="mt-1 block w-full border p-2 rounded"
          value={currentContactValue}
          onChange={(e) => setCurrentContactValue(e.target.value)}
          placeholder="Digite o contato (ex.: @usuario, +55 11 91234-5678, email@dominio.com)"
        />
      </div>

      {/* Botão para adicionar contato */}
      <div onClick={addContact} className="mb-4">
        Adicionar Contato
      </div>

      {/* Lista de contatos adicionados */}
      <div className="mt-4">
        <h4 className="text-md font-semibold mb-2">Contatos Adicionados</h4>
        {contacts.length > 0 ? (
          <ul className="list-disc pl-5">
            {contacts.map((contact, index) => (
              <li key={index} className="flex justify-between items-center">
                <span>
                  <strong>{contactTypes.find(type => type.value === contact.type)?.label}:</strong> {contact.value}
                </span>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => removeContact(index)}
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-600">Nenhum contato adicionado ainda.</p>
        )}
      </div>
    </div>
  );
};

ContactsInput.propTypes = {
  contacts: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  setContacts: PropTypes.func.isRequired,
};

export default ContactsInput;
