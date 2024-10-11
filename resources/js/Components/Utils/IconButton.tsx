import React from 'react';

interface IconButtonProps {
    icon: React.ReactNode;
    title: string;
    onClick: () => void;
    bgColorFrom?: string;
    bgColorTo?: string;
}

const IconButton: React.FC<IconButtonProps> = ({ icon, title, onClick, bgColorFrom = 'from-blue-500', bgColorTo = 'to-blue-700' }) => {
    return (
        <div
            className={`hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-800 text-center bg-gradient-to-r ${bgColorFrom} ${bgColorTo} right-0 w-[6vw] cursor-pointer mt-6 p-3 shadow-lg rounded-l-md transform transition-all duration-300 ease-in-out hover:scale-105`}
            title={title}
            onClick={onClick}
        >
            {icon}
        </div>
    );
};

export default IconButton;
