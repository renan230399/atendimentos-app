import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import ProductFilter from './ProductFilter';

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
    onProductSelect: (productId: number, quantity: number) => void; // Função de adicionar produto
}

const ProductWithStock: React.FC<ProductWithStockProps> = ({ products, stocks, suppliers, categories, onProductSelect }) => {
    const [productNameFilter, setProductNameFilter] = useState('');
    const [minStockFilter, setMinStockFilter] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState(''); // Filtro de categoria
    const [showModal, setShowModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null); // Produto selecionado
    const [successMessage, setSuccessMessage] = useState(''); // Mensagem de sucesso

    // Filtragem de produtos por nome e categoria
    const filteredProducts = products.filter((product) => {
        const matchesName = product.name.toLowerCase().includes(productNameFilter.toLowerCase());
        const matchesCategory = selectedCategory ? product.category_id === Number(selectedCategory) : true;
        return matchesName && matchesCategory;
    });

    // Função para abrir o modal e definir o produto selecionado
    const handleAddProductClick = (product: Product) => {
        setSelectedProduct(product);
        setShowModal(true);
    };

    // Função para confirmar a adição do produto
    const handleConfirmAddProduct = () => {
        if (selectedProduct) {
            onProductSelect(selectedProduct.id, 1); // Exemplo: adicionando 1 item ao pedido
            setShowModal(false);
            setSuccessMessage(`Produto "${selectedProduct.name}" adicionado com sucesso!`);
            
            // Limpa a mensagem de sucesso após 3 segundos
            setTimeout(() => setSuccessMessage(''), 3000);
        }
    };

    return (
        <div className="w-full h-full md:w-full flex flex-col">
            {/* Filtro de Produtos - Parte fixa */}
            <div className="h-[12%] flex-shrink-0">
                <ProductFilter
                    productNameFilter={productNameFilter}
                    setProductNameFilter={setProductNameFilter}
                    minStockFilter={minStockFilter}
                    setMinStockFilter={setMinStockFilter}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    categories={categories}
                />
            </div>
    
            {/* Lista de Produtos - Parte rolável */}
            <div className="mb-14 overflow-y-auto border border-gray-300 rounded-xl  flex-grow">
                <ul className="h-auto shadow-lg px-6">
                    {filteredProducts.map((product) => {
                        const stockForProduct = stocks.filter(stock => stock.product_id === product.id && stock.quantity >= minStockFilter);
                        return (
                            <li
                                key={product.id}
                                className="bg-white text-left px-6 border-b border-b-gray-200 justify-between ease-in-out my-5"
                            >
                                <div className="flex justify-between">
                                    <h4 className="font-semibold text-2xl text-left text-gray-800">{product.name}</h4>
                                    <div
                                        onClick={() => handleAddProductClick(product)}
                                        className="mt-4 text-sm cursor-pointer text-blue-500 flex items-center hover:underline"
                                    >
                                        <FaPlus className="mr-1" />
                                        Adicionar Produto ao pedido
                                    </div>
                                </div>
                                <p className="text-gray-600 mb-2">{product.description}</p>
    
                                {/* Tabela para exibir os estoques disponíveis */}
                                <div className="mt-4">
                                    {stockForProduct.length > 0 ? (
                                        <table className="w-full text-sm text-left text-gray-700">
                                            <thead className="bg-blue-500 text-white ">
                                                <tr>
                                                    <th className="px-4 py-2">Local</th>
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
    
            {/* Modal de confirmação */}
            {showModal && selectedProduct && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-lg font-semibold mb-4">Confirmar Adição</h2>
                        <p>Tem certeza que deseja adicionar o produto "{selectedProduct.name}" ao pedido?</p>
                        <div className="mt-4 flex justify-end space-x-4">
                            <button
                                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                                onClick={() => setShowModal(false)}
                            >
                                Cancelar
                            </button>
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                onClick={handleConfirmAddProduct}
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
    
            {/* Mensagem de sucesso */}
            {successMessage && (
                <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded shadow-lg">
                    {successMessage}
                </div>
            )}
        </div>
    );
    
};

export default ProductWithStock;
