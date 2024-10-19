import React, { useState, useEffect } from 'react';
import { Tree } from 'primereact/tree';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { InputText  } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';

import AddStockLocalDialog from './AddStockLocalDialog';
import TextArea from '@/Components/TextArea';
import useStockLocalExpansion from '../Hooks/useStockLocalExpansion'; // Hook criado
import useStockLocalEdit from '../Hooks/useStockLocalEdit'; // Hook criado
import { stockLocals, ItemNode } from '../interfaces'; // Ajuste o caminho conforme necessário
import classNames from 'classnames';

interface StockLocalsManagerProps {
    stockLocals: stockLocals[];
}

export default function StockLocalsManager({ stockLocals }: StockLocalsManagerProps) {
    const [nodes, setNodes] = useState<ItemNode[]>([]);
    const [expandedKeys, setExpandedKeys] = useState<{ [key: string]: boolean }>({});
    const [showAddSubcategoryDialog, setShowAddSubcategoryDialog] = useState(false);
    const [selectedParentLocal, setSelectedParentLocal] = useState<{ key: number | null; name: string } | null>(null);
    
    // Função para montar a árvore de locais de estoque
    const buildStockLocalTree = (stockLocals: stockLocals[]): ItemNode[] => {
        const localMap: { [key: number]: ItemNode } = {};
        
        const calculateDepth = (local: stockLocals, depth: number = 0): number => {
            if (!local.parent_id) return depth;
            const parentLocal = stockLocals.find(loc => loc.id === local.parent_id);
            return parentLocal ? calculateDepth(parentLocal, depth + 1) : depth;
        };
        console.log(stockLocals);
        const sortedLocals = [...stockLocals].sort((a, b) => a.name.localeCompare(b.name));
        
        sortedLocals.forEach((local) => {
            const depth = calculateDepth(local);
            localMap[local.id] = {
                key: String(local.id),
                label: local.name,
                description: local.description,
                children: [],
                className: local.parent_id ? 'p-node-leaf' : 'p-node-parent',
                style: { paddingLeft: `${depth * 15}px` },
            };
        });
        
        const tree: ItemNode[] = [];
        sortedLocals.forEach((local) => {
            if (local.parent_id && localMap[local.parent_id]) {
                localMap[local.parent_id].children.push(localMap[local.id]);
            } else {
                tree.push(localMap[local.id]);
            }
        });
        
        return tree;
    };
    const {
        isEditing,
        editedStockLocals,
        handleEditToggle,
        handleInputChange,
        handleSaveChanges,
        processing,
        setEditedStockLocals,
        handleDeleteStockLocal,
    } = useStockLocalEdit(stockLocals, setNodes, buildStockLocalTree);

    const { expandedKeys: expanded, setExpandedKeys: setExpanded, expandAll, collapseAll } = useStockLocalExpansion(nodes);


    useEffect(() => {
        const groupedStockLocals = buildStockLocalTree(stockLocals);
        setNodes(groupedStockLocals);
    }, [stockLocals, isEditing]);

    // Função para abrir o diálogo de adicionar subcategoria
    const openAddStockLocalDialog = (parentLocal: { key: number | null; name: string }) => {
        setSelectedParentLocal(parentLocal);
        setShowAddSubcategoryDialog(true);
    };

// Função de drag-and-drop para alterar o parent_id
const onStockLocalDragDrop = (event: any) => {
    const dragNodeKey = event.dragNode.key; // Local de estoque que foi arrastado
    const dropNodeKey = event.dropNode?.key || null; // Local onde foi solto (ou null para raiz)

    const draggedLocal = stockLocals.find(local => local.id === parseInt(dragNodeKey));

    if (draggedLocal) {
        const updatedLocal = {
            ...editedStockLocals[draggedLocal.id], // Mantém o nome e descrição
            parent_id: dropNodeKey ? parseInt(dropNodeKey) : null, // Atualiza o parent_id
        };

        // Usa handleInputChange para atualizar o estado e a árvore visual
        handleInputChange(draggedLocal.id, 'parent_id', updatedLocal.parent_id); // Passa null corretamente
    }
};

    const handleNodeClick = (node: ItemNode) => {
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
                    <img src="/images/icons/stock.png" className="w-14 h-14" alt="Stock Icon" />
                    <h2 className="md:text-3xl font-bold text-gray-700">Locais de Estoque</h2>
                </div>
                <div className="flex gap-3">
                    {isEditing && (
                        <Button
                            icon="pi pi-undo"
                            label="Cancelar"
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

            <div className="flex flex-col h-[82vh] md:h-[73vh] xl:h-[73vh] mb-2 shadow rounded-md border border-gray-200 w-full overflow-y-auto md:mt-10 bg-white">

                <Tree
                    value={nodes as ItemNode[]}
                    expandedKeys={expandedKeys}
                    onToggle={(e) => setExpandedKeys(e.value)}
                    className="w-full bg-white"
                    nodeTemplate={(node, options) => (
                        <div
                            className={`flex gap-2 border-b pb-1 bg-gray-100 p-1 ${options.className}`}
                            draggable={isEditing} // Somente permite arrastar no modo de edição
                            onDragStart={(e) => e.currentTarget.style.cursor = 'grabbing'}
                            onDragEnd={(e) => e.currentTarget.style.cursor = 'grab'}
                        >
                            <i className={`pi my-auto ${node.children && node.children.length > 0 ? 'pi-th-large text-blue-500' : 'pi-box text-green-500'} mr-2`}></i>
                            {isEditing ? (
                                <>
                                <div className='flex flex-col space-y-1'>
                                    <InputText
                                        value={editedStockLocals[Number(node.key)]?.name || ''}
                                        onChange={(e) => handleInputChange(node.key as number, 'name', e.target.value)}
                                        className="p-inputtext-sm w-full py-0 m-0"
                                    />
                                    <div>
                                    <InputTextarea
                                        value={editedStockLocals[Number(node.key)]?.description || ''}
                                        onChange={(e) => handleInputChange(node.key as number, 'description', e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === ' ') {
                                                e.stopPropagation(); // Impede a propagação do evento para o Tree
                                            }
                                        }}
                                        className="p-inputtext-sm w-full py-0 m-0"
                                    />

                                    </div>
                                </div>
                                <Button
                                    icon="pi pi-trash"
                                    className="p-button-rounded p-button-danger bg-red-500 text-white w-8 h-8 m-auto"
                                    onClick={() => handleDeleteStockLocal(node.key as number)}
                                    title="Excluir Local de Estoque"
                                />
                                </>
                            ) : (
                                    <span
                                        title={node.label}
                                        onClick={() => handleNodeClick(node as ItemNode)} // Fazendo um cast para garantir que o tipo seja compatível
                                        className="cursor-pointer m-auto"
                                    >
                                        {node.label}
                                        <div className='text-xs m-auto'>
                                            {editedStockLocals[Number(node.key)]?.description || stockLocals.find(local => local.id === Number(node.key))?.description || ''}
                                        </div>
                                        </span>

                            )}
                            <Button
                                    icon="pi pi-plus"
                                    className="p-button-rounded p-button-text p-button-secondary m-auto"
                                    onClick={() => openAddStockLocalDialog({ key: node.key as number, name: node.label || '' })}
                                    title="Adicionar Subcategoria"
                                />
                            {node.children && node.children.length > 0 && (
                                <Badge value={node.children.length} severity="info" className="ml-auto" />
                            )}
                        </div>
                    )}
                    dragdropScope={isEditing ? "stock-local-drag" : undefined}
                    onDragDrop={isEditing ? onStockLocalDragDrop : undefined}
                    filter={false} // Se estiver habilitado, pode interferir no comportamento do input

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
                <Button
                icon="pi pi-plus"
                label="Adicionar na raiz"
                className="p-button-raised p-button-rounded p-button-warning bg-gray-200 text-black py-1 px-2 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
                onClick={() => openAddStockLocalDialog({ key: null, name: '' })}
                title="Adicionar Subcategoria"
            />
            </div>

            {/* Diálogo de adicionar subcategoria */}
            <AddStockLocalDialog
                visible={showAddSubcategoryDialog}
                onHide={() => setShowAddSubcategoryDialog(false)}
                parentLocalName={selectedParentLocal ? selectedParentLocal.name : null}
                parentLocalId={selectedParentLocal ? selectedParentLocal.key : null}
                setSaveAddLocal={() => {
                    setShowAddSubcategoryDialog(false);
                    setSelectedParentLocal(null);
                }}
                
            />
        </div>
    );
}
