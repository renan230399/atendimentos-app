import React, { useState, useEffect } from 'react';
import { TreeSelect, TreeSelectChangeEvent, TreeSelectSelectionKeysType } from 'primereact/treeselect';

interface Item {
    id: number;
    name: string;
    parent_id: number | null;
}

interface ItemNode {
    key: string;
    label: string;
    value: string;
    children: ItemNode[];
}

interface ItemsTreeSelectProps {
    items: Item[];
    filterItems: TreeSelectSelectionKeysType | TreeSelectSelectionKeysType[] | null;
    setFilterItems: (value: TreeSelectSelectionKeysType | TreeSelectSelectionKeysType[] | null) => void;
    placeHolder: string;
}

const ItemsTreeSelect: React.FC<ItemsTreeSelectProps> = ({ items, filterItems, setFilterItems, placeHolder }) => {
    const [groupedItems, setGroupedItems] = useState<ItemNode[]>([]);

    useEffect(() => {
        const grouped = buildCategoryTree(items);
        setGroupedItems(grouped);
    }, [items]);

    // Função para construir a árvore de categorias
    const buildCategoryTree = (items: Item[]): ItemNode[] => {
        const categoryMap: { [key: number]: ItemNode } = {};

        // Mapeando categorias para criar nós
        items.forEach((item) => {
            categoryMap[item.id] = {
                label: item.name,
                value: String(item.id),
                key: String(item.id),
                children: []
            };
        });

        // Construindo a árvore de categorias
        const tree: ItemNode[] = [];
        items.forEach((item) => {
            if (item.parent_id !== null && categoryMap[item.parent_id]) {
                categoryMap[item.parent_id].children.push(categoryMap[item.id]);
            } else {
                tree.push(categoryMap[item.id]);
            }
        });

        return tree;
    };

    const handleChange = (e: TreeSelectChangeEvent) => {
        setFilterItems(e.value as TreeSelectSelectionKeysType | TreeSelectSelectionKeysType[] | null);
    };

    return (
        <TreeSelect
            value={filterItems}
            options={groupedItems}
            onChange={handleChange}
            className="w-full md:w-20rem bg-white border border-gray-600"
            selectionMode="checkbox"
            placeholder={placeHolder}
            display="chip"
            showClear
        />
    );
};

export default ItemsTreeSelect;
