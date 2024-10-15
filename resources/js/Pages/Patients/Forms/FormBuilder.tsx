import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import InputFile from '@/Components/InputFile';

interface Form {
  id?: number;
  name?: string;
  description?: string;
  icon?: string;
  fields?: any[];
}

interface FormBuilderProps {
  form?: Form | null;
  onSave: (formData: FormData) => void;
  processing: boolean;
}

const FormBuilder: React.FC<FormBuilderProps> = ({ form = null, onSave, processing }) => {
  // Usando o useForm para gerenciar o estado do formulário, com dados pré-carregados, se existir
  const { data, setData, errors } = useForm({
    name: form?.name || '',
    description: form?.description || '',
    icon: undefined as File | string | undefined, // Ícone será preenchido por upload ou pelo dado atual
    fields: form?.fields || []
  });
  
  // Carrega o ícone existente ao editar
  useEffect(() => {
    if (form?.icon) {
      setData('icon', form.icon); // Preenche o ícone existente (como string/URL), se houver
    }
  }, [form]);

  // Função para manipular o envio do formulário
// Função para manipular o envio do formulário
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  // Cria uma instância de FormData para enviar arquivos e outros dados
  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('description', data.description);

  // Verifica se o ícone é um arquivo ou uma string (URL existente)
  if (data.icon && typeof data.icon !== 'string') {
    formData.append('icon', data.icon); // Envia o arquivo somente se for um novo upload
  }

  // Passa os dados de FormData para o callback onSave
  onSave(formData);
};


  return (
    <form onSubmit={handleSubmit} className="p-5">
      <h1 className="text-2xl font-bold mb-5">{form ? 'Editar Formulário' : 'Criar Formulário'}</h1>

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

      {/* Upload do Ícone */}
      <div className="w-[100%] mb-4">
      <InputFile
          label="Ícone do Formulário"
          file={data.icon} // Agora será string | File | undefined
          setFile={(file) => setData('icon', file || undefined)} // Use undefined se não houver arquivo
          errors={errors.icon}
        />
      </div>

      {/* Botão para salvar o formulário */}
      <PrimaryButton
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={processing}
      >
        {processing ? 'Salvando...' : form ? 'Atualizar Formulário' : 'Cadastrar Formulário'}
      </PrimaryButton>
    </form>
  );
};

export default FormBuilder;
