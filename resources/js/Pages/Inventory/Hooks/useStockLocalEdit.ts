import { useState, useCallback } from 'react';
import { useForm } from '@inertiajs/react'; // Importa useForm do Inertia.js
import { stockLocals, ItemNode } from '../interfaces'; // Ajuste o caminho conforme necessário
interface DeleteResponse {
    message?: string;
    warning?: string;
}

interface EditedStockLocal {
    name: string;
    description: string;
    parent_id: number | null;
}

export default function useStockLocalEdit(
    stockLocals: stockLocals[],
    setNodes: (nodes: ItemNode[]) => void,
    buildStockLocalTree: (stockLocals: stockLocals[]) => ItemNode[]
) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedStockLocals, setEditedStockLocals] = useState<{ [key: number]: EditedStockLocal }>({});
    const [saveSuccessEditing, setSaveSuccessEditing] = useState(false);

    const { data, setData, put, processing, delete: deleteStockLocal } = useForm({
        editedStockLocals: {} as { [key: number]: { name: string; description: string | null; parent_id: number | null } },
    });
    
    

    // Função para alternar entre os modos de edição
    const handleEditToggle = useCallback(() => {
        setIsEditing((prevIsEditing) => !prevIsEditing);
        if (!isEditing) {
            const initialEditedLocals = stockLocals.reduce((acc, local) => {
                acc[local.id] = {
                    name: local.name,
                    description: local.description,
                    parent_id: local.parent_id,
                };
                return acc;
            }, {} as { [key: number]: EditedStockLocal });
            setEditedStockLocals(initialEditedLocals);
        }
    }, [stockLocals]);

    // Função para lidar com mudanças no nome, descrição ou parent_id
    const handleInputChange = useCallback((id: number, field: keyof EditedStockLocal, newValue: string | number | null) => {
        console.log(newValue);
        
        // Atualiza o estado apenas se necessário
        if (editedStockLocals[id]?.[field] !== newValue) {
            const updatedLocals = {
                ...editedStockLocals,
                [id]: {
                    ...editedStockLocals[id],
                    [field]: newValue,
                },
            };
    
            setEditedStockLocals(updatedLocals);
            setData('editedStockLocals', updatedLocals);
    
            // Atualiza somente o local que foi modificado
            const updatedLocal = stockLocals.find(local => local.id === id);
            if (updatedLocal) {
                const updatedLocalList = stockLocals.map((local) =>
                    local.id === id
                        ? { ...local, [field]: newValue } // Atualiza apenas o campo modificado
                        : local
                );
    
                setNodes(buildStockLocalTree(updatedLocalList)); // Atualiza a árvore visual com as mudanças
            }
        }
    }, [editedStockLocals, stockLocals, setNodes, buildStockLocalTree]);
    

    // Função para salvar as alterações
    const handleSaveChanges = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('locais atualizados:', editedStockLocals);
  
        put(route('stockLocals.update'), {
            data: data.editedStockLocals, // Envia os dados para o backend
            onSuccess: () => {
                setSaveSuccessEditing(true);
                setIsEditing(false);
            },
        });
    };
    const handleDeleteStockLocal = useCallback((id: number) => {
        // Confirmação antes de excluir
        if (window.confirm("Tem certeza que deseja excluir este local de estoque?")) {
            // Chama a rota de exclusão
            deleteStockLocal(route('stockLocals.destroy', { id }), {
                onSuccess: (response) => {
                    // Verifique se a resposta possui o que você espera
                    const warning = response.props?.warning; // Usando optional chaining
    
                    if (typeof warning === 'string' && warning) {
                        const confirmDelete = window.confirm(warning);
                        if (confirmDelete) {
                            // Se o usuário confirmar, chama a rota novamente para deletar
                            deleteStockLocal(route('stockLocals.destroy', { id }), {
                                onSuccess: () => {
                                    const updatedLocalList = stockLocals.filter(local => local.id !== id);
                                    setNodes(buildStockLocalTree(updatedLocalList)); // Atualiza a árvore visual
                                    console.log('Local de estoque excluído com sucesso.');
                                },
                                onError: (error) => {
                                    console.error('Erro ao excluir o local de estoque:', error);
                                }
                            });
                        }
                    } else {
                        // Se não houver aviso, atualiza a lista normalmente
                        const updatedLocalList = stockLocals.filter(local => local.id !== id);
                        setNodes(buildStockLocalTree(updatedLocalList)); // Atualiza a árvore visual
                        console.log('Local de estoque excluído com sucesso.');
                    }
                },
                onError: (error) => {
                    console.error('Erro ao verificar exclusão do local de estoque:', error);
                }
            });
        }
    }, [stockLocals, setNodes, buildStockLocalTree]);
    
    

        
    
    
    
    
    
    

    return {
        isEditing,
        editedStockLocals,
        handleEditToggle,
        handleInputChange,
        handleSaveChanges,
        processing,
        saveSuccessEditing,
        setEditedStockLocals, // Agora disponível para ser usado fora do hook
        handleDeleteStockLocal,
    };
}
