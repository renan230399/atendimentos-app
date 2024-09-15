import React, { useState } from 'react';
import MaskedInput from 'react-text-mask';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';

const TelefoneInput = ({label, value, onChange, errors = {} }) => {
    const [isNineDigit, setIsNineDigit] = useState(false);

    const handlePhoneChange = (e) => {
        const inputValue = e.target.value.replace(/\D/g, ''); // Remove caracteres não numéricos

        // Verifica se o número tem 9 dígitos no bloco inicial (telefone celular no Brasil)
        setIsNineDigit(inputValue.length >= 11);

        onChange(e); // Atualiza o valor no componente pai
    };

    const phoneMask = (rawValue) => {
        const cleanedValue = rawValue.replace(/\D/g, ''); // Limpa caracteres não numéricos

        if (cleanedValue.length > 10) {
            return ['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]; // Nove dígitos
        }

        return ['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]; // Oito dígitos
    };

    return (
        <div>
            <MaskedInput
                mask={phoneMask}
                value={value}
                onChange={handlePhoneChange}
                className="mt-1 block w-full"
                placeholder="(XX) XXXXX-XXXX ou (XX) XXXX-XXXX"
                guide={false} // Não exibe os caracteres de máscara vazios
            />
            <InputError message={errors.telefone || ''} className="mt-2" />
        </div>
    );
};

export default TelefoneInput;
