import React, { useState } from 'react';

interface IconButtonProps {
    icon: React.ReactNode;
    title: string;
    onClick: () => void;
    bgColorFrom?: string;
    bgColorTo?: string;
    hoverBgColorFrom?: string; // Nova propriedade para a cor de fundo no hover
    hoverBgColorTo?: string; // Nova propriedade para a cor de fundo no hover
    width?: string;
    text?: string;
}

const IconButton: React.FC<IconButtonProps> = ({
    icon,
    title,
    onClick,
    bgColorFrom = 'from-blue-500',
    bgColorTo = 'to-blue-700',
    hoverBgColorFrom = 'from-blue-600', // Cor padrão para hover
    hoverBgColorTo = 'to-blue-800', // Cor padrão para hover
    width = 'w-[70vw]',
    text = 'Cadastrar paciente',
}) => {
    const [isHovered, setIsHovered] = useState(false); // Estado para controlar o hover

    return (
        <div
            className={`flex items-center bg-gradient-to-r ${bgColorFrom} ${bgColorTo} ${width} right-0 cursor-pointer mt-6 p-3 shadow-lg rounded-l-md transform transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:${hoverBgColorFrom} hover:${hoverBgColorTo}
            ${
                isHovered ? '-translate-x-36' : 'translate-x-[-12]' // Controla o deslizamento do texto
            }
            `}
            title={title}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div
                className={`flex items-center transition-transform duration-300 ease-in-out`}
            >
                {icon}
                <b className={`text-white ml-2 ${isHovered ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 ease-in-out`}>
                    {text}
                </b>
            </div>
        </div>
    );
};

export default IconButton;
