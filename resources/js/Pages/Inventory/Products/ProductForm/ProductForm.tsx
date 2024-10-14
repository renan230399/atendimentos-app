import React, { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { TreeSelect } from 'primereact/treeselect';
import MeasuringForm from './MeasuringForm';
import PopupHeader from '@/Layouts/PopupHeader';
import { Product, Supplier, ProductFormData } from '../../interfaces'; // Ajuste o caminho conforme necessário


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

const ProductForm: React.FC<ProductFormProps> = ({ onHide, categories, initialData }) => {
    const { data, setData, post, put, reset, processing, errors } = useForm<ProductFormData>({
        id: null,
        category_id: null,
        name: '',
        description: '',
        measuring_unit: null,
        quantities_per_unit: null,
        measuring_unit_of_unit: '',
        status: true,
        ...initialData, // Inicializa os campos com os valores de initialData, se fornecidos
    });

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
    }, [categories]);

    const handleInputChange = (field: keyof ProductFormData, value: any): void => {
        setData(field, value);
    };

    const handleSubmitProduct = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        const routeName = initialData && initialData.id ? 'product.update' : 'product.store';
        const method = initialData && initialData.id ? put : post;
    
        // Somente passa o ID se ele existir e for um número válido
        const routeParams = initialData && initialData.id ? initialData.id : undefined;
    
        method(route(routeName, routeParams), {
            onSuccess: () => {
                onHide();
                reset();
            },
        });
    };
    

    return (
        <>
            <PopupHeader title={initialData ? 'Editar Produto' : 'Cadastrar Produto'} />

            <form onSubmit={handleSubmitProduct} className="space-y-6">
                <div className="flex flex-wrap gap-4">
                    {/* Campo de Nome do Produto */}
                    <div className="w-[65%] m-auto">
                        <label className="block text-gray-700 font-medium">Nome do Produto</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm ${errors.name ? 'border-red-500' : ''}`}
                            required
                        />
                        {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
                    </div>

                    {/* Campo de Seleção da Categoria usando TreeSelect */}
                    <div className="w-[30%] m-auto">
                        <label className="block text-gray-700 font-medium">Categoria</label>
                        <TreeSelect
                            value={data.category_id ? String(data.category_id) : null} // Converte o category_id para string
                            onChange={(e) => handleInputChange('category_id', Number(e.value))} // Converte de volta para número ao alterar
                            options={categoryNodes}
                            className={`mt-1 w-full border border-gray-300 rounded-md shadow-sm ${errors.category_id ? 'border-red-500' : ''}`}
                            placeholder="Selecione uma categoria"
                            required
                        />
                        {errors.category_id && <div className="text-red-500 text-sm mt-1">{errors.category_id}</div>}
                    </div>

                    <MeasuringForm
                        formData={{
                            measuring_unit: data.measuring_unit,
                            quantities_per_unit: data.quantities_per_unit,
                            measuring_unit_of_unit: data.measuring_unit_of_unit,
                        }}
                        setFormData={handleInputChange}
                    />

                    {/* Campo de Status do Produto */}
                    <div className="w-[30%]">
                        <label className="block text-gray-700 font-medium">Status</label>
                        <select
                            value={data.status ? 'ativo' : 'inativo'}
                            onChange={(e) => handleInputChange('status', e.target.value === 'ativo')}
                            className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm ${errors.status ? 'border-red-500' : ''}`}
                            required
                        >
                            <option value="ativo">Ativo</option>
                            <option value="inativo">Inativo</option>
                        </select>
                    </div>

                    {/* Botões de Ação */}
                    <div className="w-full mt-6 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onHide}
                            className="bg-gray-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-gray-600 transition-all"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit" // Corrigido para ser um botão de submissão de formulário
                            className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 transition-all"
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
