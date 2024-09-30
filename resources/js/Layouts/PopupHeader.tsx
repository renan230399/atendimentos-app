import React from 'react';

const CabecalhoPopup = ({ icone, titulo }) => {
    return (
        <div className="bg-blue-600 p-4 rounded-b-lg shadow-lg flex flex-col items-center w-[90%]">
            {/* Ícone */}
            {icone && (
                <div className="w-20 h-20 md:w-24 md:h-24 mb-2">
                    <img 
                        src={icone} 
                        alt="Ícone" 
                        className="w-full h-full object-cover rounded-full shadow-md" 
                    />
                </div>
            )}

            {/* Título */}
            <h2 className="text-white text-xl md:text-2xl font-semibold">
                {titulo}
            </h2>
        </div>
    );
};

export default CabecalhoPopup;
