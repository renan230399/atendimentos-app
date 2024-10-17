import React, { useEffect, useState } from 'react';

const SplashScreen: React.FC = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [isFading, setIsFading] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsFading(true);
            const fadeTimeout = setTimeout(() => {
                setIsVisible(false);
            }, 1500);
            return () => clearTimeout(fadeTimeout);
        }, 1500);

        return () => clearTimeout(timeout);
    }, []);

    return (
        <>
            {isVisible && (
                <div
                    className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-1000 ease-out ${isFading ? 'opacity-0' : 'opacity-100'}`}
                >
                    {/* Background moderno com gradiente */}
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-300 to-gray-500"></div>

                    <div className="relative z-10 text-center">
                        {/* Animação do logo */}
                        <img
                            src="https://keyar-atendimentos.s3.amazonaws.com/logos_empresas/logo_keyar.svg"
                            alt="Loading"
                            className="w-48 h-48 animate-bounce transition-transform duration-1000 ease-in-out transform hover:scale-110"
                        />

                        {/* Texto de carregamento */}
                        <p className="mt-4 text-lg text-white font-semibold animate-pulse">Carregando...</p>
                    </div>
                </div>
            )}
        </>
    );
};

export default SplashScreen;
