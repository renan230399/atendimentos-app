import React, { useState, useCallback } from 'react';
import { useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import FieldEditor from './FieldEditor'; // Para editar os campos do formulário
import { Dialog } from 'primereact/dialog';
import { CiEdit } from 'react-icons/ci';
import { Sidebar } from 'primereact/sidebar';
import {FormField, Form} from '@/Pages/Patients/interfacesPatients'


interface FormEditProps {
  form: Form;
}

const FormEdit: React.FC<FormEditProps> = ({ form }) => {
  const { data, setData, post, processing, errors, reset, put } = useForm({
    id: form.id,
    name: form.name,
    description: form.description || '',
    icon: form.icon || '',
    fields: form.fields || [],
  });

  const [selectedFieldIndex, setSelectedFieldIndex] = useState<number | null>(null);
  const [popupParams, setPopupParams] = useState({}); // Estado para coordenadas do popup
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Estado para controlar o popup de criação

  const handleOpenPopup = useCallback((fieldIndex: number) => {
    setSelectedFieldIndex(fieldIndex);
    setIsPopupOpen(true);
  }, []);

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedFieldIndex(null); // Limpar o índice ao fechar o popup
  };

  // Função para adicionar um novo campo ao formulário
  const addField = () => {
    setData('fields', [
      ...data.fields,
      {
        label: '', // Label do campo
        label_view: '', // Label para visualização
        type: 'text', // Tipo de campo
        required: false, // Se o campo é obrigatório
        default_value: '', // Valor padrão
        options: [], // Opções (caso seja select, radio ou checkbox)
        class: '', // Opções (caso seja select, radio ou checkbox)
        photo_select: null // Para campos de upload de fotos
      },
    ]);
  };

  // Função para atualizar um campo específico
  const updateField = (index: number, updatedField: FormField) => {
    const updatedFields = data.fields.map((field, idx) =>
      idx === index ? updatedField : field
    );
    setData('fields', updatedFields);
  };

  // Função para remover um campo do formulário
  const removeField = (index: number) => {
    setData(
      'fields',
      data.fields.filter((_, idx) => idx !== index)
    );
  };

  // Função para enviar as alterações usando PUT
  const sendFieldsToBackend = () => {
    put(route('form.update', form.id), {
      onSuccess: () => {
        reset(); // Limpa o formulário se necessário
        alert('Formulário atualizado com sucesso!');
      },
      onError: (errors) => {
        console.log('Erro ao atualizar o formulário', errors);
      },
    });
  };

  return (
    <div className="w-full flex">
      <div className="hidden p-6 bg-white rounded-lg shadow-lg max-w-xl h-[100%] overflow-y-hidden fixed">
        <h2 className="text-2xl font-bold mb-4">
          Editar Formulário: {form.name} {form.id}
        </h2>

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

        {/* Botão para adicionar novo campo */}
        <PrimaryButton onClick={addField} className="mb-5">
          Adicionar Campo
        </PrimaryButton>
      </div>

      <Dialog header="Header" visible={isPopupOpen} style={{ width: '50vw' }} onHide={closePopup}>
        {isPopupOpen && selectedFieldIndex !== null && (
          <FieldEditor
            key={selectedFieldIndex}
            field={data.fields[selectedFieldIndex]}
            onUpdate={(updatedField) => updateField(selectedFieldIndex, updatedField)}
            onRemove={() => removeField(selectedFieldIndex)}
          />
        )}
      </Dialog>

      <div className="p-6 bg-white rounded-lg shadow-lg w-[100%] overflow-y-hidden">
        {/* Renderizar o formulário preenchido */}
        <div className="mb-5">
          <h3 className="text-xl font-semibold mb-2">Visualização do Formulário Preenchido</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-20 h-[90%] overflow-y-hidden">
            {data.fields.map((field, index) => (
              <div key={index}>
                <CiEdit
                  className="text-blue-500 relative cursor-pointer"
                  onClick={() => handleOpenPopup(index)}
                  size={30}
                />
                {/* Renderizar o FieldEditor ou componente de visualização */}
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
  );
};

export default FormEdit;
