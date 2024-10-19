import React, { useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useForm } from '@inertiajs/react';
import TextArea from '@/Components/TextArea';
import { z } from 'zod'; // Importa o Zod
import { useState } from 'react';

interface AddStockLocalDialogProps {
    visible: boolean;
    onHide: () => void;
    parentLocalName: string | null;
    parentLocalId: number | null; // ID do local pai para associar o novo sublocal
    setSaveAddLocal: () => void; // Função para fechar o diálogo (sem necessidade de passar um valor)
}


// Define o esquema de validação com Zod
const stockLocalSchema = z.object({
    name: z.string().min(1, 'O nome do local é obrigatório.').max(255, 'O nome é muito longo.'), // Validação de nome
    description: z.string().max(255, 'A descrição é muito longa.').nullable(), // Descrição opcional
    parent_id: z.number().nullable(), // parent_id pode ser nulo
});

const AddStockLocalDialog: React.FC<AddStockLocalDialogProps> = ({
    visible,
    onHide,
    parentLocalName,
    parentLocalId,
    setSaveAddLocal,
}) => {
    const { data, setData, post, processing, reset } = useForm({
        name: '',
        description: '',
        parent_id: parentLocalId,
    });

    // Armazena erros de validação
    const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (parentLocalId !== data.parent_id) {
            setData('parent_id', parentLocalId);
        }
    }, [parentLocalId, setData, data.parent_id]);

    // Valida os dados antes de enviar
    const handleAddStockLocal = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Executa a validação com Zod
        const result = stockLocalSchema.safeParse(data);

        /*if (!result.success) {
            // Se houver erros de validação, armazena-os
            const errors = result.error.format();
            setValidationErrors({
                name: errors.name?._errors[0] || '',
                description: errors.description?._errors[0] || '',
            });
            return; // Não prossegue com o envio
        }*/

        // Se a validação for bem-sucedida, procede com o envio
        post(route('stockLocals.store'), {
            data: {
                name: data.name,
                description: data.description,
                parent_id: data.parent_id,
            },
            onSuccess: () => {
                reset(); // Reseta os campos do formulário
                onHide(); // Fecha o diálogo
                setSaveAddLocal(); // Indica que a adição foi bem-sucedida
            },
        });
    };

    return (
        <Dialog
            header="Adicionar Novo Local de Estoque"
            visible={visible}
            className='w-[40vw] max-w-[60vw]'
            modal
            footer={
                <div className='w-full justify-between flex'>
                    <Button label="Cancelar" icon="pi pi-times" onClick={onHide} className="p-button-text" />
                    <Button label="Adicionar" icon="pi pi-check" onClick={handleAddStockLocal} autoFocus disabled={processing} />
                </div>
            }
            onHide={onHide}
        >
            <p className='pb-3'>
                <strong>Local pai:</strong> {' '}{parentLocalName}
            </p>
            <InputText
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                placeholder="Nome do Local"
                className="w-full"
                required
            />
            {validationErrors.name && <small className="p-error">{validationErrors.name}</small>}

            <TextArea
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
                placeholder="Descrição do Local"
                className="w-full mt-3"
            />
            {validationErrors.description && <small className="p-error">{validationErrors.description}</small>}
        </Dialog>
    );
};

export default AddStockLocalDialog;
