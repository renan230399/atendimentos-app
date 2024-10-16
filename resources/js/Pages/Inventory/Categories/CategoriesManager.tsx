import React, { useState, useEffect } from 'react';
import { Tree } from 'primereact/tree';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { InputText } from 'primereact/inputtext';
import AddSubcategoryDialog from './AddSubcategoryDialog';
import { Category, CategoryNode } from '../interfaces'; // Ajuste o caminho conforme necessário
import useCategoryExpansion from '../Hooks/useCategoryExpansion';
import useCategoryEdit from '../Hooks/useCategoryEdit.ts:';
import classNames from 'classnames';

interface CategoriesManagerProps {
    categories: Category[];
}

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
            key: String(category.id),
            label: category.name,
            children: [],
            className: category.parent_id ? 'p-node-leaf' : 'p-node-parent',
            style: { paddingLeft: `${depth * 8}px` },
            depth,
        };
    });

    const tree: CategoryNode[] = [];
    sortedCategories.forEach((category) => {
        const parentNode = category.parent_id ? categoryMap[category.parent_id] : null;
        const currentNode = categoryMap[category.id];
        
        if (category.parent_id && parentNode && currentNode) {
            parentNode.children = parentNode.children || [];
            parentNode.children.push(currentNode);
        } else if (currentNode) {
            tree.push(currentNode);
        }
    });

    return tree;
};

