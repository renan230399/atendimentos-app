import React, { useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useForm } from '@inertiajs/react';

interface AddSubcategoryDialogProps {
    visible: boolean;
    onHide: () => void;
    parentCategoryName: string;
    parentCategoryId: number | null; // Adiciona o ID da categoria pai para associar a nova subcategoria
    setSaveAddCategory: () => void;
    setIsEditing: () => void;

}

const AddSubcategoryDialog: React.FC<AddSubcategoryDialogProps> = ({
    visible,
    onHide,
    parentCategoryName,
    parentCategoryId,
    setSaveAddCategory,
    setIsEditing,
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

    const handleAddSubcategory = (e: React.FormEvent) => { // Adicione o tipo do evento aqui
        e.preventDefault();
        if (data.name.trim() !== '') {
            console.log(data);
            // Envia os dados do formulário para o backend usando o método post do Inertia
            post(route('categories.store'), {
                data,
                onSuccess: () => {
                    reset(); // Reseta o campo de subcategoria usando a função reset do useForm
                    onHide(); // Fecha o diálogo
                    setSaveAddCategory(true);
                    setIsEditing(false);

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
