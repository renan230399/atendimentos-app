import React from 'react';

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
    width = 'w-[6vw]', 
    text = '' 
}) => {
    return (
        <div
            className={`flex text-center bg-gradient-to-r ${bgColorFrom} ${bgColorTo} ${width} right-0 cursor-pointer mt-6 p-3 shadow-lg rounded-l-md transform transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:${hoverBgColorFrom} hover:${hoverBgColorTo}`}
            title={title}
            onClick={onClick}
        >
            {icon}
            <b className='text-white my-auto ml-2'>{text}</b>
        </div>
    );
};

export default IconButton;
