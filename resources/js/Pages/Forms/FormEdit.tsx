import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import FieldEditor from './FieldEditor'; // Para editar os campos do formulário
import FormField from './FormField'; // Para renderizar o formulário preenchido
import { CiEdit } from "react-icons/ci";
import PictureInPictureComponent from '@/Layouts/PictureInPictureComponent';
import { Inertia } from '@inertiajs/inertia';
import { Sidebar } from 'primereact/sidebar';

const FormEdit = ({ form }) => {
  const [formData, setFormData] = useState({
    name: form.name,
    description: form.description,
    icon: form.icon,
    fields: form.fields || []
  });
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedFieldIndex, setSelectedFieldIndex] = useState(null); // Armazenar o índice do campo selecionado
  const [popupParams, setPopupParams] = useState({}); // Estado para coordenadas do popup
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Estado para controlar o popup de criação

  const handleOpenPopup = useCallback((e, fieldIndex) => {
    e.stopPropagation(); // Evita que o clique acione outros handlers
    setSelectedFieldIndex(fieldIndex);
    setPopupParams({ clientX: e.clientX, clientY: e.clientY });
    setIsPopupOpen(true);
  }, []);

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedFieldIndex(null); // Limpar o índice ao fechar o popup
  };

  // Função para adicionar um novo campo ao formulário
  const addField = () => {
    setFormData({
      ...formData,
      fields: [
        ...formData.fields,
        {
          label: '', // Label do campo
          label_view: '', // Label para visualização
          type: 'text', // Tipo de campo
          required: false, // Se o campo é obrigatório
          default_value: '', // Valor padrão
          options: [], // Opções (caso seja select, radio ou checkbox)
          class: '', // Opções (caso seja select, radio ou checkbox)

          photo_select: null // Para campos de upload de fotos
        }
      ]
    });
  };

  // Função para atualizar um campo específico
  const updateField = (index, updatedField) => {
    const updatedFields = formData.fields.map((field, idx) =>
      idx === index ? updatedField : field
    );
    setFormData({ ...formData, fields: updatedFields });
  };

  // Função para remover um campo do formulário
  const removeField = (index) => {
    setFormData({
      ...formData,
      fields: formData.fields.filter((_, idx) => idx !== index)
    });
  };

  // Função para enviar as alterações
  const sendFieldsToBackend = () => {
    setProcessing(true); // Iniciar o estado de processamento
  
    // Mostrar os dados que serão enviados no console
    console.log({
      id: form.id, // Assumindo que você tenha o ID do formulário
      name: formData.name,
      description: formData.description,
      icon: formData.icon,
      fields: formData.fields, // Enviar os fields
    });
  
    // Enviar os dados para o backend via Inertia
    Inertia.post('/form/update', {
      id: form.id, // Assumindo que você tenha o ID do formulário
      name: formData.name,
      description: formData.description,
      icon: formData.icon,
      fields: formData.fields, // Enviar os fields
    }, {
      onFinish: () => {
        setProcessing(false); // Finalizar o estado de processamento
        alert('Formulário enviado com sucesso!');
      },
      onError: (errors) => {
        setErrors(errors); // Definir os erros recebidos do backend
        setProcessing(false); // Finalizar o estado de processamento
      },
    });
  };
  

  return (
    <>
      <div className="w-full flex">
        <div className="hidden p-6 bg-white rounded-lg shadow-lg max-w-xl h-[100%] overflow-y-hidden fixed">
          <h2 className="text-2xl font-bold mb-4">Editar Formulário: {form.name} {form.id}</h2>

          {/* Editar o nome do formulário */}
          <div className="mb-4">
            <InputLabel htmlFor="formName" value="Nome do Formulário" />
            <input
              id="formName"
              type="text"
              className="mt-1 block w-full border p-2"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <InputError message={errors.name} className="mt-2" />
          </div>

          {/* Editar a descrição do formulário */}
          <div className="mb-4">
            <InputLabel htmlFor="formDescription" value="Descrição do Formulário" />
            <textarea
              id="formDescription"
              className="mt-1 block w-full border p-2"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <InputError message={errors.description} className="mt-2" />
          </div>

          {/* Editar o ícone do formulário */}
          <div className="mb-4">
            <InputLabel htmlFor="formIcon" value="Ícone do Formulário (URL)" />
            <input
              id="formIcon"
              type="text"
              className="mt-1 block w-full border p-2"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            />
            <InputError message={errors.icon} className="mt-2" />
          </div>

          {/* Editar os campos do formulário */}
          <div className="mb-5">
            <h3 className="text-xl font-semibold mb-2">Campos do Formulário</h3>
            {/*formData.fields.map((field, index) => (
              <FieldEditor
                key={index}
                field={field}
                onUpdate={(updatedField) => updateField(index, updatedField)} // Atualiza o campo
                onRemove={() => removeField(index)}
              />
            ))*/}
          </div>

          {/* Botão para adicionar novo campo */}
          <PrimaryButton onClick={addField} className="mb-5">
            Adicionar Campo
          </PrimaryButton>


        </div>
        {isPopupOpen && selectedFieldIndex !== null && (
        <PictureInPictureComponent
            id="formulario_pip"

            onClose={closePopup}
          >
            <FieldEditor
              key={selectedFieldIndex}
              field={formData.fields[selectedFieldIndex]}
              onUpdate={(updatedField) => updateField(selectedFieldIndex, updatedField)}
              onRemove={() => removeField(selectedFieldIndex)}
            />
          </PictureInPictureComponent>


      )}

        <div className="p-6 bg-white rounded-lg shadow-lg w-[100%] overflow-y-hidden">
          {/* Renderizar o formulário preenchido */}
          <div className="mb-5">
            <h3 className="text-xl font-semibold mb-2">Visualização do Formulário Preenchido</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-20 h-[90%] overflow-y-hidden">
              {formData.fields.map((field, index) => (
                <div key={index}>
                  <CiEdit 
                    className="text-blue-500 relative cursor-pointer" 
                    onClick={(e) => handleOpenPopup(e, index)} // Passa o índice
                    size={30} 
                  />
                  <FormField
                    key={field.id ? `field-${field.id}` : `index-${index}`}
                    field={field}
                    errors={errors}
                  />
                </div>
              ))}
                        {/* Botão para salvar o formulário */}
          <PrimaryButton
            onClick={sendFieldsToBackend}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            disabled={processing}
          >
            {processing ? 'Salvando...' : 'Salvar Formulário'}
          </PrimaryButton>
            </div>
          </div>
        </div>
      </div>


    </>
  );
};

FormEdit.propTypes = {
  form: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    icon: PropTypes.string,
    fields: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        required: PropTypes.bool,
        options: PropTypes.arrayOf(PropTypes.string)
      })
    ),
  }).isRequired,
};

export default FormEdit;
