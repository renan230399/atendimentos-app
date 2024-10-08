import React from 'react';
import { FaFileWaveform } from "react-icons/fa6";

const PopupHeader = ({ icone, titulo, bgColor='bg-blue-400' }) => {
    return (
        <div className={`${bgColor} absolute rounded-b-lg shadow-xl flex flex-col w-[90%]`}>
            {/* Ícone */}
            {icone && (
                <div className="w-32 h-32 absolute mt-0 pt-0 overflow-hidden  text-left">
                    <img 
                        src={icone} 
                        alt="Ícone" 
                        className="w-full h-full"
                    />
                     </div>
            )}

            {/* Título */}
            <h2 className="text-white font-mono p-2 text-2xl md:text-3xl">
                {titulo}
            </h2>
        </div>
    );
};

export default PopupHeader;
