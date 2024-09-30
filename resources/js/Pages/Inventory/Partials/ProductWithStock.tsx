import React, { useState, useCallback } from 'react';
import { FaEdit, FaPlusCircle } from 'react-icons/fa';


interface Stock {
    id: number;
    product_id: number;
    quantity: number;
    entry_date: string;
    expiration_date?: string;
    location: string;
    cost_price?: number;
}

interface Product {
    id: number;
    name: string;
    description: string;
    measuring_unit: string;
    category_id: number; // Campo de categoria no produto
}

interface Supplier {
    id: number;
    name: string;
}

interface Category {
    id: number;
    name: string;
}

interface ProductWithStockProps {
    products: Product[];
    stocks: Stock[];
    suppliers: Supplier[];
    categories: Category[]; // Lista de categorias
}

const ProductWithStock: React.FC<ProductWithStockProps> = ({ products, stocks, suppliers, categories, onProductSelect = null }) => {
    const [productNameFilter, setProductNameFilter] = useState('');
    const [minStockFilter, setMinStockFilter] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState(''); // Filtro de categoria


    // Filtragem de produtos por nome e categoria
    const filteredProducts = products.filter((product) => {
        const matchesName = product.name.toLowerCase().includes(productNameFilter.toLowerCase());
        const matchesCategory = selectedCategory ? product.category_id === Number(selectedCategory) : true;
        return matchesName && matchesCategory;
    });

    return (
        <div className="w-full md:w-full shadow-lg">
            {/* Filtro de Produtos */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label htmlFor="productNameFilter" className="block text-sm font-medium text-gray-700">
                        Nome do Produto
                    </label>
                    <input
                        type="text"
                        id="productNameFilter"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
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
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        value={minStockFilter}
                        onChange={(e) => setMinStockFilter(Number(e.target.value))}
                        placeholder="Mínimo de estoque"
                    />
                </div>
                <div>
                    <label htmlFor="categoryFilter" className="block text-sm font-medium text-gray-700">
                        Categoria
                    </label>
                    <select
                        id="categoryFilter"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="">Todas as Categorias</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>



            {/* Lista de Produtos com Estoque */}
            <ul className=" h-[50vh] overflow-y-auto overflow-x-hidden">
                {filteredProducts.map((product) => {
                    const stockForProduct = stocks.filter(stock => stock.product_id === product.id && stock.quantity >= minStockFilter);
                    return (
                        <li
                            key={product.id}
                            className="bg-white text-left p-6 rounded-lg shadow-md justify-between shadow-lg  ease-in-out my-5"
                        >
                            <h4 className="font-semibold text-2xl text-left text-gray-800">{product.name}</h4>
                            
                            <div 
                                onClick={() => {
                                    if (stockForProduct.length > 0) {
                                        onProductSelect(product.id, stockForProduct[0].cost_price || 0);
                                    } else {
                                        alert('Produto sem estoque disponível!');
                                    }
                                }} 
                                className="mt-4 text-sm text-blue-500 flex items-center hover:underline"
                            >
                                <FaEdit className="mr-1" /> Adicionar Produto ao pedido
                            </div>


                            <p className="text-gray-600 mb-2">{product.description}</p>

                            {/* Tabela para exibir os estoques disponíveis */}
                            <div className="mt-4">
                                <h5 className="hidden font-semibold text-sm text-gray-800 mb-2">Estoque Disponível:</h5>
                                {stockForProduct.length > 0 ? (
                                    <table className="w-full text-sm text-left text-gray-700">
                                        <thead className="bg-blue-500 text-white ">
                                            <tr>
                                                <th className=" px-4 py-2">Local</th>
                                                <th className="px-4 py-2">Quantidade</th>
                                                <th className="px-4 py-2">Entrada</th>
                                                <th className="px-4 py-2">Validade</th>
                                                <th className="px-4 py-2">Preço de Custo</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {stockForProduct.map((stock) => (
                                                <tr key={stock.id} className="border-t">
                                                    <td className="px-4 py-2">{stock.location || 'Não especificado'}</td>
                                                    <td className="px-4 py-2">{stock.quantity} {product.measuring_unit}</td>
                                                    <td className="px-4 py-2">{new Date(stock.entry_date).toLocaleDateString()}</td>
                                                    <td className="px-4 py-2">{stock.expiration_date ? new Date(stock.expiration_date).toLocaleDateString() : 'Sem validade'}</td>
                                                    <td className="px-4 py-2">{stock.cost_price ? `R$${Number(stock.cost_price).toFixed(2)}` : 'N/A'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p className="text-gray-600">Sem estoque disponível com o filtro atual</p>
                                )}
                            </div>

                        </li>
                    );
                })}
            </ul>


        </div>
    );
};

export default ProductWithStock;
