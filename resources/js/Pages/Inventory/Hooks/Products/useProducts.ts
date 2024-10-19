// src/hooks/useProducts.ts
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { TreeSelectSelectionKeysType } from 'primereact/treeselect';

interface Filters {
    productNameFilter?: string;
    selectedCategory?: TreeSelectSelectionKeysType | TreeSelectSelectionKeysType[] | Record<string, { checked: boolean; partialChecked: boolean }> | null;
    includeStocks?: boolean; // Novo filtro para incluir apenas produtos com estoque ativo
}

const fetchProducts = async (page: number, limit: number, filters: Filters) => {
    const { productNameFilter = '', selectedCategory, includeStocks = false } = filters;

    // Constrói a URL com parâmetros de filtro
    let url = `/products?page=${page}&limit=${limit}`;

    if (productNameFilter) {
        url += `&name=${encodeURIComponent(productNameFilter)}`;
    }

    // Extraindo apenas os IDs das categorias que estão com "checked: true"
    if (selectedCategory) {
        let selectedCategoryIds: string[] = [];
    
        if (typeof selectedCategory === 'object' && !Array.isArray(selectedCategory)) {
            selectedCategoryIds = Object.keys(selectedCategory).filter(
                (key) => (selectedCategory as Record<string, { checked: boolean; partialChecked: boolean; }>)[key].checked
            );
        }
    
        if (selectedCategoryIds.length > 0) {
            url += `&category=${selectedCategoryIds.join(',')}`;
        }
    }

    // Se o filtro de incluir apenas produtos com estoque estiver ativo
    if (includeStocks) {
        url += `&in_stock=true`; // Adiciona o parâmetro para buscar apenas produtos com estoque
    }

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Erro ao buscar produtos');
    }

    return response.json();
};

const useProducts = (page: number, limit: number, filters: Filters) => {
    return useQuery({
        queryKey: ['products', page, limit, filters], // Inclui os filtros na chave para invalidar adequadamente
        queryFn: () => fetchProducts(page, limit, filters), // Passa os filtros para a função de requisição
        staleTime: 5000,
        placeholderData: keepPreviousData,
    });
};

export default useProducts;
