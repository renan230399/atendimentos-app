import React from 'react';
import ItemsTreeSelect from './ItemsTreeSelect';
import { Category, stockLocals } from '../interfaces';
import { TreeSelectSelectionKeysType } from 'primereact/treeselect';

interface ProductFilterProps {
    productNameFilter: string;
    setProductNameFilter: (value: string) => void;
    minStockFilter?: number;
    setMinStockFilter?: (value: number) => void;
    selectedCategory?: TreeSelectSelectionKeysType | TreeSelectSelectionKeysType[] | null; // Ajustado para TreeSelectSelectionKeysType
    setSelectedCategory?: (value: TreeSelectSelectionKeysType | TreeSelectSelectionKeysType[] | null) => void; // Ajustado
    selectedStockLocal?: TreeSelectSelectionKeysType | TreeSelectSelectionKeysType[] | null; // Ajustado
    setSelectedStockLocal?: (value: TreeSelectSelectionKeysType | TreeSelectSelectionKeysType[] | null) => void; // Ajustado
    categories?: Category[];
    stockLocals?: stockLocals[];
}

const ProductFilter: React.FC<ProductFilterProps> = ({
    productNameFilter,
    setProductNameFilter,
    minStockFilter,
    setMinStockFilter,
    selectedCategory,
    setSelectedCategory,
    selectedStockLocal,
    setSelectedStockLocal,
    categories = [],
    stockLocals = [],
}) => {
    return (
        <div className="flex flex-wrap gap-6">
            <div className="w-[30%]">
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
            {minStockFilter !== undefined && setMinStockFilter && (
                <div className="w-[10%]">
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
            )}
                {(selectedCategory !== null || selectedCategory !== undefined) && setSelectedCategory && (
                    <div className="w-[25%]">
                        <label htmlFor="categoryFilter" className="block text-sm font-medium text-gray-700">
                            Categoria
                        </label>
                        <ItemsTreeSelect
                            items={categories}
                            filterItems={selectedCategory ?? null}
                            setFilterItems={setSelectedCategory}
                            placeHolder="Selecione categorias"
                        />
                    </div>
                )}
                    {(selectedStockLocal !== null || selectedStockLocal !== undefined) && setSelectedStockLocal && stockLocals.length > 0 && (
                        <div className="w-[25%]">
                            <label htmlFor="stockLocalFilter" className="block text-sm font-medium text-gray-700">
                                Local de estoque
                            </label>
                            <ItemsTreeSelect
                                items={stockLocals}
                                filterItems={selectedStockLocal ?? null}
                                setFilterItems={setSelectedStockLocal}
                                placeHolder="Filtre por locais"
                            />
                        </div>
                    )}
        </div>
    );
};

export default ProductFilter;
