import React from 'react';
import Dinero from 'dinero.js';

interface PriceInputProps {
    value: string;
    onChange: (value: string) => void;
    label: string;
    id: string;
    error?: string;
    required?: boolean;
}
interface Account {
    id: number;
    name: string;
  }
const PriceInput: React.FC<PriceInputProps> = ({ value, onChange, label, id, error, required }) => {
    const formatPrice = (value: string) => {
        const price = Dinero({ amount: parseInt(value || '0'), currency: 'BRL' });
        return price.toFormat('$0,0.00'); // Formata em R$
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value.replace(/\D/g, ''); // Remove caracteres não numéricos
        onChange(newValue); // Atualiza o valor no estado em centavos
    };

    return (
        <div>
            <label htmlFor={id} className="text-lg font-medium">{label}</label>
            <input
                id={id}
                type="text"
                value={formatPrice(value)}
                onChange={handlePriceChange}
                required={required}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="R$ 0,00"
            />
            {error && <p className="mt-2 text-red-500">{error}</p>}
        </div>
    );
};

export default PriceInput;
