import React from 'react';
import Dinero from 'dinero.js';

interface PriceInputProps {
    value: string;
    onChange: (value: string) => void;
    label: string;
    id: string;
    error?: string;
    required?: boolean;
    readOnly?: boolean;
}

const PriceInput: React.FC<PriceInputProps> = ({ value, onChange, label='', id, error, required, readOnly=false }) => {
    // Função para formatar o preço no padrão brasileiro
    const formatPrice = (value: string) => {
        const amountInCents = parseInt(value || '0');
        const price = Dinero({ amount: amountInCents, currency: 'BRL' });

        // Formata para padrão brasileiro: separador de milhar é ponto (.) e decimal é vírgula (,)
        return price.toFormat('$0,0.00')
            .replace(/\./g, '#') // Temporariamente substitui pontos por um caractere temporário
            .replace(/,/g, '.')  // Substitui vírgula por ponto (para milhar)
            .replace(/#/g, ','); // Finalmente, substitui o caractere temporário por vírgula para os decimais
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Remove qualquer caractere não numérico
        const newValue = e.target.value.replace(/\D/g, '');

        // Atualiza o valor em centavos
        onChange(newValue);
    };

    return (
        <div>
            <label htmlFor={id} className="text-lg font-medium">{label}</label>
            <input
                id={id}
                type="text"
                value={formatPrice(value)} // Formata o valor de entrada
                onChange={handlePriceChange}
                required={required}
                readOnly={readOnly}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="R$ 0,00"
            />
            {error && <p className="mt-2 text-red-500">{error}</p>}
        </div>
    );
};

export default PriceInput;
