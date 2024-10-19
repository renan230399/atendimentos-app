import React, { useState, useEffect } from 'react';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import { Field, OptGroup } from '../../interfacesPatients';
// Tipos de campos permitidos no formulário
const fieldTypes = [
  { label: 'Texto', value: 'text' },
  { label: 'Número', value: 'number' },
  { label: 'Área de Texto', value: 'textarea' },
  { label: 'Seleção', value: 'select' },
  { label: 'Seleção com Optgroup', value: 'select_with_optgroup' },
  { label: 'Radio', value: 'radio' },
  { label: 'Checkbox', value: 'checkbox' },
  { label: 'Grupo de Checkbox', value: 'checkbox_group' },
  { label: 'Data', value: 'date' },
  { label: 'Multi Seleção', value: 'multi_select' },
  { label: 'Arquivo', value: 'file' },
];

interface FieldEditorProps {
    field: Field;
    onUpdate: (field: Field) => void;
    onRemove: () => void;
}

const FieldEditor: React.FC<FieldEditorProps> = ({ field, onUpdate, onRemove }) => {
    const [localField, setLocalField] = useState<Field>(field);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLocalField(field);
    }, [field]);

    const handleFieldChange = (key: keyof Field, value: any) => {
        setLocalField({ ...localField, [key]: value });
    };

    const handleBlur = () => {
      try {
          if (!localField.label) {
              throw new Error('O label não pode estar vazio!');
          }
          setIsSaving(true);
          onUpdate(localField);
          setTimeout(() => setIsSaving(false), 500);
      } catch (err: unknown) { // Define o tipo como unknown
          if (err instanceof Error) { // Verifica se err é uma instância de Error
              setError(err.message); // Acesse a mensagem de erro com segurança
          } else {
              setError('Erro desconhecido'); // Mensagem padrão para erros desconhecidos
          }
      }
  };
  
  // Renderiza o input para as opções caso o tipo de campo suporte isso
  const renderOptionsInput = () => {
    if (['select', 'radio', 'checkbox', 'select_with_optgroup'].includes(localField.type)) {
      return (
<div className="mb-2 w-full">
  <InputLabel value="Opções" />
  {localField.options?.map((option, index) => {
    if (typeof option === 'string') {
      return (
        <div key={index} className="flex items-center mb-2">
          <input
            type="text"
            className="mt-1 block w-full border p-2"
            value={option}
            onChange={(e) => handleOptionChange(e, index, null)} // Chama `handleOptionChange` com três parâmetros: o evento, o índice do grupo (index), e null para `optionIndex` já que não é um grupo
          />

          <button
            type="button"
            className="ml-2 text-red-500 hover:text-red-700"
            onClick={() => removeOption(index)} // Remove a opção individual
          >
            ✖
          </button>
        </div>
      );
    } else {
      // Quando option é do tipo OptGroup
      return (
        <div key={index}>
          {'options' in option && (
            <>
              <label className="block font-medium">{option.label}</label>
              {option.options.map((opt, idx) => (
                <div key={idx} className="flex items-center mb-2">
                  <input
                    type="text"
                    className="mt-1 block w-full border p-2"
                    value={opt.label} // Exibe o valor da label do Option
                    onChange={(e) => handleOptionChange(e, index, idx)} // Chama `handleOptionChange` para uma opção dentro de um OptGroup
                  />
                  <button
                    type="button"
                    className="ml-2 text-red-500 hover:text-red-700"
                    onClick={() => removeOption(index, idx)} // Remove a opção dentro do grupo
                  >
                    ✖
                  </button>
                </div>
              ))}
            </>
          )}
        </div>
      );
    }
  })}
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
// Função para manipular a mudança de uma opção específica
const handleOptionChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  groupIndex: number, // Índice do grupo
  optionIndex: number | null // Índice da opção dentro do grupo, ou `null` para opções individuais
) => {
  const newOptions = [...(localField.options || [])]; // Garante que options seja um array

  // Verifica se é uma opção individual ou um OptGroup
  if (typeof newOptions[groupIndex] === 'string' || optionIndex === null) {
    // Se for uma string ou `optionIndex` for null, atualiza a opção diretamente
    newOptions[groupIndex] = e.target.value;
  } else {
    // Se for um OptGroup, manipula as opções dentro do grupo
    const optGroup = newOptions[groupIndex] as OptGroup;
    optGroup.options[optionIndex].label = e.target.value; // Atualiza o label da opção no grupo
  }

  handleFieldChange('options', newOptions); // Atualiza o campo 'options'
};


  
// Função para remover uma opção específica de um grupo ou de uma lista de opções
const removeOption = (groupIndex: number, optionIndex: number | null = null) => {
  const newOptions = [...(localField.options || [])]; // Garante que options seja um array

  if (optionIndex === null) {
    // Remove o OptGroup ou a opção individual
    newOptions.splice(groupIndex, 1);
  } else {
    // Se for um OptGroup, remove a opção específica dentro do grupo
    const optGroup = newOptions[groupIndex] as OptGroup;
    optGroup.options = optGroup.options.filter((_, idx) => idx !== optionIndex);
  }

  handleFieldChange('options', newOptions); // Atualiza o campo 'options'
};

  
  // Função para adicionar uma nova opção
  const addOption = () => {
    const newOptions = [...(localField.options || []), '']; // Garantir que options seja um array
    handleFieldChange('options', newOptions);
  };
  

  // Função para remover uma opção

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
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleFieldChange('photo_select', e.target.files[0]);
                  }
                }}
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


export default React.memo(FieldEditor); // Memoization para otimizar re-renders
