import React, { useRef, useEffect, useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { IoIosClose } from 'react-icons/io';
import ModalBackground from '@/Components/ModalBackground';

const PopupComponent = ({ id, params = {}, children, onClose }) => {
    const [visible, setVisible] = useState(false);
    const contentRef = useRef(null);

    useEffect(() => {
        document.body.classList.add('modal-open');

        const popupContent = contentRef.current;
        
        // Defina a origem da transformação com base na posição do clique, se disponível
        if (popupContent && typeof params.clientX === 'number' && typeof params.clientY === 'number') {
            const popupWidth = popupContent.offsetWidth;
            const popupHeight = popupContent.offsetHeight;

            const transformOriginX = ((params.clientX - window.innerWidth / 2) / popupWidth + 0.5) * 100;
            const transformOriginY = ((params.clientY - window.innerHeight / 2) / popupHeight + 0.5) * 100;

            popupContent.style.transformOrigin = `${transformOriginX}% ${transformOriginY}%`;
        }

        // Exibe o popup com animação
        setTimeout(() => setVisible(true), 10);

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };
        
        // Adiciona evento de teclado para fechar o modal com "Escape"
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.classList.remove('modal-open');
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [params]);

    const handleClose = useCallback(() => {
        setVisible(false); // Inicia a animação de fechamento
        setTimeout(() => {
            onClose(id);
        }, 300); // Aguarda a animação terminar antes de fechar completamente
    }, [id, onClose]);

    return ReactDOM.createPortal(
        <div>
            <ModalBackground
                id_fundo_modal={`modal_background_${id}`}
                visible={true}
                sobreposicao={90}
                onClick={handleClose}
            />
            
            <div
                ref={contentRef}
                id={`id_div_conteudo_${id}`}
                role="dialog"
                aria-labelledby={`popup_${id}_label`}
                aria-modal="true"
                className={`conteudo_materiais_cursos ${visible ? 'open' : ''}`}
                style={{
                    paddingTop: params.paddingTop || '0px',
                    paddingBottom: params.paddingBottom || '200px',
                    paddingRight: params.paddingRight || '0px',
                    paddingLeft: params.paddingLeft || '0px',
                    overflow: params.overflow || 'auto',
                    textAlign: 'center',
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: `translate(-50%, -50%) scale(${visible ? 1 : 0.5})`,
                    opacity: visible ? 1 : 0,
                    transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
                    zIndex: isNaN(Number(id)) ? 101 : 101 + Number(id),
                }}
            >
            <button 
    onClick={handleClose} 
    aria-label="Fechar popup"
    className="fixed z-100 top-2 right-2 cursor-pointer bg-transparent border-none"
>
    <IoIosClose size={24} />
</button>

              

                   

                {children}
            </div>
        </div>,
        document.body
    );
};

export default PopupComponent;
