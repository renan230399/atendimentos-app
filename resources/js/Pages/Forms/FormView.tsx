import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';

// Tipos de campos permitidos no formulário
const fieldTypes = [
  { label: 'Texto', value: 'text' },
  { label: 'Número', value: 'number' },
  { label: 'Área de Texto', value: 'textarea' },
  { label: 'Seleção', value: 'select' },
  { label: 'Radio', value: 'radio' },
  { label: 'Checkbox', value: 'checkbox' },
  { label: 'Data', value: 'date' }
];

const FormEdit = ({ form }) => {
  const { data, setData, processing, errors, post } = useForm({
    name: form.name,
    description: form.description,
    icon: form.icon,
    fields: form.fields || []
  });

  // Função para adicionar um novo campo ao formulário
  const addField = () => {
    setData('fields', [
      ...data.fields,
      { label: '', type: 'text', required: false, options: [] }
    ]);
  };

  // Função para atualizar um campo específico
  const updateField = (index, updatedField) => {
    const updatedFields = data.fields.map((field, idx) =>
      idx === index ? updatedField : field
    );
    setData('fields', updatedFields);
  };

  // Função para remover um campo do formulário
  const removeField = (index) => {
    setData('fields', data.fields.filter((_, idx) => idx !== index));
  };

  // Função para enviar as alterações
  const handleSave = () => {
    post(route('form.update', form.id)); // Ajuste a rota conforme sua configuração
  };

  return (
    <div className='w-full'>
                <div className="p-6 bg-white rounded-lg shadow-lg max-w-xl h-[100%] overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4">Editar Formulário: {form.name}</h2>

      {/* Editar o nome do formulário */}
      <div className="mb-4">
        <InputLabel htmlFor="formName" value="Nome do Formulário" />
        <input
          id="formName"
          type="text"
          className="mt-1 block w-full border p-2"
          value={data.name}
          onChange={(e) => setData('name', e.target.value)}
        />
        <InputError message={errors.name} className="mt-2" />
      </div>

      {/* Editar a descrição do formulário */}
      <div className="mb-4">
        <InputLabel htmlFor="formDescription" value="Descrição do Formulário" />
        <textarea
          id="formDescription"
          className="mt-1 block w-full border p-2"
          value={data.description}
          onChange={(e) => setData('description', e.target.value)}
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
          value={data.icon}
          onChange={(e) => setData('icon', e.target.value)}
        />
        <InputError message={errors.icon} className="mt-2" />
      </div>

      {/* Editar os campos do formulário */}
      <div className="mb-5">
        <h3 className="text-xl font-semibold mb-2">Campos do Formulário</h3>
        {data.fields.map((field, index) => (
          <FieldEditor
            key={index}
            field={field}
            onUpdate={(updatedField) => updateField(index, updatedField)}
            onRemove={() => removeField(index)}
          />
        ))}
      </div>

      {/* Botão para adicionar novo campo */}
      <PrimaryButton onClick={addField} className="mb-5">
        Adicionar Campo
      </PrimaryButton>

      {/* Botão para salvar o formulário */}
      <PrimaryButton
        onClick={handleSave}
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={processing}
      >
        {processing ? 'Salvando...' : 'Salvar Formulário'}
      </PrimaryButton>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-lg max-w-xl h-[100%] overflow-y-auto">
        </div>

    </div>

  );
};

// Componente para editar cada campo individualmente
const FieldEditor = ({ field, onUpdate, onRemove }) => {
  const handleFieldChange = (key, value) => {
    onUpdate({ ...field, [key]: value });
  };

  return (
    <div className="flex flex-wrap border p-4 mb-4 bg-gray-100 rounded">
      {/* Editar o label do campo */}
      <div className="mb-2 w-[100%]">
        <InputLabel value="Label do Campo" />
        <input
          type="text"
          className="mt-1 block w-full border p-2"
          value={field.label}
          onChange={(e) => handleFieldChange('label', e.target.value)}
        />
      </div>

      {/* Editar o tipo de campo */}
      <div className="mb-2 w-[50%]">
        <InputLabel value="Tipo de Campo" />
        <select
          className="mt-1 block w-full border p-2"
          value={field.type}
          onChange={(e) => handleFieldChange('type', e.target.value)}
        >
          {fieldTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Campo obrigatório */}
      <div className="mb-2 w-[50%]">
        <InputLabel value="Obrigatório?" />
        <input
          type="checkbox"
          checked={field.required}
          onChange={(e) => handleFieldChange('required', e.target.checked)}
        />
      </div>

      {/* Opções para campos de seleção */}
      {['select', 'radio', 'checkbox'].includes(field.type) && (
        <div className="mb-2 w-[100%]">
          <InputLabel value="Opções (separadas por vírgula)" />
          <input
            type="text"
            className="mt-1 block w-full border p-2"
            value={field.options ? field.options.join(', ') : ''}
            onChange={(e) => handleFieldChange('options', e.target.value.split(','))}
          />
        </div>
      )}

      {/* Botão para remover o campo */}
      <PrimaryButton
        onClick={onRemove}
        className="mt-2 mx-auto bg-red-500 text-white px-4 py-2 rounded"
      >
        Remover Campo
      </PrimaryButton>
    </div>
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
