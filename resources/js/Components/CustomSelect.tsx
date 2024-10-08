import React, { useState, useEffect } from 'react';

// Opção de componente com ícone e valor
const CustomOption = ({ icon, label, onSelect }) => (
    <div className="custom-select-option flex items-center p-2 cursor-pointer hover:bg-gray-100" onClick={onSelect}>
        <span className="mr-2">{icon}</span>
        <span>{label}</span>
    </div>
);

const CustomSelect = ({ options, onChange, placeholder = 'Selecione uma opção', value }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);

    // Atualiza a opção selecionada sempre que o valor externo mudar
    useEffect(() => {
        const selected = options.find(option => option.value === value);
        setSelectedOption(selected);
    }, [value, options]);

    // Fecha o dropdown ao clicar fora dele
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isOpen && !event.target.closest('.custom-select-component')) {
                setIsOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isOpen]);

    const handleOptionSelect = (option) => {
        setSelectedOption(option); // Atualiza a opção selecionada
        setIsOpen(false); // Fecha o dropdown
        onChange(option.value); // Emite o valor selecionado para o pai
    };

    return (
        <>
            {/* Fundo modal semitransparente que fecha o dropdown ao clicar fora */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-35 cursor-pointer"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}
            <div className="custom-select-component relative w-64 m-auto z-50">
                <div
                    className="custom-select-box border border-gray-300 p-2 flex items-center justify-between cursor-pointer bg-white"
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
                    <div className="custom-options-container absolute w-full border border-gray-300 bg-white shadow-md mt-1 z-50">
                        {options.map((option) => (
                            <CustomOption
                                key={option.value}
                                icon={option.icon}
                                label={option.label}
                                onSelect={() => handleOptionSelect(option)} // Atualiza a seleção corretamente
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default CustomSelect;
