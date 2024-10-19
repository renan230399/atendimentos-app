import { useState, useCallback } from 'react';
import { useForm } from '@inertiajs/react'; // Importa useForm do Inertia.js
import { Category, CategoryNode } from '../interfaces'; // Ajuste o caminho conforme necessário

export default function useCategoryEdit(categories: Category[], setNodes: (nodes: CategoryNode[]) => void, buildCategoryTree: (categories: Category[]) => CategoryNode[]) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedCategories, setEditedCategories] = useState<{ [key: number]: { name: string; parent_id: number | null } }>({});
    const [saveSuccessEditing, setSaveSuccessEditing] = useState(false);

    // Configura o useForm para lidar com as categorias editadas
    const { data, setData, put, processing } = useForm({
        editedCategories: {} as { [key: number]: { name: string; parent_id: number | null } },
    });
    

    const handleEditToggle = useCallback(() => {
        setIsEditing((prevIsEditing) => {
            if (!prevIsEditing) {
                const initialEditedCategories = categories.reduce((acc, category) => {
                    acc[category.id] = {
                        name: category.name,
                        parent_id: category.parent_id,
                    };
                    return acc;
                }, {} as { [key: number]: { name: string; parent_id: number | null } });
                setEditedCategories(initialEditedCategories);
            }
            return !prevIsEditing;
        });
    }, [categories]);
    
    
    const handleInputChange = useCallback((id: number, updatedCategory: { name: string; parent_id: number | null }) => {
        // Atualiza o estado das categorias editadas
        const updatedCategories = {
            ...editedCategories,
            [id]: updatedCategory, // Atualizando o objeto com name e parent_id da categoria alterada
        };
        setEditedCategories(updatedCategories);
        setData('editedCategories', updatedCategories); // Atualiza os dados com o novo objeto
    
        // Atualiza a árvore com todas as categorias editadas
        const updatedCategoryList = categories.map(category => {
            // Verifica se essa categoria foi editada
            console.log(updatedCategories[category.id]);
            if (updatedCategories[category.id]) {
                return {
                    ...category,
                    name: updatedCategories[category.id].name, // Atualiza o name se foi editado
                    parent_id: updatedCategories[category.id].parent_id, // Atualiza o parent_id se foi editado
                };
            }
            return category; // Se a categoria não foi editada, retorna como está
        });
    
        setNodes(buildCategoryTree(updatedCategoryList)); // Atualiza a árvore visual com todas as mudanças
    }, [editedCategories, categories, setNodes, buildCategoryTree]);
    
    

    const handleSaveChanges = (e: React.FormEvent) => {
        e.preventDefault();
    console.log("dados enviados", editedCategories);
        // Envia os dados, incluindo o parent_id atualizado
        put(route('categories.update'), {
            data: editedCategories, // Inclui todas as categorias com id, name e parent_id
            onSuccess: () => {
                setSaveSuccessEditing(true);
                setIsEditing(false);
            },
        });
    };
    

    return {
        isEditing,
        editedCategories,
        handleEditToggle,
        handleInputChange,
        handleSaveChanges,
        processing,
        saveSuccessEditing,
        put, // Adicionando put para ser usado fora do hook
        setEditedCategories, // Agora disponível para ser usado fora do hook
    };
}
