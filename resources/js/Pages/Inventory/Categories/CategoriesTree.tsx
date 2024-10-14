import React, { useState, useEffect } from 'react';
import { TreeSelect, TreeSelectChangeEvent, TreeSelectSelectionKeysType } from 'primereact/treeselect';
import { Category } from '../interfaces'; // Ajuste o caminho conforme necessário

interface CategoryTreeSelectProps {
    categories: Category[];
    filterCategory: TreeSelectSelectionKeysType | null;
    setFilterCategory: (value: TreeSelectSelectionKeysType | null) => void;
}

interface TreeNode {
    key: string;
    label: string;
    value: string;
    children: TreeNode[];
}

const CategoryTreeSelect: React.FC<CategoryTreeSelectProps> = ({ categories, filterCategory, setFilterCategory }) => {
    const [groupedCategories, setGroupedCategories] = useState<TreeNode[]>([]);

    useEffect(() => {
        const grouped = buildCategoryTree(categories);
        setGroupedCategories(grouped);
    }, [categories]);

    const buildCategoryTree = (categories: Category[]): TreeNode[] => {
        const categoryMap: Record<string, TreeNode> = {};

        categories.forEach((category) => {
            categoryMap[category.id.toString()] = {
                label: category.name,
                value: category.id.toString(),
                key: category.id.toString(),
                children: []
            };
        });

        const tree: TreeNode[] = [];
        categories.forEach((category) => {
            if (category.parent_id) {
                if (categoryMap[category.parent_id.toString()]) {
                    categoryMap[category.parent_id.toString()].children.push(categoryMap[category.id.toString()]);
                }
            } else {
                tree.push(categoryMap[category.id.toString()]);
            }
        });

        return tree;
    };

    const handleChange = (e: TreeSelectChangeEvent) => {
        const value = e.value as TreeSelectSelectionKeysType; // Garantimos que o valor seja do tipo correto
        setFilterCategory(value || null);
    };

    return (
        <TreeSelect
            value={filterCategory}
            options={groupedCategories}
            onChange={handleChange}
            metaKeySelection={false}
            className="w-full md:w-20rem bg-white border border-gray-600"
            selectionMode="checkbox"
            display="chip"
            placeholder="Selecione Categorias"
            showClear
        />
    );
};

export default CategoryTreeSelect;
