import React, { useMemo } from 'react';

// Componente CategoryTreeBuilder que transforma uma lista de categorias em uma estrutura de árvore
const CategoryTreeBuilder = ({ categories }) => {
  // UseMemo para memorizar a estrutura de árvore gerada e otimizar o desempenho
  const treeNodes = useMemo(() => {
    const categoryMap = new Map();

    categories.forEach(category => {
      categoryMap.set(category.id, {
        key: category.id,
        label: category.name,
        children: [],
        data: category
      });
    });

    const nodes = [];
    categories.forEach(category => {
      if (category.parent_id === null) {
        nodes.push(categoryMap.get(category.id));
      } else {
        const parentNode = categoryMap.get(category.parent_id);
        if (parentNode) {
          parentNode.children.push(categoryMap.get(category.id));
        }
      }
    });

    return nodes;
  }, [categories]);

  return treeNodes;
};

export default CategoryTreeBuilder;
