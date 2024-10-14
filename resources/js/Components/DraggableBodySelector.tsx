import React, { useState, useEffect } from 'react';

interface Position {
    x: number | null;
    y: number | null;
}

interface DraggableBodySelectorProps {
    imageSrc: string;
    label?: string;
    onPositionChange?: (position: { x: number; y: number; size: number }) => void;
    initialPosition?: { x: number; y: number };
    initialSize?: number;
    id: string;
}

const DraggableBodySelector: React.FC<DraggableBodySelectorProps> = ({ 
    imageSrc, 
    label, 
    onPositionChange, 
    initialPosition, 
    initialSize = 5, 
    id 
}) => {
    const [circlePosition, setCirclePosition] = useState<Position>({ x: null, y: null });
    const [isDragging, setIsDragging] = useState(false);
    const [hoverPosition, setHoverPosition] = useState<Position>({ x: null, y: null });
    const [circleSize, setCircleSize] = useState<number>(initialSize);
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

    const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
        const rect = (e.target as HTMLImageElement).getBoundingClientRect(); // Cast para HTMLImageElement
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
    
        const relativeX = (x / rect.width) * 100;
        const relativeY = (y / rect.height) * 100;
    
        setCirclePosition({ x: relativeX, y: relativeY });
        if (onPositionChange) onPositionChange({ x: relativeX, y: relativeY, size: circleSize });
    };
    

    const handleMouseDown = () => setIsDragging(true);
    const handleMouseUp = () => setIsDragging(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (!isDragging) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const relativeX = (x / rect.width) * 100;
        const relativeY = (y / rect.height) * 100;

        setCirclePosition({ x: relativeX, y: relativeY });
        if (onPositionChange) onPositionChange({ x: relativeX, y: relativeY, size: circleSize });
    };

    const handleMouseOverImage = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
        const rect = (e.target as HTMLImageElement).getBoundingClientRect(); // Cast para HTMLImageElement
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
    
        setHoverPosition({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
    };
    

    const handleMouseLeaveImage = () => {
        setHoverPosition({ x: null, y: null });
    };

    const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const { width, height } = e.currentTarget.getBoundingClientRect();
        setImageDimensions({ width, height });

        if (initialPosition && initialSize) {
            const absoluteX = (initialPosition.x / 100) * width;
            const absoluteY = (initialPosition.y / 100) * height;
            setCirclePosition({ x: absoluteX, y: absoluteY });
            setCircleSize(initialSize);
        }
    };

    return (
        <div>
            {label && <label className="block mb-2 text-gray-700">{label}</label>}

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
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
            >
                <img 
                    src={imageSrc} 
                    alt="Imagem do Corpo Humano"
                    className="w-full"
                    onClick={handleImageClick}
                    onMouseMove={handleMouseOverImage}
                    onMouseLeave={handleMouseLeaveImage}
                    onLoad={handleImageLoad}
                    style={{ maxWidth: '600px', cursor: 'pointer' }}
                />

                {hoverPosition.x !== null && hoverPosition.y !== null && (
                    <div
                        style={{
                            position: 'absolute',
                            top: `${hoverPosition.y}%`,
                            left: `${hoverPosition.x}%`,
                            width: `${circleSize}%`,
                            height: `${circleSize}%`,
                            backgroundColor: 'rgba(128, 128, 128, 0.5)',
                            borderRadius: '50%',
                            pointerEvents: 'none',
                            transform: 'translate(-50%, -50%)'
                        }}
                    />
                )}

                {circlePosition.x !== null && circlePosition.y !== null && (
                    <div
                        style={{
                            position: 'absolute',
                            top: `${circlePosition.y}%`,
                            left: `${circlePosition.x}%`,
                            width: `${circleSize}%`,
                            height: `${circleSize}%`,
                            backgroundColor: 'rgba(255, 0, 0, 0.6)',
                            borderRadius: '50%',
                            cursor: 'move',
                            transform: 'translate(-50%, -50%)'
                        }}
                        onMouseDown={handleMouseDown}
                    />
                )}
            </div>
        </div>
    );
};

export default DraggableBodySelector;
