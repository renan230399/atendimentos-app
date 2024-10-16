import React, { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useForm } from '@inertiajs/react';
import { z } from 'zod'; // Importando o Zod para validação
import { CategoryNode } from '../interfaces';
// Definindo o esquema de validação com Zod
const subcategorySchema = z.object({
    name: z.string().min(2, { message: "O nome é obrigatório e deve ter pelo menos dois caracteres" }), // Campo de nome obrigatório
    parent_id: z.number().nullable(), // parent_id pode ser número ou nulo
});



interface AddSubcategoryDialogProps {
    visible: boolean;
    onHide: () => void;
    parentCategoryName: string;
    parentCategoryId: number | null;
    setSelectedParentCategory: (value: CategoryNode | null) => void;
}

const AddSubcategoryDialog: React.FC<AddSubcategoryDialogProps> = ({
    visible,
    onHide,
    parentCategoryName,
    parentCategoryId,

    setSelectedParentCategory,
}) => {
    const { data, setData, post, processing, reset } = useForm({
        name: '',
        parent_id: parentCategoryId,
    });

    const [validationErrors, setValidationErrors] = useState<{ name?: string }>({});

    // Atualiza o estado do formulário quando o parentCategoryId muda
    useEffect(() => {
        if (parentCategoryId !== data.parent_id) {
            setData('parent_id', parentCategoryId);
        }
    }, [parentCategoryId]);

    // Função para validar e enviar o formulário
    const handleAddSubcategory = (e: React.FormEvent) => {
        e.preventDefault();

        // Fazendo a validação com Zod
        const result = subcategorySchema.safeParse(data);

        if (!result.success) {
            const errors = result.error.format();
            setValidationErrors({ name: errors.name?._errors[0] });
            return;
        }

        // Se passar na validação, faz o post
        post(route('categories.store'), {
            data,
            onSuccess: () => {
                reset();
                onHide();
                setSelectedParentCategory(null);
            },
        });
    };

    return (
        <Dialog
            header="Adicionar Nova Subcategoria"
            visible={visible}
            className="w-[30vw]"
            modal
            footer={
                <div className="w-full justify-between flex">
                    <Button label="Cancelar" icon="pi pi-times" onClick={onHide} className="p-button-text" />
                    <Button label="Adicionar" icon="pi pi-check" onClick={handleAddSubcategory} autoFocus disabled={processing} />
                </div>
            }
            onHide={onHide}
        >
            <p className="pb-3">
                <strong>Categoria pai:</strong> {parentCategoryName}
            </p>
            <InputText
                value={data.name}
                onChange={(e) => {
                    setData('name', e.target.value);
                    setValidationErrors({}); // Limpa os erros ao alterar o valor
                }}
                placeholder="Nome da Subcategoria"
                className="w-full"
                required
            />
            {validationErrors.name && (
                <small className="p-error block">{validationErrors.name}</small>
            )}
        </Dialog>
    );
};

export default AddSubcategoryDialog;
