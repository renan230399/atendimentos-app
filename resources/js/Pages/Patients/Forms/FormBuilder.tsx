import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { z } from 'zod'; // Importando Zod
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import InputFile from '@/Components/InputFile';
import { Form } from '../interfacesPatients';
import { InputText } from 'primereact/inputtext';
// Definindo o esquema de validação do Zod
// Definindo o esquema de validação do Zod
const formSchema = z.object({
  name: z.string().min(1, "O nome do formulário é obrigatório"),
  description: z.string().optional(),
  icon: z.any().optional(),
  category: z.number().nullable().optional(),
  active: z.boolean(),
  is_wizard: z.boolean(),
  wizard_structure: z
    .array(
      z.object({
        order: z.number().min(1, "A ordem deve ser um número positivo"),
        name: z.string().min(1, "O nome do passo é obrigatório"),
      })
    )
    .nullable()
    .optional(),
});

interface FormBuilderProps {
  form?: Form | null;
  onSave: (formData: FormData) => void;
  processing: boolean;
}

const FormBuilder: React.FC<FormBuilderProps> = ({ form = null, onSave, processing }) => {
  const { data, setData, errors, setError } = useForm({
    name: form?.name || '',
    description: form?.description || '',
    icon: undefined as File | string | undefined,
    category: form?.category || 1,
    active: form?.active ?? true,
    is_wizard: form?.is_wizard ?? false,
    wizard_structure: form?.wizard_structure || [], // Inicializando como array vazio
  });
  // Carrega o ícone existente ao editar
  useEffect(() => {
    if (form?.icon) {
      setData('icon', form.icon);
    }
  }, [form]);

  // Função para manipular o envio do formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validar os dados usando o schema Zod
    const result = formSchema.safeParse(data);
    
    if (!result.success) {
      // Captura os erros de validação do Zod e configura no formulário
      const zodErrors = result.error.errors.reduce((acc: any, err) => {
        acc[err.path[0]] = err.message;
        return acc;
      }, {});

      setError(zodErrors);
      return;
    }

    // Cria uma instância de FormData para enviar arquivos e outros dados
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('category', data.category?.toString() || '');
    formData.append('active', data.active.toString());
    formData.append('is_wizard', data.is_wizard.toString());

    // Verifica se o ícone é um arquivo ou uma string (URL existente)
    if (data.icon && typeof data.icon !== 'string') {
      formData.append('icon', data.icon);
    }

    onSave(formData); // Passa os dados para a função onSave
  };

  return (
    <form onSubmit={handleSubmit} className="p-5 flex flex-wrap">
      <h1 className="text-2xl font-bold mb-5 w-full">{form ? 'Editar Formulário' : 'Criar Formulário'}</h1>


      {/* Upload do Ícone */}
      <div className="w-[40%] mb-4">
        <InputFile
          label="Ícone do Formulário"
          file={data.icon}
          setFile={(file) => setData('icon', file || undefined)}
          errors={errors.icon}
        />
      </div>
      {/* Nome do Formulário */}
      <div className="mb-4 w-[58%] m-auto">
        <InputLabel htmlFor="formName" value="Nome do Formulário" />
        <InputText
          id="formName"
          type="text"
          className="mt-1 block w-full border p-2"
          value={data.name}
          onChange={(e) => setData('name', e.target.value)}
          placeholder="Digite o nome do formulário"
        />
        <InputError message={errors.name} className="mt-2" />

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

      {/* Categoria */}
      <div className="mb-4 w-[30%] mx-auto">
        <InputLabel htmlFor="category" value="Categoria" />
        <input
          id="category"
          type="number"
          className="mt-1 block w-full border p-2"
          value={data.category || ''}
          onChange={(e) => setData('category', Number(e.target.value))}
          placeholder="ID da categoria"
        />

        <select
          id="category"
          className="mt-1 block w-full border p-2"
          value={data.category || ''}
          onChange={(e) => setData('category', Number(e.target.value))}
        >
          <option value="1">Normal</option>
          <option value="2">Procedimento com gastos</option>
        </select>
        <InputError message={errors.category} className="mt-2" />



        <InputLabel htmlFor="active" value="Ativo" />
        <select
          id="active"
          className="mt-1 block w-full border p-2"
          value={data.active ? 'ativo' : 'inativo'}
          onChange={(e) => setData('active', e.target.value === 'ativo')}
        >
          <option value="ativo">Ativo</option>
          <option value="inativo">Inativo</option>
        </select>
        <InputError message={errors.active} className="mt-2" />

        <InputLabel htmlFor="is_wizard" value="Formulário Wizard?" />
        <select
          id="is_wizard"
          className="mt-1 block w-full border p-2"
          value={data.is_wizard ? 'sim' : 'não'}
          onChange={(e) => setData('is_wizard', e.target.value === 'sim')}
        >
          <option value="sim">Sim</option>
          <option value="não">Não</option>
        </select>
        <InputError message={errors.is_wizard} className="mt-2" />
      </div>

      {/* Estrutura do Wizard */}
      <div className="mb-4 w-[65%] mx-auto">
          <InputLabel htmlFor="wizard_structure" value="Estrutura do Wizard" />
          
          {/* Renderizando cada passo da estrutura do wizard */}
          {data.wizard_structure?.map((step, index) => (
            <div key={index} className="flex gap-4 mb-2">
                            <div className="w-1/4">
                <InputLabel value="Ordem" />
                <input
                  type="number"
                  readOnly
                  className="block w-full border p-2"
                  value={index+1}
                  onChange={(e) => {
                    const updatedSteps = [...data.wizard_structure];
                    updatedSteps[index].order = Number(e.target.value);
                    setData('wizard_structure', updatedSteps);
                  }}
                  placeholder="Ordem"
                />
              </div>
              <div className="w-1/2">
                <InputLabel value={`Passo ${index + 1}: Nome`} />
                <input
                  type="text"
                  
                  className="block w-full border p-2"
                  value={step.name}
                  onChange={(e) => {
                    const updatedSteps = [...data.wizard_structure];
                    updatedSteps[index].name = e.target.value;
                    setData('wizard_structure', updatedSteps);
                  }}
                  placeholder={`Nome do Passo ${index + 1}`}
                />
              </div>

              <button
                type="button"
                className="bg-red-500 text-white px-4 py-2 rounded mt-auto"
                onClick={() => {
                  const updatedSteps = data.wizard_structure?.filter((_, i) => i !== index);
                  setData('wizard_structure', updatedSteps);
                }}
              >
                Remover
              </button>
            </div>
          ))}

          <button
            type="button"
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => {
              const newStep = { order: data.wizard_structure?.length + 1 || 1, name: '' };
              setData('wizard_structure', [...(data.wizard_structure || []), newStep]);
            }}
          >
            Adicionar Passo
          </button>

          <InputError message={errors.wizard_structure} className="mt-2" />
        </div>

        <div className="w-full">
              {/* Botão para salvar o formulário */}
              <PrimaryButton
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
                disabled={processing}
              >
                {processing ? 'Salvando...' : form ? 'Atualizar Formulário' : 'Cadastrar Formulário'}
              </PrimaryButton>
              </div>

    </form>
  );
};

export default FormBuilder;
