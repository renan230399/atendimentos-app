import React from 'react';
import { Dropdown } from 'primereact/dropdown';
import InputError from '@/Components/InputError';
import InputLabel from './InputLabel';
interface InputStatusProps {
    value: boolean | null;
    onChange: (value: true | false) => void;
    label: string;
    id: string;
    placeholder?: string;
    error?: string;
}

const InputStatus: React.FC<InputStatusProps> = ({
    value,
    onChange,
    label,
    id,
    placeholder = 'Selecione o status',
    error,
}) => {
    // Opções pré-definidas com ícones para o status
    const statusOptions = [
        { value: true, label: 'Ativo', icon: <i className="pi pi-check-circle text-green-500" /> },
        { value: false, label: 'Inativo', icon: <i className="pi pi-times-circle text-red-500" /> },
    ];

    // Função para renderizar as opções do Dropdown, incluindo ícones
    const optionTemplate = (option: { label: string; icon?: React.ReactNode }) => {
        return (
            <div className="flex items-center">
                {option.icon}
                <span className="ml-2">{option.label}</span>
            </div>
        );
    };

    // Função para renderizar o valor selecionado, incluindo o ícone
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
            <InputLabel htmlFor={id} className="text-lg font-medium">
                {label}
            </InputLabel>
            <Dropdown
                id={id}
                value={value}
                onChange={(e) => onChange(e.value)}
                options={statusOptions}
                optionLabel="label"
                placeholder={placeholder}
                valueTemplate={selectedTemplate}
                itemTemplate={optionTemplate}
                className="w-full border rounded border-gray-600"
            />
            {error && <InputError message={error} className="mt-2" />}
        </div>
    );
};

export default InputStatus;
