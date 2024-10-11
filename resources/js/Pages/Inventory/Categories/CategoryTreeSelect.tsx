import React, { useState, useEffect } from 'react';
import { TreeSelect } from 'primereact/treeselect';

const CategoryTreeSelect = ({ categories, filterCategory, setFilterCategory }) => {
    // Estado para armazenar as categorias agrupadas
    const [groupedCategories, setGroupedCategories] = useState([]);

    useEffect(() => {
        // Agrupar as categorias assim que o componente carregar ou quando as categorias mudarem
        const grouped = buildCategoryTree(categories);
        setGroupedCategories(grouped);
    }, [categories]);

    // Função para transformar as categorias em uma estrutura hierárquica
    const buildCategoryTree = (categories) => {
        const categoryMap = {};

        // Inicializa cada categoria no map
        categories.forEach((category) => {
            categoryMap[category.id] = {
                label: category.name,
                value: category.id,
                key: category.id,
                children: []
            };
        });

        // Adiciona cada categoria como filho da categoria pai correspondente
        const tree = [];
        categories.forEach((category) => {
            if (category.parent_id) {
                if (categoryMap[category.parent_id]) {
                    categoryMap[category.parent_id].children.push(categoryMap[category.id]);
                }
            } else {
                tree.push(categoryMap[category.id]);
            }
        });

        return tree;
    };

    return (
        <TreeSelect
            value={filterCategory}
            options={groupedCategories}
            onChange={(e) => setFilterCategory(e.value || null)} // Atualiza a categoria selecionada com segurança
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
