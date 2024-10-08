import React, { useState, useEffect } from 'react';

const DraggableBodySelector = ({ imageSrc, label, onPositionChange, initialPosition, initialSize, id }) => {
    const [circlePosition, setCirclePosition] = useState({ x: null, y: null });
    const [isDragging, setIsDragging] = useState(false);
    const [hoverPosition, setHoverPosition] = useState({ x: null, y: null }); // Para o círculo de pré-visualização
    const [circleSize, setCircleSize] = useState(initialSize || 5); // Tamanho ajustável do círculo (em porcentagem)
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

    // Captura a posição do clique e posiciona o círculo
    const handleImageClick = (e) => {
        const rect = e.target.getBoundingClientRect(); // Pega a dimensão da imagem
        const x = e.clientX - rect.left; // Posição X relativa ao clique
        const y = e.clientY - rect.top;  // Posição Y relativa ao clique

        const relativeX = (x / rect.width) * 100; // Posição X relativa (%)
        const relativeY = (y / rect.height) * 100; // Posição Y relativa (%)

        setCirclePosition({ x: relativeX, y: relativeY }); // Armazena como porcentagem
        if (onPositionChange) onPositionChange({ x: relativeX, y: relativeY, size: circleSize }); // Chama callback para armazenar a posição e o tamanho relativo
    };

    // Inicia o arraste
    const handleMouseDown = () => setIsDragging(true);

    // Finaliza o arraste
    const handleMouseUp = () => setIsDragging(false);
 // Desativa a seleção de texto
 const disableTextSelection = () => {
    document.body.classList.add('no-select');
  };
    // Move o círculo enquanto o mouse estiver pressionado
    const handleMouseMove = (e) => {
        disableTextSelection();
        if (!isDragging) return;
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const relativeX = (x / rect.width) * 100;
        const relativeY = (y / rect.height) * 100;
        setCirclePosition({ x: relativeX, y: relativeY });
        if (onPositionChange) onPositionChange({ x: relativeX, y: relativeY, size: circleSize });
    };

    // Controla a posição do círculo de pré-visualização
    const handleMouseOverImage = (e) => {
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setHoverPosition({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 }); // Armazena como porcentagem
    };

    // Limpa a pré-visualização quando o mouse sai da imagem
    const handleMouseLeaveImage = () => {
        setHoverPosition({ x: null, y: null });
    };

    // Calcula as dimensões da imagem quando carregada
    const handleImageLoad = (e) => {
        const { width, height } = e.target.getBoundingClientRect();
        setImageDimensions({ width, height });

        // Se houver uma posição inicial e um tamanho inicial, ajusta-os para a imagem atual
        if (initialPosition && initialSize) {
            const absoluteX = (initialPosition.x / 100) * width;
            const absoluteY = (initialPosition.y / 100) * height;
            setCirclePosition({ x: absoluteX, y: absoluteY });
            setCircleSize(initialSize); // Tamanho inicial já vem como porcentagem
        }
    };

    return (
        <div>
            {/* Label opcional para descrever o campo */}
            {label && <label className="block mb-2 text-gray-700">{label}</label>}

            {/* Barra de controle para ajustar o tamanho do círculo */}
            <div className="mb-4">
                <label className="block text-gray-700">Tamanho do círculo: {circleSize}%</label>
                <input
                    type="range"
                    min="1"
                    max="30"
                    value={circleSize}
                    onChange={(e) => setCircleSize(parseFloat(e.target.value))}
                    className="w-full"
                />
            </div>

            <div
                className="relative"
                onMouseMove={handleMouseMove} // Verifica se o círculo está sendo arrastado
                onMouseUp={handleMouseUp}     // Finaliza o arraste quando o mouse é solto
            >
                {/* Imagem do corpo humano ou outra imagem passada por props */}
                <img 
                    src={imageSrc} 
                    alt="Imagem do Corpo Humano"
                    className="w-full"
                    onClick={handleImageClick} // Posiciona o círculo ao clicar
                    onMouseMove={handleMouseOverImage} // Mostra o círculo de pré-visualização
                    onMouseLeave={handleMouseLeaveImage} // Remove a pré-visualização quando o mouse sai
                    onLoad={handleImageLoad} // Pega as dimensões da imagem
                    style={{ maxWidth: '600px', cursor: 'pointer' }} // Tamanho ajustável
                />

                {/* Círculo de pré-visualização (cinza) */}
                {hoverPosition.x && hoverPosition.y && (
                    <div
                        style={{
                            position: 'absolute',
                            top: `${hoverPosition.y}%`,   // Usa porcentagem para manter a relação
                            left: `${hoverPosition.x}%`,  // Usa porcentagem para manter a relação
                            width: `${circleSize}%`,      // Tamanho proporcional em porcentagem da largura da imagem
                            height: `${circleSize}%`,
                            backgroundColor: 'rgba(128, 128, 128, 0.5)', // Círculo cinza translúcido
                            borderRadius: '50%',
                            pointerEvents: 'none',
                            transform: 'translate(-50%, -50%)' // Centraliza o círculo
                        }}
                    />
                )}

                {/* Círculo posicionado no clique (vermelho) */}
                {circlePosition.x && circlePosition.y && (
                    <div
                        style={{
                            position: 'absolute',
                            top: `${circlePosition.y}%`,   // Usa porcentagem para manter a relação
                            left: `${circlePosition.x}%`,  // Usa porcentagem para manter a relação
                            width: `${circleSize}%`,       // Tamanho proporcional em porcentagem da largura da imagem
                            height: `${circleSize}%`,
                            backgroundColor: 'rgba(255, 0, 0, 0.6)', // Círculo vermelho translúcido
                            borderRadius: '50%',
                            cursor: 'move',
                            transform: 'translate(-50%, -50%)' // Centraliza o círculo
                        }}
                        onMouseDown={handleMouseDown} // Inicia o arraste quando o usuário clica no círculo
                    />
                )}
            </div>
        </div>
    );
};

export default DraggableBodySelector;
