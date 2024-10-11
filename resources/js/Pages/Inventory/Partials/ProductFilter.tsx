import React from 'react';
import CategoryTreeSelect from '../Categories/CategoryTreeSelect'; // Ajuste o caminho conforme necessário

interface ProductFilterProps {
    productNameFilter: string;
    setProductNameFilter: (value: string) => void;
    minStockFilter: number;
    setMinStockFilter: (value: number) => void;
    selectedCategory: string;
    setSelectedCategory: (value: string) => void;
    categories: { id: number; name: string; parent_id: number | null }[];
}

const ProductFilter: React.FC<ProductFilterProps> = ({
    productNameFilter,
    setProductNameFilter,
    minStockFilter,
    setMinStockFilter,
    selectedCategory,
    setSelectedCategory,
    categories,
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
                <label htmlFor="productNameFilter" className="block text-sm font-medium text-gray-700">
                    Nome do Produto
                </label>
                <input
                    type="text"
                    id="productNameFilter"
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    value={productNameFilter}
                    onChange={(e) => setProductNameFilter(e.target.value)}
                    placeholder="Filtrar por nome"
                />
            </div>
            <div>
                <label htmlFor="minStockFilter" className="block text-sm font-medium text-gray-700">
                    Estoque Mínimo
                </label>
                <input
                    type="number"
                    id="minStockFilter"
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    value={minStockFilter}
                    onChange={(e) => setMinStockFilter(Number(e.target.value))}
                    placeholder="Mínimo de estoque"
                />
            </div>
            <div>
                <label htmlFor="categoryFilter" className="block text-sm font-medium text-gray-700">
                    Categoria
                </label>
                <CategoryTreeSelect
                    categories={categories}
                    filterCategory={selectedCategory}
                    setFilterCategory={setSelectedCategory}
                />
            </div>
        </div>
    );
};

export default ProductFilter;