export default function CategoriesManager({ categories }: CategoriesManagerProps) {
    const [nodes, setNodes] = useState<CategoryNode[]>([]);
    const [showAddSubcategoryDialog, setShowAddSubcategoryDialog] = useState(false);
    const [selectedParentCategory, setSelectedParentCategory] = useState<CategoryNode | null>(null);

    const { isEditing, editedCategories, handleEditToggle, handleInputChange, handleSaveChanges, processing, put, setEditedCategories } = useCategoryEdit(categories, setNodes, buildCategoryTree); // put agora disponível
    const { expandedKeys, setExpandedKeys, expandAll, collapseAll } = useCategoryExpansion(nodes);
    const onCategoryDragDrop = (event: any) => {
        const dragNodeKey = event.dragNode.key; // Categoria que foi arrastada
        const dropNodeKey = event.dropNode?.key || null; // Categoria em que foi solta (ou null para raiz)
    
        const draggedCategory = categories.find(category => category.id === parseInt(dragNodeKey));
    
        if (draggedCategory) {
            const updatedCategory = {
                ...editedCategories[draggedCategory.id], // Mantém o name
                parent_id: dropNodeKey ? parseInt(dropNodeKey) : null, // Atualiza para null se for solto na raiz
            };
    
            // Usa handleInputChange para atualizar o estado e a árvore visual
            handleInputChange(draggedCategory.id, updatedCategory);
        }
    };
    
    
    
    
    
    useEffect(() => {
        const groupedCategories = buildCategoryTree(categories);
        setNodes(groupedCategories);
    }, [categories]);

    const openAddSubcategoryDialog = (parentCategory: CategoryNode) => {
        setSelectedParentCategory(parentCategory);
        setShowAddSubcategoryDialog(true);
    };
    const handleNodeClick = (node: CategoryNode) => {
        // Faz uma cópia do estado de expandedKeys
        const newExpandedKeys: { [key: string]: boolean } = { ...expandedKeys };
    
        if(node.key){
            // Verifica se o nó está expandido, se sim, recolhe, se não, expande
            if (newExpandedKeys[node.key]) {
                delete newExpandedKeys[node.key]; // Recolhe o nó removendo-o dos expandedKeys
            } else {
                newExpandedKeys[node.key] = true; // Expande o nó adicionando-o aos expandedKeys
            }
        }
        // Atualiza o estado com os novos expandedKeys
        setExpandedKeys(newExpandedKeys);
    };
 
    
    return (
        <div className="w-full px-3 overflow-y-hidden">
            <div className="flex absolute top-0 left-0 overflow-y-hidden h-[5vh] md:h-[7vh] xl:h-[10vh] justify-between items-center gap-5 p-4 bg-gray-100 shadow-lg rounded-md">
                <div className="flex items-center gap-3">
                    <img src="/images/icons/suppliers.png" className="w-14 h-14" alt="Suppliers Icon" />
                    <h2 className="md:text-3xl font-bold text-gray-700">Categorias de Itens</h2>
                </div>
                <div className="flex gap-3">
                    {isEditing && (
                        <Button
                            icon="pi pi-undo"
                            label=""
                            className={classNames("px-2 py-1 rounded shadow text-white p-button-primary", "bg-red-500")}
                            onClick={handleEditToggle}
                        />
                    )}
                    <Button
                        icon={processing ? "pi pi-spin pi-spinner" : "pi pi-pencil"}
                        label={isEditing ? "Salvar Alterações" : "Editar Locais"}
                        className={classNames(
                            "px-2 py-1 rounded shadow text-white",
                            { "p-button-success bg-green-500": isEditing, "p-button-primary bg-blue-500": !isEditing }
                        )}
                        onClick={isEditing ? handleSaveChanges : handleEditToggle}
                        disabled={processing}
                    />
                </div>
            </div>

            <div className=" flex flex-col h-[82vh] md:h-[73vh] xl:h-[73vh] mb-2 shadow rounded-md border border-gray-200 w-full overflow-y-auto md:mt-10 bg-white">


            <Tree
    value={nodes}
    expandedKeys={expandedKeys}
    onToggle={(e) => setExpandedKeys(e.value)}
    className="w-full bg-white"
    nodeTemplate={(node, options) => (
        <div
            className={`flex gap-1 border-b p-0 border cursor-grab bg-white shadow-sm border-gray-300 mb-1 rounded p-1 ${options.className}`}
            draggable={isEditing} // Somente permite arrastar no modo de edição
            onDragStart={(e) => e.currentTarget.style.cursor = 'grabbing'}
            onDragEnd={(e) => e.currentTarget.style.cursor = 'grab'}
        >
            <i className={`pi my-auto ${node.children && node.children.length > 0 ? 'pi-th-large text-blue-500' : 'pi-box text-green-500'}`}></i>
            {isEditing ? (
                <>
                    <InputText
                        value={editedCategories[node.key as number]?.name || categories.find(cat => cat.id === Number(node.key))?.name || ''}
                        onChange={(e) => handleInputChange(node.key as number, { ...editedCategories[node.key as number], name: e.target.value })}
                        className="w-full py-0 m-0 border-gray-200 rounded shadow bg-gray-50"
                    />
                </>
            ) : (
                <span className='my-auto' onClick={() => handleNodeClick(node as CategoryNode)}>
                    {node.label}
                </span>
            )}
            <Button
                icon="pi pi-plus"
                className="p-button-rounded p-button-text p-button-secondary"
                onClick={() => openAddSubcategoryDialog({ key: node.key as number, label: node.label || '' })}
                title="Adicionar Subcategoria"
            />
            {node.children && node.children.length > 0 && <Badge value={node.children.length} severity="info" className="m-auto" />}
        </div>
    )}
    dragdropScope={isEditing ? "category-drag" : undefined}  // Habilita drag and drop apenas no modo de edição
    onDragDrop={isEditing ? onCategoryDragDrop : undefined}  // Habilita drag and drop apenas no modo de edição
/>



            </div>
            <div className="flex gap-4 justify-center pt-4">
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
            <AddSubcategoryDialog
                visible={showAddSubcategoryDialog}
                onHide={() => setShowAddSubcategoryDialog(false)}
                parentCategoryName={selectedParentCategory?.label || ''}
                parentCategoryId={
                    typeof selectedParentCategory?.key === 'string'
                        ? parseInt(selectedParentCategory.key)
                        : selectedParentCategory?.key || null
                }

                setSelectedParentCategory={() => setSelectedParentCategory(null)}
            />
        </div>
    );
}
