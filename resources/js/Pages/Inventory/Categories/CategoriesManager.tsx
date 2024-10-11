import React, { useState, useEffect } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Tree } from 'primereact/tree';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { InputText } from 'primereact/inputtext';
import AddSubcategoryDialog from './AddSubcategoryDialog';
import { useForm } from '@inertiajs/react'; // Importa useForm do Inertia.js

interface Category {
    id: number;
    company_id: number;
    parent_id: number | null;
    name: string;
}

interface CategoriesManagerProps {
    categories: Category[];
}

export default function CategoriesManager({ categories }: CategoriesManagerProps) {
    const [nodes, setNodes] = useState([]);
    const [expandedKeys, setExpandedKeys] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [editedCategories, setEditedCategories] = useState({});
    const [showAddSubcategoryDialog, setShowAddSubcategoryDialog] = useState(false);
    const [selectedParentCategory, setSelectedParentCategory] = useState([]);
    const [saveAddCategory, setSaveAddCategory] = useState(false);
    const [saveSuccessEditing, setSaveSuccessEditing] = useState(false);

    // Configura o useForm para lidar com as categorias editadas
    const { data, setData, put, processing } = useForm({
        editedCategories: {},
    });

    useEffect(() => {
        const groupedCategories = buildCategoryTree(categories);
        setNodes(groupedCategories);
    }, [categories]);

    const buildCategoryTree = (categories) => {
        const categoryMap = {};
    
        const calculateDepth = (category, depth = 0) => {
            if (!category.parent_id) return depth;
            const parentCategory = categories.find(cat => cat.id === category.parent_id);
            return parentCategory ? calculateDepth(parentCategory, depth + 1) : depth;
        };
    
        // Ordena as categorias em ordem alfabética com base no nome
        const sortedCategories = [...categories].sort((a, b) => a.name.localeCompare(b.name));
    
        sortedCategories.forEach((category) => {
            const depth = calculateDepth(category);
            categoryMap[category.id] = {
                key: category.id,
                label: category.name,
                data: category.name,
                children: [],
                className: category.parent_id ? 'p-node-leaf' : 'p-node-parent',
                style: { paddingLeft: `${depth * 15}px` },
            };
        });
    
        const tree = [];
        sortedCategories.forEach((category) => {
            if (category.parent_id) {
                categoryMap[category.parent_id]?.children.push(categoryMap[category.id]);
            } else {
                tree.push(categoryMap[category.id]);
            }
        });
    
        return tree;
    };
    

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        if (!isEditing) {
            const initialEditedCategories = categories.reduce((acc, category) => {
                acc[category.id] = category.name;
                return acc;
            }, {});
            setEditedCategories(initialEditedCategories);
        }
    };

    const handleInputChange = (id, newName) => {
        // Atualiza o estado local com a nova edição
        const updatedCategories = {
            ...editedCategories,
            [id]: newName,
        };
        setEditedCategories(updatedCategories);
    
        // Atualiza o estado global do Inertia com os dados locais
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
        let _expandedKeys = {};
        for (let node of nodes) {
            expandNode(node, _expandedKeys);
        }
        setExpandedKeys(_expandedKeys);
    };

    const collapseAll = () => {
        setExpandedKeys({});
    };

    const openAddSubcategoryDialog = (parentCategory) => {
        setSelectedParentCategory(parentCategory);
        setShowAddSubcategoryDialog(true);
    };

    const expandNode = (node, _expandedKeys) => {
        if (node.children && node.children.length) {
            _expandedKeys[node.key] = true;
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
                className="w-full md:w-30rem bg-white shadow-md rounded-md p-4"
                nodeTemplate={(node, options) => (
                    <div className={`flex items-center gap-2 border-b pb-1 bg-gray-100 p-1 ${options.className}`}>
                        <i className={`pi my-auto ${node.children && node.children.length > 0 ? 'pi-th-large text-blue-500' : 'pi-box text-green-500'} mr-`}></i>
                        {isEditing ? (
                            <>
                                <InputText
                                    value={editedCategories[node.key] || ''}
                                    onChange={(e) => handleInputChange(node.key, e.target.value)}
                                    className="p-inputtext-sm w-full py-0 m-0"
                                />
                                <Button
                                    icon="pi pi-plus"
                                    className="p-button-rounded p-button-text p-button-secondary"
                                    onClick={() => openAddSubcategoryDialog({ key: node.key, name: node.label })}
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
                parentCategoryName={selectedParentCategory.name}
                parentCategoryId={selectedParentCategory.key}
                setSaveAddCategory={setSaveAddCategory}
                setIsEditing={setIsEditing}
            />
        </div>
    );
}
