import React, { useState, useEffect } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Tree } from 'primereact/tree';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';

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
    const [addCategoriesForm, setAddCategoriesForm] = useState(false);
    const [nodes, setNodes] = useState([]);
    const [expandedKeys, setExpandedKeys] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [editedCategories, setEditedCategories] = useState({});
    const [showAddSubcategoryDialog, setShowAddSubcategoryDialog] = useState(false);
    const [selectedParentCategory, setSelectedParentCategory] = useState([]);
    const [newSubcategoryName, setNewSubcategoryName] = useState('');

    useEffect(() => {
        const groupedCategories = buildCategoryTree(categories);
        setNodes(groupedCategories);
    }, [categories]);

    const buildCategoryTree = (categories) => {
        const categoryMap = {};

        // Função para calcular a profundidade do nó na árvore
        const calculateDepth = (category, depth = 0) => {
            if (!category.parent_id) return depth;
            const parentCategory = categories.find(cat => cat.id === category.parent_id);
            return parentCategory ? calculateDepth(parentCategory, depth + 1) : depth;
        };

        // Inicializa cada categoria no map
        categories.forEach((category) => {
            const depth = calculateDepth(category); // Calcula a profundidade do nó
            categoryMap[category.id] = {
                key: category.id,
                label: category.name,
                data: category.name,
                children: [],
                className: category.parent_id ? 'p-node-leaf' : 'p-node-parent',
                style: { paddingLeft: `${depth * 15}px` },
            };
        });

        // Adiciona cada categoria como filho da categoria pai correspondente
        const tree = [];
        categories.forEach((category) => {
            if (category.parent_id) {
                categoryMap[category.parent_id]?.children.push(categoryMap[category.id]);
            } else {
                tree.push(categoryMap[category.id]);
            }
        });

        return tree;
    };

    const handleAddSubcategory = () => {
        if (newSubcategoryName.trim() !== '') {
            console.log('Nova subcategoria adicionada:', {
                parentCategory: selectedParentCategory,
                name: newSubcategoryName,
            });
            setShowAddSubcategoryDialog(false);
        }
    };
    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        if (!isEditing) {
            // Ao iniciar o modo de edição, criar um clone dos nomes das categorias para edição
            const initialEditedCategories = categories.reduce((acc, category) => {
                acc[category.id] = category.name;
                return acc;
            }, {});
            setEditedCategories(initialEditedCategories);
        }
    };

    const handleInputChange = (id, newName) => {
        setEditedCategories({
            ...editedCategories,
            [id]: newName,
        });
    };

    const handleSaveChanges = () => {
        // Aqui você pode implementar a lógica para salvar as alterações no backend ou atualizar o estado
        console.log('Categorias atualizadas:', editedCategories);
        setIsEditing(false);
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
        setNewSubcategoryName('');
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
                    <Button
                        icon="pi pi-pencil"
                        label={isEditing ? "Salvar Alterações" : "Editar Categorias"}
                        className={isEditing ? "p-button-success" : "p-button-primary"}
                        onClick={isEditing ? handleSaveChanges : handleEditToggle}
                    />
                    <Button
                        icon="pi pi-plus"
                        label="Cadastrar Categorias"
                        className="p-button-raised p-button-primary"
                        onClick={() => setAddCategoriesForm(true)}
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
            className="p-button-raised p-button-rounded p-button-success shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
            onClick={expandAll} 
        />
        <Button 
            type="button" 
            icon="pi pi-angle-double-up" 
            label="Colapsar Tudo" 
            className="p-button-raised p-button-rounded p-button-warning shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
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
                        <i className={`pi ${node.children && node.children.length > 0 ? 'pi-th-large text-blue-500' : 'pi-box text-green-500'} mr-2`}></i>
                        {isEditing ? (
                            <>
                                <InputText
                                    value={editedCategories[node.key] || ''}
                                    onChange={(e) => handleInputChange(node.key, e.target.value)}
                                    className="p-inputtext-sm w-full px-1 py-0"
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

            <Dialog 
                header="Adicionar Nova Subcategoria" 
                visible={showAddSubcategoryDialog} 
                className='w-[30vw]' 
                modal 
                footer={
                    <div>

                        <Button label="Cancelar" icon="pi pi-times" onClick={() => setShowAddSubcategoryDialog(false)} className="p-button-text" />
                        <Button label="Adicionar" icon="pi pi-check" onClick={handleAddSubcategory} autoFocus />
                    </div>
                } 
                onHide={() => setShowAddSubcategoryDialog(false)}
            >
                <p className='pb-3'>
                    <strong>Categoria pai:</strong>
                    
                    {' '}{selectedParentCategory.name}
                </p>
                <InputText
                    value={newSubcategoryName}
                    onChange={(e) => setNewSubcategoryName(e.target.value)}
                    placeholder="Nome da Subcategoria"
                    className="w-full"
                />
            </Dialog>
        </div>
    );
}
