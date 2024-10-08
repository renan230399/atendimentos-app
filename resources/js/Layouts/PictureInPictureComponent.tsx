import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const PictureInPictureComponent = ({ id, children, width, height, onClose, classPip='' }) => {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [dimensions, setDimensions] = useState({ width: width || '300px', height: height || '300px' });
  const componentRef = useRef(null);
  const startPosition = useRef({ offsetX: 0, offsetY: 0 });

  const minWidth = 200;
  const minHeight = 150;
  const maxWidth = window.innerWidth - 50;
  const maxHeight = window.innerHeight - 50;

  // Desativa a seleção de texto
  const disableTextSelection = () => {
    document.body.classList.add('no-select');
  };

  // Reativa a seleção de texto
  const enableTextSelection = () => {
    document.body.classList.remove('no-select');
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    disableTextSelection();

    startPosition.current = {
      offsetX: e.clientX - position.x,
      offsetY: e.clientY - position.y
    };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const newX = Math.max(0, Math.min(e.clientX - startPosition.current.offsetX, window.innerWidth - componentRef.current.offsetWidth));
    const newY = Math.max(0, Math.min(e.clientY - startPosition.current.offsetY, window.innerHeight - componentRef.current.offsetHeight));

    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    enableTextSelection();
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleResize = (e) => {
    disableTextSelection();
    const startWidth = componentRef.current.offsetWidth;
    const startHeight = componentRef.current.offsetHeight;
    const startX = e.clientX;
    const startY = e.clientY;

    const onMouseMove = (e) => {
      const newWidth = Math.max(minWidth, Math.min(startWidth + (e.clientX - startX), maxWidth));
      const newHeight = Math.max(minHeight, Math.min(startHeight + (e.clientY - startY), maxHeight));

      setDimensions({ width: `${newWidth}px`, height: `${newHeight}px` });
    };

    const onMouseUp = () => {
      enableTextSelection();
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  return (
    <div
      id={id}
      ref={componentRef}
      className="fixed z-50 bg-white border border-gray-300 rounded-lg shadow-lg"
      style={{
        width: dimensions.width,
        height: dimensions.height,
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      {/* Header com área de arraste */}
      <div
        className="flex justify-between items-center p-2 bg-gray-100 border-b border-gray-300 cursor-move"
        onMouseDown={handleMouseDown} // Área de arraste exclusiva para o header
      >
        <div className="font-bold">Editar Campo</div>
        <button onClick={onClose} className="text-red-500 hover:text-red-700 font-bold">✖</button>
      </div>

      {/* Conteúdo */}
      <div className="p-4 h-[calc(100%-40px)] overflow-y-auto">
        {children}
      </div>

      {/* Área de redimensionamento */}
      <div
        className="absolute w-4 h-4 bottom-0 right-0 cursor-se-resize bg-transparent"
        onMouseDown={handleResize}
      ></div>
    </div>
  );
};

PictureInPictureComponent.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  width: PropTypes.string,
  height: PropTypes.string,
  onClose: PropTypes.func.isRequired,
};

export default PictureInPictureComponent;
