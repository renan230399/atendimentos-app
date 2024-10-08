import React from 'react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';

interface TransactionInputProps {
  id: string;
  label: string;
  type: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TransactionInput: React.FC<TransactionInputProps> = ({ id, label, type, value, onChange }) => {
  return (
    <div>
      <InputLabel htmlFor={id} value={label} />
      <TextInput
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
};

export default TransactionInput;
