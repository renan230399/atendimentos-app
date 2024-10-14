import React from 'react';

interface IconButtonProps {
    icon: React.ReactNode;
    title: string;
    onClick: () => void;
    bgColorFrom?: string;
    bgColorTo?: string;
    width?: string;
    text?: string;
}

const IconButton: React.FC<IconButtonProps> = ({ 
    icon, 
    title, 
    onClick, 
    bgColorFrom = 'from-blue-500', 
    bgColorTo = 'to-blue-700', 
    width = 'w-[6vw]', 
    text = '' 
}) => {
    return (
        <div
            className={`hover:bg-gradient-to-r hover:from-blue-600 flex hover:to-blue-800 text-center bg-gradient-to-r ${bgColorFrom} ${bgColorTo} ${width} right-0 cursor-pointer mt-6 p-3 shadow-lg rounded-l-md transform transition-all duration-300 ease-in-out hover:scale-105`}
            title={title}
            onClick={onClick}
        >
            {icon}
            <b className='text-white my-auto ml-2'>{text}</b>
        </div>
    );
};

export default IconButton;
