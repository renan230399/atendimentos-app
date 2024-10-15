import React, { useState, useEffect } from 'react';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

interface DateOfBirthInputProps {
    value?: string;
    onChange: (date: string) => void;
    errors?: Record<string, string>;
    id: string;
}

const DateOfBirthInput: React.FC<DateOfBirthInputProps> = ({ value = '', onChange, errors = {}, id }) => {
    const [localValue, setLocalValue] = useState<string>('');
    const [age, setAge] = useState<number | null>(null);

    const calculateAge = (dob: string): number => {
        const birthDate = new Date(dob);
        const today = new Date();
        let calculatedAge = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();

        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            calculatedAge--;
        }

        return calculatedAge;
    };

    const formatDate = (isoDate: string): string => {
        if (!isoDate) return '';
        const date = new Date(isoDate);
        const year = date.getFullYear();
        const month = `0${date.getMonth() + 1}`.slice(-2);
        const day = `0${date.getDate()}`.slice(-2);
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        if (value) {
            const formattedDate = formatDate(value);
            setLocalValue(formattedDate);
            const calculatedAge = calculateAge(formattedDate);
            setAge(calculatedAge);
        } else {
            setLocalValue('');
        }
    }, [value]);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = e.target.value;
        setLocalValue(newDate);
        const calculatedAge = calculateAge(newDate);
        setAge(calculatedAge);
    };

    const handleBlur = () => {
        onChange(localValue); // Envia o valor somente ao sair do campo
    };

    return (
        <div className="w-full">
            <InputLabel htmlFor={id} value="Data de Nascimento" />
            <input 
                id={id}
                type="date"
                value={localValue}
                className="mt-1 block w-full"
                onChange={handleDateChange}
                onBlur={handleBlur} // Só envia o valor ao sair do campo
            />

            <InputError message={errors?.[id] || ''} className="mt-2" />

            {age !== null && (
                <p className="mt-2 text-sm text-gray-600">
                    Idade: {age} anos
                </p>
            )}
        </div>
    );
};

export default DateOfBirthInput;
