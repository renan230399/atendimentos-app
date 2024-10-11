import React, { useState, useEffect } from 'react';
import { Tree } from 'primereact/tree';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { InputText } from 'primereact/inputtext';
import AddStockLocalDialog from './AddStockLocalDialog';
import { useForm } from '@inertiajs/react';
import TextArea from '@/Components/TextArea';
interface StockLocal {
    id: number;
    company_id: number;
    parent_id: number | null;
    name: string;
    description: string;
}

interface StockLocalsManagerProps {
    stockLocals: StockLocal[];
}

export default function StockLocalsManager({ stockLocals }: StockLocalsManagerProps) {
    const [nodes, setNodes] = useState([]);
    const [expandedKeys, setExpandedKeys] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [editedStockLocals, setEditedStockLocals] = useState({});
    const [showAddSubcategoryDialog, setShowAddSubcategoryDialog] = useState(false);
    const [selectedParentLocal, setSelectedParentLocal] = useState<{ key: number | null; name: string }>({ key: null, name: '' });
    const [saveAddLocal, setSaveAddLocal] = useState(false);
    const [saveSuccessEditing, setSaveSuccessEditing] = useState(false);

    const { data, setData, put, processing } = useForm({
        editedStockLocals: {},
    });

    useEffect(() => {
        const groupedStockLocals = buildStockLocalTree(stockLocals);
        setNodes(groupedStockLocals);
    }, [stockLocals]);

    const buildStockLocalTree = (stockLocals) => {
        const localMap = {};
    
        const calculateDepth = (local, depth = 0) => {
            if (!local.parent_id) return depth;
            const parentLocal = stockLocals.find(loc => loc.id === local.parent_id);
            return parentLocal ? calculateDepth(parentLocal, depth + 1) : depth;
        };
    
        const sortedLocals = [...stockLocals].sort((a, b) => a.name.localeCompare(b.name));
    
        sortedLocals.forEach((local) => {
            const depth = calculateDepth(local);
            localMap[local.id] = {
                key: local.id,
                label: local.name,
                data: local.name,
                description: local.description, // Adicionando a descrição
                children: [],
                className: local.parent_id ? 'p-node-leaf' : 'p-node-parent',
                style: { paddingLeft: `${depth * 15}px` },
            };
        });
    
        const tree = [];
        sortedLocals.forEach((local) => {
            if (local.parent_id) {
                localMap[local.parent_id]?.children.push(localMap[local.id]);
            } else {
                tree.push(localMap[local.id]);
            }
        });
    
        return tree;
    };
    

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        if (!isEditing) {
            const initialEditedLocals = stockLocals.reduce((acc, local) => {
                acc[local.id] = { name: local.name, description: local.description };
                return acc;
            }, {});
            setEditedStockLocals(initialEditedLocals);
        }
    };
    

    const handleInputChange = (id, field, newValue) => {
        const updatedLocals = {
            ...editedStockLocals,
            [id]: {
                ...editedStockLocals[id],
                [field]: newValue,
            },
        };
        setEditedStockLocals(updatedLocals);
        setData('editedStockLocals', updatedLocals);
    };
    

    const handleSaveChanges = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('stockLocals.update'), {
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

    const openAddSubcategoryDialog = (parentLocal) => {
        setSelectedParentLocal({ key: parentLocal.key, name: parentLocal.name });
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
    const handleNodeClick = (node) => {
        // Faz uma cópia do estado de expandedKeys
        const newExpandedKeys = { ...expandedKeys };
    
        // Verifica se o nó está expandido, se sim, recolhe, se não, expande
        if (newExpandedKeys[node.key]) {
            delete newExpandedKeys[node.key]; // Recolhe o nó removendo-o dos expandedKeys
        } else {
            newExpandedKeys[node.key] = true; // Expande o nó adicionando-o aos expandedKeys
        }
    
        // Atualiza o estado com os novos expandedKeys
        setExpandedKeys(newExpandedKeys);
    };
    
    
    return (
        <div className="w-full px-3">
            <div className="flex flex-wrap absolute w-[80%] m-auto top-0 justify-between items-center gap-5 p-4 bg-gray-100 shadow-lg rounded-md">
                <div className="flex items-center gap-3">
                <img src="/images/icons/suppliers.png" className="w-14 h-14" alt="Suppliers Icon" />
                <h2 className="text-3xl font-bold text-gray-700">Locais de Estoque</h2>
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
                <h3 className="text-white text-lg font-semibold mb-4">Gerenciar Locais de Estoque</h3>
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
        <div className={`flex gap-2 border-b pb-1 bg-gray-100 p-1 ${options.className}`}>
            <i className={`pi my-auto ${node.children && node.children.length > 0 ? 'pi-th-large text-blue-500' : 'pi-box text-green-500'} mr-2`}></i>
            {isEditing ? (
                <>

                    <div className='flex flex-col space-y-2'>
                    <InputText
                        value={editedStockLocals[node.key]?.name || ''}
                        onChange={(e) => handleInputChange(node.key, 'name', e.target.value)}
                        placeholder="Nome do Local"
                        className="p-inputtext-sm w-full py-0 m-0"
                    />
                    <TextArea
                        value={editedStockLocals[node.key]?.description || ''}
                        onChange={(e) => handleInputChange(node.key, 'description', e.target.value)}
                        placeholder="Descrição do Local"
                        className="p-inputtext-sm w-full py-0 m-0"
                    />
                    </div>
                    <Button
                        icon="pi pi-plus"
                        className="p-button-rounded p-button-text p-button-secondary"
                        onClick={() => openAddSubcategoryDialog({ key: node.key, name: node.label })}
                        title="Adicionar Sublocal"
                    />
                </>
            ) : (
                <span
                    title={node.description}
                    onClick={() => handleNodeClick(node)}
                    className="cursor-pointer m-auto"
                >
                    {node.label}
                </span>
            )}
            {node.children && node.children.length > 0 && <Badge value={node.children.length} severity="info" className="ml-auto" />}
        </div>
    )}
/>





            <AddStockLocalDialog
                visible={showAddSubcategoryDialog}
                onHide={() => setShowAddSubcategoryDialog(false)}
                parentLocalName={selectedParentLocal.name}
                parentLocalId={selectedParentLocal.key}
                setSaveAddLocal={setSaveAddLocal}
                setIsEditing={setIsEditing}
            />
        </div>
    );
}
