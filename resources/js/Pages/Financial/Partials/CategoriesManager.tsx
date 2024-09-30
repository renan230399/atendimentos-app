import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { PlusCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

interface Category {
  id: number;
  name: string;
  type: string;
}

interface CategoriesManagerProps {
  categories: Category[];
}

const CategoriesManager: React.FC<CategoriesManagerProps> = ({ categories }) => {
  const { data, setData, post, reset, errors } = useForm({
    name: '',
    type: 'income',
  });

  const [isAddingCategory, setIsAddingCategory] = useState(false);

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('transaction_categories.store'), {
      preserveScroll: true,
      onSuccess: () => {
        setIsAddingCategory(false);
        reset();
      },
      onError: (err) => {
        console.error('Erro ao cadastrar categoria:', err);
      },
    });
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-700">Gerenciar Categorias</h2>
        <PrimaryButton onClick={() => setIsAddingCategory(!isAddingCategory)} className="flex items-center">
          {isAddingCategory ? (
            <>
              <XCircleIcon className="h-5 w-5 mr-1" /> Cancelar
            </>
          ) : (
            <>
              <PlusCircleIcon className="h-5 w-5 mr-1" /> Adicionar Categoria
            </>
          )}
        </PrimaryButton>
      </div>
      {isAddingCategory && (
        <form onSubmit={handleAddCategory} className="mt-4">
          <TextInput
            label="Nome da Categoria"
            id="name"
            name="name"
            value={data.name}
            onChange={(e) => setData('name', e.target.value)}
          />
          <select
            value={data.type}
            onChange={(e) => setData('type', e.target.value)}
            id="type"
            name="type"
            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="income">Receita</option>
            <option value="expense">Despesa</option>
          </select>
          <InputError message={errors.name} className="mt-2" />
          <InputError message={errors.type} className="mt-2" />
          <PrimaryButton type="submit" className="mt-2">Salvar</PrimaryButton>
        </form>
      )}
      <ul className="mt-4 divide-y divide-gray-200">
        {categories.map((category) => (
          <li key={category.id} className="py-2">
            <span className="font-semibold text-gray-700">{category.name}</span> -{' '}
            <span className="text-gray-500">{category.type}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoriesManager;
