import React, { useState } from 'react';
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

const FormBuilder = ({ onSave }) => {
  const [fields, setFields] = useState([]); // Lista de campos do formulário
  const { data, setData, processing, errors } = useForm({
    name: '',
    description: '',
    fields: []
  });

  // Adiciona um novo campo ao formulário
  const addField = () => {
    setFields([
      ...fields,
      { label: '', type: 'text', required: false, options: [] } // Configuração básica inicial de um campo
    ]);
  };

  // Atualiza as informações de um campo
  const updateField = (index, updatedField) => {
    const updatedFields = fields.map((field, idx) =>
      idx === index ? updatedField : field
    );
    setFields(updatedFields);
  };

  // Remove um campo do formulário
  const removeField = (index) => {
    setFields(fields.filter((_, idx) => idx !== index));
  };

  // Salva o formulário
  const handleSave = () => {
    const formData = {
      ...data,
      fields
    };

    // Passa os dados para a função onSave do componente pai
    onSave(formData);
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">Criar Formulário</h1>

      {/* Nome do Formulário */}
      <div className="mb-4">
        <InputLabel htmlFor="formName" value="Nome do Formulário" />
        <input
          id="formName"
          type="text"
          className="mt-1 block w-full border p-2"
          value={data.name}
          onChange={(e) => setData('name', e.target.value)}
          placeholder="Digite o nome do formulário"
        />
        <InputError message={errors.name} className="mt-2" />
      </div>

      {/* Descrição do Formulário */}
      <div className="mb-4">
        <InputLabel htmlFor="formDescription" value="Descrição do Formulário" />
        <textarea
          id="formDescription"
          className="mt-1 block w-full border p-2"
          value={data.description}
          onChange={(e) => setData('description', e.target.value)}
          placeholder="Digite a descrição do formulário"
        />
        <InputError message={errors.description} className="mt-2" />
      </div>

      {/* Lista de campos dinâmicos */}
      <div className="mb-5">
        <h2 className="text-xl font-semibold">Campos do Formulário</h2>
        {fields.map((field, index) => (
          <FieldEditor
            key={index}
            index={index}
            field={field}
            onUpdate={(updatedField) => updateField(index, updatedField)}
            onRemove={() => removeField(index)}
          />
        ))}
        <InputError message={errors.fields} className="mt-2" />
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
  );
};

// Componente auxiliar para editar um campo do formulário
const FieldEditor = ({ field, index, onUpdate, onRemove }) => {
  const handleFieldChange = (key, value) => {
    onUpdate({ ...field, [key]: value });
  };

  return (
    <div className="border flex flex-wrap p-4 mb-4 bg-gray-100 rounded">
      {/* Label do Campo */}
      <div className="mb-2">
        <InputLabel value="Label do Campo" />
        <input
          type="text"
          className="mt-1 block w-full border p-2"
          value={field.label}
          onChange={(e) => handleFieldChange('label', e.target.value)}
          placeholder="Digite o label do campo"
        />
      </div>

      {/* Tipo de Campo */}
      <div className="mb-2">
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
      <div className="mb-2">
        <InputLabel value="Obrigatório?" />
        <input
          type="checkbox"
          checked={field.required}
          onChange={(e) => handleFieldChange('required', e.target.checked)}
        />
      </div>

      {/* Se o campo for de seleção, permite definir as opções */}
      {['select', 'radio', 'checkbox'].includes(field.type) && (
        <div className="mb-2">
          <InputLabel value="Opções" />
          <input
            type="text"
            className="mt-1 block w-full border p-2"
            value={field.options.join(', ')}
            onChange={(e) =>
              handleFieldChange('options', e.target.value.split(','))
            }
            placeholder="Digite as opções separadas por vírgulas"
          />
        </div>
      )}

      {/* Botão para remover o campo */}
      <PrimaryButton
        onClick={onRemove}
        className="mt-2 bg-red-500 text-white px-4 py-2 rounded"
      >
        Remover Campo
      </PrimaryButton>
    </div>
  );
};

export default FormBuilder;
