import React from 'react';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

interface TransactionSelectProps {
  id: string;
  label: string;
  value: string | number;
  options: { id: number; name: string; type?: string }[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
}

const TransactionSelect: React.FC<TransactionSelectProps> = ({ id, label, value, options, onChange, error }) => {
  return (
    <div>
      <InputLabel htmlFor={id} value={label} />
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="block w-full border-gray-300 rounded-md shadow-sm text-lg focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="">Selecione uma opção</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name} {option.type ? `- ${option.type === 'income' ? 'Receitas' : 'Despesas'}` : ''}
          </option>
        ))}
      </select>
      {error && <InputError message={error} className="mt-2" />}
    </div>
  );
};

export default TransactionSelect;
