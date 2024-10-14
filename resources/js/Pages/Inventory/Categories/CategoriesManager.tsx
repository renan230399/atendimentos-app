import React, { useState, useEffect } from 'react';
import { Tree } from 'primereact/tree';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { InputText } from 'primereact/inputtext';
import AddSubcategoryDialog from './AddSubcategoryDialog';
import { useForm } from '@inertiajs/react'; // Importa useForm do Inertia.js
import { Category } from '../interfaces'; // Ajuste o caminho conforme necessário

interface CategoriesManagerProps {
    categories: Category[];
}

// Definindo nossa própria interface para os nós da árvore
interface CategoryNode {
    key: string | number | undefined; // Adiciona 'undefined' para compatibilidade com TreeNode
    label: string;
    children?: CategoryNode[];
    depth?: number;
    className?: string;
    style?: React.CSSProperties;
}



export default function CategoriesManager({ categories }: CategoriesManagerProps) {
    const [nodes, setNodes] = useState<CategoryNode[]>([]);
    const [expandedKeys, setExpandedKeys] = useState<{ [key: string]: boolean }>({});
    const [isEditing, setIsEditing] = useState(false);
    const [editedCategories, setEditedCategories] = useState<{ [key: number]: string }>({});
    const [showAddSubcategoryDialog, setShowAddSubcategoryDialog] = useState(false);
    const [selectedParentCategory, setSelectedParentCategory] = useState<CategoryNode | null>(null);
    const [saveAddCategory, setSaveAddCategory] = useState(false);
    const [saveSuccessEditing, setSaveSuccessEditing] = useState(false);

    // Configura o useForm para lidar com as categorias editadas
    const { data, setData, put, processing } = useForm({
        editedCategories: {} as { [key: number]: string }, // Tipando o objeto como um dicionário
    });

    useEffect(() => {
        const groupedCategories = buildCategoryTree(categories);
        setNodes(groupedCategories);
    }, [categories]);
    const buildCategoryTree = (categories: Category[]): CategoryNode[] => {
        const categoryMap: { [key: number]: CategoryNode } = {};
    
        const calculateDepth = (category: Category, depth: number = 0): number => {
            if (!category.parent_id) return depth;
            const parentCategory = categories.find(cat => cat.id === category.parent_id);
            return parentCategory ? calculateDepth(parentCategory, depth + 1) : depth;
        };
    
        const sortedCategories = [...categories].sort((a, b) => a.name.localeCompare(b.name));
    
        sortedCategories.forEach((category) => {
            const depth = calculateDepth(category);
            categoryMap[category.id] = {
                key: String(category.id), // Garantindo que a chave seja string
                label: category.name,
                children: [],
                className: category.parent_id ? 'p-node-leaf' : 'p-node-parent', // Classe CSS baseada no parent_id
                style: { paddingLeft: `${depth * 15}px` }, // Estilo de indentação baseado na profundidade
                depth, // Mantendo o dado de profundidade
            };
        });
    
        const tree: CategoryNode[] = [];
        sortedCategories.forEach((category) => {
            const parentNode = category.parent_id ? categoryMap[category.parent_id] : null;
            const currentNode = categoryMap[category.id];
            
            if (category.parent_id && parentNode && currentNode) {
                // Garante que parentNode.children seja um array antes de tentar usá-lo
                parentNode.children = parentNode.children || [];
                parentNode.children.push(currentNode);
            } else if (currentNode) {
                tree.push(currentNode);
            }
            
        });
    
        return tree;
    };
    
    
    
    
    
    

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        if (!isEditing) {
            const initialEditedCategories: { [key: number]: string } = categories.reduce((acc, category) => {
                acc[category.id] = category.name;
                return acc;
            }, {} as { [key: number]: string }); // Tipando o acumulador
            setEditedCategories(initialEditedCategories);
        }
    };

    const handleInputChange = (id: number, newName: string) => {
        const updatedCategories: { [key: number]: string } = {
            ...editedCategories,
            [id]: newName,
        };
        setEditedCategories(updatedCategories);
        setData('editedCategories', updatedCategories);
    };

    const handleSaveChanges = (e: React.FormEvent) => {
        e.preventDefault();

        // Envia os dados editados para o backend
        put(route('categories.update'), {
            data,
            onSuccess: () => {
                setSaveSuccessEditing(true);
                setIsEditing(false);
            },
        });
    };

    const expandAll = () => {
        let _expandedKeys: { [key: string]: boolean } = {};
        for (let node of nodes) {
            expandNode(node, _expandedKeys);
        }
        setExpandedKeys(_expandedKeys);
    };

    const collapseAll = () => {
        setExpandedKeys({});
    };

    const openAddSubcategoryDialog = (parentCategory: CategoryNode) => {
        setSelectedParentCategory(parentCategory);
        setShowAddSubcategoryDialog(true);
    };

    const expandNode = (node: CategoryNode, _expandedKeys: { [key: string]: boolean | number }) => {
        if (node.children && node.children.length) {
            const key = node.key;
    
            if (key !== undefined && key !== null) { // Verifica se key é definido e válido
                _expandedKeys[key.toString()] = true; // Converte a chave para string se necessário
            }
    
            for (let child of node.children) {
                expandNode(child, _expandedKeys);
            }
        }
    };
    
    

    return (
        <div className="w-full px-3">
            <div className="flex flex-wrap fixed top-0 justify-between items-center gap-5 p-4 bg-gray-100 shadow-lg rounded-md">
                <div className="flex items-center gap-3">
                    <img src="/images/icons/suppliers.png" className="w-14 h-14" alt="Suppliers Icon" />
                    <h2 className="text-3xl font-bold text-gray-700">Categorias de Itens</h2>
                </div>
                <div className="flex gap-3">
                    {isEditing && (
                        <Button
                            icon="pi pi-undo"
                            label={"Cancelar"}
                            className={"px-2 py-1 rounded shadow text-white p-button-primary bg-red-500"}
                            onClick={handleEditToggle}
                        />
                    )}
                    <Button
                        icon="pi pi-pencil"
                        label={isEditing ? "Salvar Alterações" : "Editar Locais"}
                        className={`px-2 py-1 rounded shadow text-white ${isEditing ? "p-button-success bg-green-500 " : "p-button-primary bg-blue-500"}`}
                        onClick={isEditing ? handleSaveChanges : handleEditToggle}
                    />
                </div>
            </div>
            <div className="card flex flex-col items-center justify-center mt-6 ">
                <h3 className="text-white text-lg font-semibold mb-4">Gerenciar Categorias</h3>
                <div className="flex gap-4">
                    <Button
                        type="button"
                        icon="pi pi-angle-double-down"
                        label="Expandir Tudo"
                        className="p-button-raised p-button-rounded p-button-success bg-blue-500 text-white py-1 px-2 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
                        onClick={expandAll}
                    />
                    <Button
                        type="button"
                        icon="pi pi-angle-double-up"
                        label="Colapsar Tudo"
                        className="p-button-raised p-button-rounded p-button-warning bg-red-500 text-white py-1 px-2 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
                        onClick={collapseAll}
                    />
                </div>
            </div>
            <Tree
    value={nodes}
    expandedKeys={expandedKeys}
    onToggle={(e) => setExpandedKeys(e.value)}
    className="w-full bg-white p-4"
    nodeTemplate={(node, options) => (
        <div className={`flex gap-2 border-b pb-1 bg-gray-100 p-1 ${options.className}`}
        >
            <i className={`pi my-auto ${node.children && node.children.length > 0 ? 'pi-th-large text-blue-500' : 'pi-box text-green-500'} mr-`}></i>
            {isEditing ? (
                <>
                    <InputText
                        value={editedCategories[node.key as number] || ''}
                        onChange={(e) => handleInputChange(node.key as number, e.target.value)}
                        className="p-inputtext-sm w-full py-0 m-0"
                    />
                    <Button
                        icon="pi pi-plus"
                        className="p-button-rounded p-button-text p-button-secondary"
                        onClick={() => openAddSubcategoryDialog({ key: node.key as number, label: node.label || '' })}
                        title="Adicionar Subcategoria"
                    />

                </>
            ) : (
                <span>{node.label}</span>
            )}
            {node.children && node.children.length > 0 && <Badge value={node.children.length} severity="info" className="ml-auto" />}
        </div>
    )}
/>




                <AddSubcategoryDialog
                    visible={showAddSubcategoryDialog}
                    onHide={() => setShowAddSubcategoryDialog(false)}
                    parentCategoryName={selectedParentCategory?.label || ''}
                    parentCategoryId={
                        typeof selectedParentCategory?.key === 'string'
                            ? parseInt(selectedParentCategory.key)
                            : selectedParentCategory?.key || null
                    }
                    setSaveAddCategory={() => setSaveAddCategory(true)} // Altere a função para uma que não precisa de argumento
                    setIsEditing={() => setIsEditing(true)} // Altere a função para uma que não precisa de argumento
                    setSelectedParentCategory={() => setSelectedParentCategory(null)} // Altere a função para uma que não precisa de argumento
                />

        </div>
    );
}
