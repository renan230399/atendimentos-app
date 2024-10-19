import React, { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { TreeSelect } from 'primereact/treeselect';
import { z } from 'zod';
import MeasuringForm from './MeasuringForm';
import PopupHeader from '@/Layouts/PopupHeader';
import { Product } from '../../interfaces'; // Ajuste o caminho conforme necessário
import TextArea from '@/Components/TextArea';
import CustomDropdown from '@/Components/CustomDropdown';
import InputStatus from '@/Components/InputStatus';
type ProductFormData = Omit<Product, 'stocks'>;
import { FloatLabel } from 'primereact/floatlabel';
interface ProductFormProps {
    onHide: () => void;
    categories: { id: number; name: string; parent_id: number | null }[];
    initialData?: ProductFormData;
}

interface CategoryNode {
    key: number;
    label: string;
    children?: CategoryNode[];
}

// Definindo o esquema de validação do Zod
const productSchema = z.object({
    id: z.number().nullable(),
    category_id: z.number().nullable(),
    name: z.string().min(1, "O nome do produto é obrigatório"),
    description: z.string().nullable(),
    measuring_unit: z.string().min(1, "Insira a unidade de medida"),
    quantities_per_unit: z.number().min(1, "Insira as quantidades"),
    measuring_unit_of_unit: z.string().min(1, "Insira a unidade de medida de cada unidade"),
    status: z.boolean(),
});

const ProductForm: React.FC<ProductFormProps> = ({ onHide, categories, initialData }) => {
    const { data, setData, post, put, reset, processing, errors } = useForm({
        id: initialData?.id || null,
        category_id: initialData?.category_id || null, // Use o valor de initialData se estiver presente
        name: initialData?.name || '',
        description: initialData?.description || '', // Use o valor de initialData se presente
        measuring_unit: initialData?.measuring_unit || null,
        quantities_per_unit: initialData?.quantities_per_unit || null,
        measuring_unit_of_unit: initialData?.measuring_unit_of_unit || '',
        status: initialData?.status ?? true, // Verifica se é nulo ou indefinido e define como `true`
    });
    console.log(initialData);
        // Atualizar o formulário quando `initialData` mudar
        useEffect(() => {
            if (initialData) {
                const { ...normalizedData } = data;
                setData({
                    id: initialData.id || null,
                    category_id: initialData.category_id || null,
                    name: initialData.name || '',
                    description: initialData.description || '',
                    measuring_unit: initialData.measuring_unit || null,
                    quantities_per_unit: initialData.quantities_per_unit || null,
                    measuring_unit_of_unit: initialData.measuring_unit_of_unit || '',
                    status: initialData.status ?? true,
                });
            }
        }, [initialData]); // Dependência de `initialData` para atualizar quando mudar
        
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [categoryNodes, setCategoryNodes] = useState<CategoryNode[]>([]);

    // Converte a lista de categorias em uma estrutura hierárquica para o TreeSelect
    useEffect(() => {
        const buildTree = (nodes: { id: number; name: string; parent_id: number | null }[], parentId: number | null): CategoryNode[] =>
            nodes
                .filter(node => node.parent_id === parentId)
                .map(node => ({
                    key: node.id,
                    label: node.name,
                    children: buildTree(nodes, node.id),
                }));

        setCategoryNodes(buildTree(categories, null));
    }, []);

    const handleInputChange = (field: keyof ProductFormData, value: any): void => {
        setData(field, value);
    };

const handleSubmitProduct = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    // Remover campos não relevantes para a validação
    const { ...normalizedData } = data;
    normalizedData.category_id = normalizedData.category_id ? Number(normalizedData.category_id) : null;

    // Validar os dados usando Zod
    const result = productSchema.safeParse(normalizedData);

    if (!result.success) {
        const zodErrors = result.error.errors.reduce((acc, error) => {
            const errorPath = error.path.join('.'); // Garante que o caminho completo do erro seja capturado
            acc[errorPath] = error.message;
            return acc;
        }, {} as Record<string, string>);
        
        setValidationErrors(zodErrors);
        return; // Não envia o formulário se houver erros de validação
    } else {

        setValidationErrors({}); // Limpa os erros de validação, se houver
    }
    
    const routeName = initialData && initialData.id ? 'product.update' : 'product.store';
    const routeParams = initialData && initialData.id ? { id: initialData.id } : undefined;
    
    const submitMethod = initialData && initialData.id ? put : post;
    
    submitMethod(route(routeName, routeParams), {
        onSuccess: () => {
            onHide();
            reset();
        },
    });
};

    

    return (
        <>
            <PopupHeader title={initialData ? 'Editar Produto' : 'Cadastrar Produto'} />

            <form onSubmit={handleSubmitProduct} className="space-y-6 p-6 bg-white rounded-lg shadow-lg">
    <div className="flex flex-wrap gap-6">
        {/* Campo de Nome do Produto */}
        <div className="w-full md:w-[65%]">
        <FloatLabel>
            <input
                type="text"
                id="name"
                value={data.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${validationErrors.name ? 'border-red-500 focus:ring-red-500' : ''} ${data.name ? 'p-filled' : ''}`}
                required
            />
            <label htmlFor="name" className="block text-gray-400 mb-2">Nome do Produto</label>
        </FloatLabel>

            {validationErrors.name && <div className="text-red-500 text-sm mt-1">{validationErrors.name}</div>}
        </div>

        {/* Campo de Seleção da Categoria usando TreeSelect */}
        <div className="w-full md:w-[30%]">
        <FloatLabel>
        <TreeSelect
                value={data.category_id ? String(data.category_id) : null}
                onChange={(e) => handleInputChange('category_id', Number(e.value))}
                options={categoryNodes}
                className={` border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    validationErrors.category_id ? 'border-red-500 focus:ring-red-500' : ''
                }`}
                placeholder="Selecione uma categoria"
                required
                showClear
            />
            <label className="block text-gray-400 mb-2">Categoria</label>

            </FloatLabel>

            {validationErrors.category_id && <div className="text-red-500 text-sm mt-1">{validationErrors.category_id}</div>}
        </div>

        {/* Campo de Descrição */}
        <div className="w-full md:w-[65%]">
            <label className="block text-gray-700 font-semibold mb-2">Descrição do Produto</label>
            <textarea
                value={data.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className={`mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    validationErrors.description ? 'border-red-500 focus:ring-red-500' : ''
                }`}
                placeholder="Descrição do produto"
            />
            {validationErrors.description && <div className="text-red-500 text-sm mt-1">{validationErrors.description}</div>}
        </div>

        {/* Medidas do Produto */}
        <div className="w-full md:w-[50%]">
            <MeasuringForm
                formData={{
                    measuring_unit: data.measuring_unit,
                    quantities_per_unit: data.quantities_per_unit,
                    measuring_unit_of_unit: data.measuring_unit_of_unit,
                }}
                setFormData={setData}
                validationErrors={validationErrors} // Passando os erros de validação
            />
        </div>

        {/* Campo de Status do Produto */}
        <div className="w-full md:w-[30%]">
            <InputStatus
                value={data.status}
                onChange={(newStatus) => handleInputChange('status', newStatus === true)}
                label="Status"
                id="status-dropdown"
                error={validationErrors.status}
            />
        </div>

        {/* Botões de Ação */}
        <div className="w-full mt-8 flex justify-end gap-4">
            <button
                type="button"
                onClick={onHide}
                className="bg-gray-400 text-white px-6 py-3 rounded-lg shadow-md hover:bg-gray-500 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
                Cancelar
            </button>
            <button
                type="submit"
                className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                disabled={processing}
            >
                {initialData ? 'Atualizar Produto' : 'Cadastrar Produto'}
            </button>
        </div>
    </div>
</form>

        </>
    );
};

export default ProductForm;
