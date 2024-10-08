import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';

// Tipos de campos permitidos no formulário
const fieldTypes = [
  { label: 'Texto', value: 'text' },
  { label: 'Número', value: 'number' },
  { label: 'Área de Texto', value: 'textarea' },
  { label: 'Seleção', value: 'select' },
  { label: 'Seleção com Optgroup', value: 'select_with_optgroup' }, // Novo campo
  { label: 'Radio', value: 'radio' },
  { label: 'Checkbox', value: 'checkbox' },
  { label: 'Grupo de Checkbox', value: 'checkbox_group' }, // Novo campo
  { label: 'Data', value: 'date' },
  { label: 'Multi Seleção', value: 'multi_select' }, // Novo campo
  { label: 'Arquivo', value: 'file' }, // Novo campo
  { label: 'Seletor de Corpo', value: 'body_selector' }, // Novo campo
];


const FieldEditor = ({ field, onUpdate, onRemove }) => {
  // Estado local para o campo, com base nas props
  const [localField, setLocalField] = useState(field);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLocalField(field); // Sincroniza o estado local com o campo recebido via props
  }, [field]);

  // Função para lidar com as mudanças nos campos locais
  const handleFieldChange = (key, value) => {
    setLocalField({ ...localField, [key]: value });
  };

  // Função para validar o campo e enviar os dados atualizados ao pai
  const handleBlur = () => {
    try {
      if (!localField.label) {
        throw new Error('O label não pode estar vazio!');
      }
      setIsSaving(true);
      onUpdate(localField);
      setTimeout(() => setIsSaving(false), 500); // Simulação de tempo de processamento
    } catch (err) {
      setError(err.message);
    }
  };

// Renderiza o input para as opções caso o tipo de campo suporte isso
const renderOptionsInput = () => {
  if (['select', 'radio', 'checkbox','select_with_optgroup'].includes(localField.type)) {
    return (
      <div className="mb-2 w-full">
        <InputLabel value="Opções" />
        {localField.options?.map((option, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              className="mt-1 block w-full border p-2"
              value={option}
              onChange={(e) => handleOptionChange(e, index)}
            />
            <button
              type="button"
              className="ml-2 text-red-500 hover:text-red-700"
              onClick={() => removeOption(index)}
            >
              ✖
            </button>
          </div>
        ))}
        <button
          type="button"
          className="mt-2 text-blue-500 hover:text-blue-700"
          onClick={addOption}
        >
          + Adicionar Opção
        </button>
      </div>
    );
  }
  return null;
};

// Função para manipular a mudança de uma opção específica
const handleOptionChange = (e, index) => {
  const newOptions = [...localField.options];
  newOptions[index] = e.target.value;
  handleFieldChange('options', newOptions);
};

// Função para adicionar uma nova opção
const addOption = () => {
  const newOptions = [...(localField.options || []), ''];
  handleFieldChange('options', newOptions);
};

// Função para remover uma opção
const removeOption = (index) => {
  const newOptions = localField.options.filter((_, i) => i !== index);
  handleFieldChange('options', newOptions);
};


  return (
    <div className="flex flex-wrap border p-4 mb-4 bg-gray-100 rounded">
      {/* Exibe mensagem de erro, se houver */}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Editar o label do campo */}
      <div className="mb-2 md:w-[48%] w-[100%] m-auto">
        <InputLabel value="Label do Campo" />
        <input
          type="text"
          className="mt-1 block w-full border p-2"
          value={localField.label || ''}
          onChange={(e) => handleFieldChange('label', e.target.value)}
          onBlur={handleBlur}
        />
      </div>

      {/* Editar o label view do campo */}
      <div className="mb-2 w-[48%] m-auto">
        <InputLabel value="Label para Visualização" />
        <input
          type="text"
          className="mt-1 block w-full border p-2"
          value={localField.label_view || ''}
          onChange={(e) => handleFieldChange('label_view', e.target.value)}
          onBlur={handleBlur}
        />
      </div>

      {/* Editar o valor padrão do campo */}
      {localField.type !== 'file' && (
        <div className="mb-2 w-[100%]">
          <InputLabel value="Valor Padrão" />
          <input
            type="text"
            className="mt-1 block w-full border p-2"
            value={localField.default_value || ''}
            onChange={(e) => handleFieldChange('default_value', e.target.value)}
            onBlur={handleBlur}
          />
        </div>
      )}

      {/* Selecionar foto (somente para campos do tipo 'file') */}
      {localField.type === 'file' && (
        <div className="mb-2 w-[100%]">
          <InputLabel value="Seleção de Foto" />
          <input
            type="file"
            className="mt-1 block w-full border p-2"
            onChange={(e) => handleFieldChange('photo_select', e.target.files[0])}
            onBlur={handleBlur}
          />
        </div>
      )}

      {/* Editar o tipo de campo */}
      <div className="mb-2 w-[50%]">
        <InputLabel value="Tipo de Campo" />
        <select
          className="mt-1 block w-full border p-2"
          value={localField.type}
          onChange={(e) => handleFieldChange('type', e.target.value)}
          onBlur={handleBlur}
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
          checked={localField.required || false}
          onChange={(e) => handleFieldChange('required', e.target.checked)}
          onBlur={handleBlur}
        />
      </div>

      {/* Editar o estilo do form */}
      <div className="mb-2 w-[48%] m-auto">
        <InputLabel value="Classes Tailwind" />
        <input
          type="text"
          className="mt-1 block w-full border p-2"
          value={localField.class || ''}
          onChange={(e) => handleFieldChange('class', e.target.value)}
          onBlur={handleBlur}
        />
      </div>
      {/* Renderiza as opções para select, radio, checkbox */}
      {renderOptionsInput()}

      {/* Botão para remover o campo */}
      <PrimaryButton
        onClick={onRemove}
        className="mt-2 mx-auto bg-red-500 text-white px-4 py-2 rounded"
      >
        Remover Campo
      </PrimaryButton>

      {/* Exibe um indicador de salvamento, se necessário */}
      {isSaving && <div className="text-blue-500 mt-2">Salvando...</div>}
    </div>
  );
};

FieldEditor.propTypes = {
  field: PropTypes.shape({
    label: PropTypes.string.isRequired,
    label_view: PropTypes.string,
    default_value: PropTypes.string,
    photo_select: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    type: PropTypes.string.isRequired,
    required: PropTypes.bool,
    options: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string), // Para select simples
      PropTypes.arrayOf( // Para optgroup (caso com objetos)
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          options: PropTypes.arrayOf(
            PropTypes.shape({
              label: PropTypes.string.isRequired,
              value: PropTypes.string.isRequired,
            })
          ).isRequired,
        })
      )
    ]),
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};


export default React.memo(FieldEditor); // Memoization para otimizar re-renders
