import React, { useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useForm } from '@inertiajs/react';
import TextArea from '@/Components/TextArea';

interface AddStockLocalDialogProps {
    visible: boolean;
    onHide: () => void;
    parentLocalName: string;
    parentLocalId: number | null; // ID do local pai para associar o novo sublocal
    setSaveAddLocal: (value: boolean) => void; // Função para definir o estado de sucesso da adição
    setIsEditing: (value: boolean) => void; // Função para controlar o estado de edição
}

const AddStockLocalDialog: React.FC<AddStockLocalDialogProps> = ({
    visible,
    onHide,
    parentLocalName,
    parentLocalId,
    setSaveAddLocal,
    setIsEditing,
}) => {
    // Utilizando useForm do Inertia para gerenciar o estado do formulário e envio de dados
    const { data, setData, post, processing, reset } = useForm({
        name: '',
        description: '',
        parent_id: parentLocalId,
    });

    // Atualiza o estado do formulário quando o parentLocalId muda
    useEffect(() => {
        if (parentLocalId !== data.parent_id) { // Verifica se o parent_id realmente mudou
            setData('parent_id', parentLocalId);
        }
    }, [parentLocalId, setData, data.parent_id]);

    const handleAddStockLocal = (e: React.FormEvent) => {
        e.preventDefault();

        if (data.name.trim() !== '') {
            // Envia os dados do formulário para o backend usando o método post do Inertia
            post(route('stockLocals.store'), {
                data: {
                    name: data.name,
                    description: data.description,
                    parent_id: data.parent_id,
                },
                onSuccess: () => {
                    reset(); // Reseta os campos do formulário usando a função reset do useForm
                    onHide(); // Fecha o diálogo
                    setSaveAddLocal(true); // Atualiza o estado indicando que a adição foi bem-sucedida
                    setIsEditing(false); // Finaliza o modo de edição
                },
            });
        }
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
                className="w-full mb-3"
                required
            />
            <TextArea
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
                placeholder="Descrição do Local"
                className="w-full"
            />
        </Dialog>
    );
};

export default AddStockLocalDialog;
