import React, { useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useForm } from '@inertiajs/react';
interface CategoryNode {
    key: number; // ou string, dependendo do tipo de key que você está usando
    label: string;
    children?: CategoryNode[]; // Array de CategoryNode para representar as subcategorias
}

interface AddSubcategoryDialogProps {
    visible: boolean;
    onHide: () => void;
    parentCategoryName: string;
    parentCategoryId: number | null;
    setSaveAddCategory: (value: boolean) => void; // Altere para aceitar um booleano
    setIsEditing: (value: boolean) => void; // Altere para aceitar um booleano
    setSelectedParentCategory: (value: CategoryNode | null) => void; // Aceita CategoryNode ou null
}


const AddSubcategoryDialog: React.FC<AddSubcategoryDialogProps> = ({
    visible,
    onHide,
    parentCategoryName,
    parentCategoryId,
    setSaveAddCategory,
    setIsEditing,
    setSelectedParentCategory

}) => {
    // Utilizando useForm do Inertia para gerenciar o estado do formulário e envio de dados
    const { data, setData, post, processing, reset } = useForm({
        name: '',
        parent_id: parentCategoryId,
    });

    // Atualiza o estado do formulário quando o parentCategoryId muda
    useEffect(() => {
        if (parentCategoryId !== data.parent_id) { // Verifica se o parent_id realmente mudou
            setData('parent_id', parentCategoryId);
        }
    }, [parentCategoryId]);

    const handleAddSubcategory = (e: React.FormEvent) => {
        e.preventDefault();
        if (data.name.trim() !== '' && parentCategoryId !== null) { // Verificando se não é nulo
            post(route('categories.store'), {
                data,
                onSuccess: () => {
                    reset();
                    onHide();
                    setSaveAddCategory(true);
                    setIsEditing(false);
                    setSelectedParentCategory(null); // Ou alguma lógica que você precise
                }
            });
        }
    };

    return (
        <Dialog
            header="Adicionar Nova Subcategoria"
            visible={visible}
            className='w-[30vw]'
            modal
            footer={
                <div className='w-full justify-between flex'>
                    <Button label="Cancelar" icon="pi pi-times" onClick={onHide} className="p-button-text" />
                    <Button label="Adicionar" icon="pi pi-check" onClick={handleAddSubcategory} autoFocus disabled={processing} />
                </div>
            }
            onHide={onHide}
        >
            <p className='pb-3'>
                <strong>Categoria pai:</strong> {' '}{parentCategoryName}
            </p>
            <InputText
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                placeholder="Nome da Subcategoria"
                className="w-full"
                required
            />
        </Dialog>
    );
};

export default AddSubcategoryDialog;
