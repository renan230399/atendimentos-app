import { TreeNode } from 'primereact/treenode';
import { Category } from '@/Pages/Financial/FinancialInterfaces';

// Interface para as props
interface CategoryTreeBuilderProps {
  categories: Category[];
}

// Função que transforma as categorias em uma árvore de nós (TreeNode[])
const CategoryTreeBuilder = ({ categories }: CategoryTreeBuilderProps): TreeNode[] => {
  const categoryMap = new Map<number, TreeNode>();

  categories.forEach((category) => {
    categoryMap.set(category.id, {
      key: String(category.id), // Transformando a chave para string, conforme esperado pelo TreeSelect
      label: category.name,
      children: [],
      data: category,
    });
  });

  const nodes: TreeNode[] = [];
  categories.forEach((category) => {
    if (category.parent_id === null) {
      nodes.push(categoryMap.get(category.id)!);
    } else {
      const parentNode = categoryMap.get(category.parent_id);
      if (parentNode) {
        if (parentNode.children) {
          parentNode.children.push(categoryMap.get(category.id)!);
      }
     }
    }
  });

  return nodes;
};

export default CategoryTreeBuilder;
