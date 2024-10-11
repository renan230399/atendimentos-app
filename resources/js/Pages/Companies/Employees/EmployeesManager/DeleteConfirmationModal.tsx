// src/components/Employee/DeleteConfirmationModal.tsx
import React from 'react';

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    employeeName: string | null;
    loading: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ isOpen, employeeName, loading, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Confirmar Exclusão</h2>
                <p className="mb-6">Tem certeza de que deseja inativar {employeeName}?</p>
                <div className="flex justify-end">
                    <button onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded mr-2">
                        Cancelar
                    </button>
                    <button onClick={onConfirm} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" disabled={loading}>
                        {loading ? 'Inativando...' : 'Sim, inativar!'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
