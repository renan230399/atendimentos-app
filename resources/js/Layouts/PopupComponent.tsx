import React, { useRef, useEffect, useState, useCallback, ReactNode } from 'react';
import ReactDOM from 'react-dom';
import { IoIosClose } from 'react-icons/io';
import ModalBackground from '@/Components/ModalBackground';

interface PopupComponentProps {
    id: string;
    width?: string;
    height?: string;
    zindex?: string | number;
    params?: {
        clientX?: number;
        clientY?: number;
        overflow?: string;
        borderRadius?: string;
        boxShadow?: string;
    };
    classPopup?: string;
    children: ReactNode;
    onClose: (id: string) => void;
}

const PopupComponent: React.FC<PopupComponentProps> = ({
    id,
    width = '98vw',
    height = '98vh',
    zindex = '100',
    params = {},
    classPopup = 'bg-white w-[90vw] h-auto resize max-h-[90vh] max-w-[98vw]',
    children,
    onClose,
}) => {
    const [visible, setVisible] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        document.body.classList.add('modal-open');
        document.body.style.overflow = 'hidden';

        const popupContent = contentRef.current;

        if (popupContent && typeof params.clientX === 'number' && typeof params.clientY === 'number') {
            const transformOriginX = `${(params.clientX / window.innerWidth) * 100}%`;
            const transformOriginY = `${(params.clientY / window.innerHeight) * 100}%`;

            popupContent.style.transformOrigin = `${transformOriginX} ${transformOriginY}`;
        }

        setTimeout(() => setVisible(true), 10);

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
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
        <>
            <ModalBackground
                id_fundo_modal={`modal_background_${id}`}
                visible={true}
                sobreposicao={+zindex - 1}
                onClick={handleClose}
            />

            <div
                ref={contentRef}
                id={`id_div_conteudo_${id}`}
                role="dialog"
                aria-labelledby={`popup_${id}_label`}
                aria-modal="true"
                className={`${visible ? 'open' : ''} ${classPopup}`}
                style={{
                    backgroundColor: '',
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
                    zIndex: +zindex,
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
        </>,
        document.body
    );
};

export default PopupComponent;
