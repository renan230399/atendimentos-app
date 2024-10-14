import React from 'react';
import { FaFileWaveform } from "react-icons/fa6";

interface PopupHeaderProps {
    icon?: string | null;
    title: string;
    bgColor?: string;
}

const PopupHeader: React.FC<PopupHeaderProps> = ({ icon = null, title, bgColor = 'bg-blue-400' }) => {
    return (
        <div className={`${bgColor} absolute top-0 left-0 rounded-b-lg shadow-xl flex flex-col w-[90%]`}>
            {/* Ícone */}
            {icon && (
                <div className="w-32 h-32 absolute mt-0 pt-0 overflow-hidden text-left">
                    <img 
                        src={icon} 
                        alt="Ícone" 
                        className="w-full h-full"
                    />
                </div>
            )}

            {/* Título */}
            <h2 className="text-white font-mono p-2 text-2xl md:text-3xl">
                {title}
            </h2>
        </div>
    );
};

export default PopupHeader;
