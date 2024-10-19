import React from 'react';
import { Dropdown } from 'primereact/dropdown';
import InputError from '@/Components/InputError';

interface CustomDropdownProps {
    value: number | string | boolean;
    onChange: (value: any) => void;
    options: Array<{ value: any; label: string; icon?: React.ReactNode }>;
    label?: string | null | undefined;
    id: string;
    placeholder?: string;
    error?: string;
    optionLabel?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
    value,
    onChange,
    options,
    label = '',
    id,
    placeholder = 'Selecione uma opção',
    error,
    optionLabel = 'label',
}) => {
    const optionTemplate = (option: { label: string; icon?: React.ReactNode }) => (
        <div className="flex items-center">
            {option.icon}
            <span className="ml-2">{option.label}</span>
        </div>
    );

    const selectedTemplate = (option: { label: string; icon?: React.ReactNode }) => {
        if (option) {
            return (
                <div className="flex items-center">
                    {option.icon}
                    <span className="ml-2">{option.label}</span>
                </div>
            );
        }
        return <span>{placeholder}</span>;
    };

    return (
        <div>
            <label htmlFor={id} className="text-lg font-medium">
                {label && label}
            </label>
            <Dropdown
                id={id}
                value={value}
                onChange={(e) => onChange(e.value)} // Isso só retorna o valor selecionado
                options={options}
                optionLabel={optionLabel}
                placeholder={placeholder}
                valueTemplate={selectedTemplate}
                itemTemplate={optionTemplate}
                className="w-full border rounded border-gray-600"
            />
            {error && <InputError message={error} className="mt-2" />}
        </div>
    );
};
export default CustomDropdown;
