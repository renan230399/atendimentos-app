import React, { useRef, useEffect, useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { IoIosClose } from 'react-icons/io';
import ModalBackground from '@/Components/ModalBackground';

const PopupComponent = ({ id, width = '98vw', height = '98vh', zindex = '100', params = {}, children, onClose }) => {
    const [visible, setVisible] = useState(false);
    const contentRef = useRef(null);

    useEffect(() => {
        // Adiciona a classe 'modal-open' para travar o scroll
        document.body.classList.add('modal-open');
        document.body.style.overflow = 'hidden'; // Travar o scroll

        const popupContent = contentRef.current;

        if (popupContent && typeof params.clientX === 'number' && typeof params.clientY === 'number') {
            const popupWidth = popupContent.offsetWidth;
            const popupHeight = popupContent.offsetHeight;

            const transformOriginX = ((params.clientX - window.innerWidth / 2) / popupWidth + 0.5) * 100;
            const transformOriginY = ((params.clientY - window.innerHeight / 2) / popupHeight + 0.5) * 100;

            popupContent.style.transformOrigin = `${transformOriginX}% ${transformOriginY}%`;
        }

        setTimeout(() => setVisible(true), 10);

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            // Remove a classe e o overflow quando o popup é fechado
            document.body.classList.remove('modal-open');
            document.body.style.overflow = ''; // Restaurar o comportamento padrão do scroll
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [params]);

    const handleClose = useCallback(() => {
        setVisible(false);
        setTimeout(() => {
            onClose(id);
        }, 300);
    }, [id, onClose]);

    return ReactDOM.createPortal(
        <div>
            <ModalBackground
                id_fundo_modal={`modal_background_${id}`}
                visible={true}
                sobreposicao={zindex - 1} // Certifique-se de que o z-index seja menor que o popup
                onClick={handleClose}
            />

            <div
                ref={contentRef}
                id={`id_div_conteudo_${id}`}
                role="dialog"
                aria-labelledby={`popup_${id}_label`}
                aria-modal="true"
                className={`${visible ? 'open' : ''}`}
                style={{
                    width, // Aqui a width será corretamente aplicada
                    height,
                    backgroundColor: 'white',
                    paddingTop: params.paddingTop || '0px',
                    paddingBottom: params.paddingBottom || '0px',
                    paddingRight: params.paddingRight || '0px',
                    paddingLeft: params.paddingLeft || '0px',
                    overflow: params.overflow || 'auto',
                    borderRadius: params.borderRadius || '10px',
                    boxShadow: params.boxShadow || '0px 4px 15px rgba(0, 0, 0, 0.2)',
                    textAlign: 'center',
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: `translate(-50%, -50%) scale(${visible ? 1 : 0.5})`,
                    opacity: visible ? 1 : 0,
                    transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
                    zIndex: zindex, // Z-index maior que o fundo
                }}
            >
                <button
                    onClick={handleClose}
                    aria-label="Fechar popup"
                    className="fixed z-[1001] top-2 right-2 cursor-pointer bg-transparent border-none"
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
