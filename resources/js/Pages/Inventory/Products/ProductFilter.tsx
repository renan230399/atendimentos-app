import React, { useEffect, useState } from 'react';
import ItemsTreeSelect from './ItemsTreeSelect';
import { Category, stockLocals } from '../interfaces';
import { TreeSelectSelectionKeysType } from 'primereact/treeselect';

interface ProductFilterProps {
    productNameFilterRef: React.MutableRefObject<string>; // Recebendo o useRef para o filtro de nome
    selectedCategoryRef: React.MutableRefObject<TreeSelectSelectionKeysType | TreeSelectSelectionKeysType[] | null>; // Recebendo o useRef para o filtro de categoria
    includeStocksRef: React.MutableRefObject<boolean>; // Recebendo o useRef para o filtro de estoques
    categories?: Category[];
    stockLocals?: stockLocals[];
    handleSearch: () => void;
}

const ProductFilter: React.FC<ProductFilterProps> = ({
    productNameFilterRef,
    selectedCategoryRef,
    includeStocksRef,
    categories = [],
    stockLocals = [],
    handleSearch,
}) => {
    // Estados locais para refletir as mudanças dos refs
    const [productName, setProductName] = useState(productNameFilterRef.current);
    const [selectedCategory, setSelectedCategory] = useState(selectedCategoryRef.current);
    const [includeStocks, setIncludeStocks] = useState(includeStocksRef.current);

    // Efeito para sincronizar as mudanças no ref com o estado local
    useEffect(() => {
        productNameFilterRef.current = productName;
    }, [productName]);

    useEffect(() => {
        selectedCategoryRef.current = selectedCategory;
    }, [selectedCategory]);

    useEffect(() => {
        includeStocksRef.current = includeStocks;
    }, [includeStocks]);

    return (
        <div className="flex flex-wrap gap-6">
            {/* Input de nome do produto */}
            <div className="w-[30%]">
                <label htmlFor="productNameFilter" className="block text-sm font-medium text-gray-700">
                    Nome do Produto
                </label>
                <input
                    type="text"
                    id="productNameFilter"
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)} // Atualiza o estado local
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSearch(); // Chama a função handleSearch ao pressionar Enter
                        }
                    }}
                    placeholder="Filtrar por nome"
                />
            </div>

            {/* Filtro de categorias */}
            <div className="w-[25%]">
                <label htmlFor="categoryFilter" className="block text-sm font-medium text-gray-700">
                    Categoria
                </label>
                <ItemsTreeSelect
                    items={categories}
                    filterItems={selectedCategory}
                    setFilterItems={setSelectedCategory} // Atualiza o estado local
                    placeHolder="Selecione categorias"
                />
            </div>

            {/* Checkbox para incluir apenas estoques ativos */}
            <div className="w-[25%]">
                <label htmlFor="includeStocks" className="block text-sm font-medium text-gray-700">
                    Apenas Estoques Ativos
                </label>
                <input
                    type="checkbox"
                    id="includeStocks"
                    className="mt-1"
                    checked={includeStocks}
                    onChange={(e) => setIncludeStocks(e.target.checked)} // Atualiza o estado local
                />
            </div>

            <button
                onClick={handleSearch}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Buscar
            </button>
        </div>
    );
};

export default ProductFilter;
