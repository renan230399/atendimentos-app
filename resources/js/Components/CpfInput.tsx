import React, { useState } from 'react';
import MaskedInput from 'react-text-mask';
import InputLabel from '@/Components/InputLabel';  // Certifique-se de importar o InputLabel corretamente
import InputError from '@/Components/InputError';  // Certifique-se de importar o InputError corretamente

// Validação simples de CPF
const validateCPF = (cpf: string): boolean => {
    cpf = cpf.replace(/[^\d]+/g, ''); // Remove caracteres não numéricos
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;

    return true;
};

const cpfMask = [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/];

interface CpfInputProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    errors?: string | null;
}

const CpfInput: React.FC<CpfInputProps> = ({ value, onChange, errors }) => {
    const [cpfError, setCpfError] = useState<string | null>(null);

    const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const cpf = e.target.value;
        onChange(e); // Propaga a mudança para o componente pai

        // Valida o CPF e define uma mensagem de erro
        if (!validateCPF(cpf)) {
            setCpfError('CPF inválido');
        } else {
            setCpfError(null);
        }
    };

    return (
            <div>
            <InputLabel htmlFor="cpf" value="CPF" />
            <MaskedInput
                mask={cpfMask}
                value={value}
                onChange={handleCpfChange}
                className={`mt-1 block w-full border-gray-300 rounded-md ${cpfError || errors ? 'border-red-500' : ''}`}
                placeholder="000.000.000-00"
            />
            <InputError message={cpfError || errors ? (cpfError || errors) as string : undefined} className="mt-2" />
            </div>

    );
};

export default CpfInput;
