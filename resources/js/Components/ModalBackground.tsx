import React, { useEffect, useRef } from 'react';

const ModalBackground = ({ id_fundo_modal, sobreposicao = 90, visible = false, onClick }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    let fundoModal = document.getElementById(id_fundo_modal);

    if (!fundoModal) {
      fundoModal = document.createElement('div');
      fundoModal.id = id_fundo_modal;
      fundoModal.style.position = 'fixed';
      fundoModal.style.top = '0';
      fundoModal.style.left = '0';
      fundoModal.style.width = '100vw';
      fundoModal.style.height = '100vh';
      fundoModal.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
      fundoModal.style.zIndex = sobreposicao;
      fundoModal.style.transition = 'opacity 0.5s ease-in-out'; // Adiciona transição de opacidade
      fundoModal.style.opacity = visible ? '1' : '0'; // Define a opacidade inicial
      fundoModal.style.display = 'block'; // Mantém o display como block
      fundoModal.onclick = onClick; // Fecha o modal ao clicar no fundo
      document.body.appendChild(fundoModal);
      modalRef.current = fundoModal;
    } else {
      fundoModal.style.opacity = visible ? '1' : '0'; // Ajusta a opacidade
      if (visible) {
        fundoModal.style.display = 'block'; // Mostra o modal
      } else {
        setTimeout(() => {
          if (fundoModal.style.opacity === '0') {
            fundoModal.style.display = 'none'; // Esconde o modal após a transição
          }
        }, 500); // Tempo deve corresponder à duração da transição
      }
    }

    return () => {
      if (modalRef.current) {
        document.body.removeChild(modalRef.current);
      }
    };
  }, [id_fundo_modal, sobreposicao, visible, onClick]);

  return null;
};

export default ModalBackground;
