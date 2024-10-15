import React, { useEffect, useRef } from 'react';

// Tipagem das props do componente
interface ModalBackgroundProps {
  id_fundo_modal: string;
  sobreposicao?: number; // Pode ser opcional com valor padrão
  visible?: boolean;     // Pode ser opcional com valor padrão
  onClick: () => void;   // Função obrigatória para fechar o modal
}

const ModalBackground: React.FC<ModalBackgroundProps> = ({ id_fundo_modal, sobreposicao = 90, visible = false, onClick }) => {
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let fundoModal = document.getElementById(id_fundo_modal);

    if (!fundoModal) {
      // Criação do elemento de fundo do modal
      fundoModal = document.createElement('div');
      fundoModal.id = id_fundo_modal;
      fundoModal.className = `fixed inset-0 bg-black bg-opacity-40 transition-opacity duration-500 cursor-pointer`; // Usando Tailwind para estilização
      fundoModal.style.opacity = visible ? '1' : '0'; // Define a opacidade inicial
      fundoModal.style.zIndex = sobreposicao.toString(); // Define o z-index diretamente
      fundoModal.onclick = onClick; // Fecha o modal ao clicar no fundo
      document.body.appendChild(fundoModal);
      modalRef.current = fundoModal as HTMLDivElement;
    } else {
      fundoModal.style.opacity = visible ? '1' : '0'; // Ajusta a opacidade
      fundoModal.style.zIndex = sobreposicao.toString(); // Define o z-index diretamente
      if (visible) {
        fundoModal.style.display = 'block'; // Mostra o modal
      } else {
        setTimeout(() => {
          if (fundoModal && fundoModal.style.opacity === '0') {
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
