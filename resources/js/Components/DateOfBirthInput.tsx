import React, { useState, useEffect } from 'react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

const DateOfBirthInput = ({ value, onChange, errors = {} }) => {
    const [age, setAge] = useState(null);

    // Função para calcular a idade com base na data de nascimento
    const calculateAge = (dob) => {
        const birthDate = new Date(dob);
        const today = new Date();
        let calculatedAge = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();

        // Ajuste para o caso em que o mês atual é anterior ao mês de nascimento ou o dia atual é anterior ao dia de nascimento
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            calculatedAge--;
        }

        return calculatedAge;
    };

    // Efeito para recalcular a idade sempre que a data de nascimento mudar
    useEffect(() => {
        if (value) {
            const calculatedAge = calculateAge(value);
            setAge(calculatedAge);
        } else {
            setAge(null); // Limpa a idade se não houver valor
        }
    }, [value]);

    return (
        <div className="w-full">
            <InputLabel htmlFor="data_nascimento" value="Data de Nascimento" />
            <TextInput
                id="data_nascimento"
                type="date"
                value={value}
                className="mt-1 block w-full"
                onChange={(e) => onChange(e.target.value)}
                required
            />
            <InputError message={errors.data_nascimento || ''} className="mt-2" />

            {age !== null && (
                <p className="mt-2 text-sm text-gray-600">
                    Idade: {age} anos
                </p>
            )}
        </div>
    );
};

export default DateOfBirthInput;
