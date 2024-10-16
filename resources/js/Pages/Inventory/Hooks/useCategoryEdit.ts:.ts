import { useState, useCallback } from 'react';
import { useForm } from '@inertiajs/react'; // Importa useForm do Inertia.js
import { Category } from '../interfaces'; // Ajuste o caminho conforme necessário

export default function useCategoryEdit(categories: Category[]) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedCategories, setEditedCategories] = useState<{ [key: number]: { name: string; parent_id: number | null } }>({});
    const [saveSuccessEditing, setSaveSuccessEditing] = useState(false);

    // Configura o useForm para lidar com as categorias editadas
    const { data, setData, put, processing } = useForm({
        editedCategories: {} as { [key: number]: { name: string; parent_id: number | null } },
    });
    

    const handleEditToggle = useCallback(() => {
        setIsEditing((prevIsEditing) => !prevIsEditing);
        if (!isEditing) {
            const initialEditedCategories = categories.reduce((acc, category) => {
                acc[category.id] = {
                    name: category.name,
                    parent_id: category.parent_id, // Inclui o parent_id no objeto de categoria
                };
                return acc;
            }, {} as { [key: number]: { name: string; parent_id: number | null } });
            setEditedCategories(initialEditedCategories);
        }
    }, [isEditing, categories]);
    
    const handleInputChange = useCallback((id: number, updatedCategory: { name: string; parent_id: number | null }) => {
        const updatedCategories = {
            ...editedCategories,
            [id]: updatedCategory, // Atualizando o objeto com name e parent_id
        };
        setEditedCategories(updatedCategories);
        setData('editedCategories', updatedCategories); // Atualiza os dados com o novo objeto
    }, [editedCategories]);
    

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
