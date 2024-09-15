import React, { useState } from 'react';

// Opção de componente com ícone e valor
const CustomOption = ({ icon, label, onSelect }) => (
    <div className="custom-select-option flex items-center p-2 cursor-pointer hover:bg-gray-100" onClick={onSelect}>
        <span className="mr-2">{icon}</span>
        <span>{label}</span>
    </div>
);

const CustomSelect = ({ options, onChange, placeholder = 'Selecione uma opção' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
        setIsOpen(false);
        if (option && option.value) {
            onChange(option.value); // Verifica se o valor existe antes de chamar onChange
        }
    };

    return (
        <div className="custom-select-component relative w-64">
            <div
                className="custom-select-box border border-gray-300 p-2 flex items-center justify-between cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                {selectedOption ? (
                    <span className="flex items-center">
                        <span className="mr-2">{selectedOption.icon}</span>
                        {selectedOption.label}
                    </span>
                ) : (
                    <span className="text-gray-400">{placeholder}</span>
                )}
                <span className="caret">&#9662;</span>
            </div>
            {isOpen && (
                <div className="custom-options-container absolute w-full border border-gray-300 bg-white shadow-md mt-1">
                    {options.map((option) => (
                        <CustomOption
                            key={option.value}
                            icon={option.icon}
                            label={option.label}
                            onSelect={() => handleOptionSelect(option)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomSelect;
