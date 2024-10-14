import React from 'react';
import { Product } from '../interfaces'; // Ajuste o caminho conforme necessário

interface ProductListProps {
    products: Product[];
    filteredProducts: Product[];
    stockForProduct: (product: Product) => Product['stocks']; // Função que filtra o estoque do produto
    handleAddProductClick: (product: Product) => void;
    handleOpenForm: (product?: Product) => void;
    onProductSelect?: (productId: number, quantity: number) => void;
}

const ProductList: React.FC<ProductListProps> = ({
    products,
    filteredProducts,
    stockForProduct,
    handleAddProductClick,
    handleOpenForm,
    onProductSelect,
}) => {
    return (
        <div className="mb-14 overflow-y-auto border border-gray-300 rounded-xl flex-grow">
            <ul className="h-auto shadow-lg px-6">
                {filteredProducts.map((product) => {
                    const stocks = stockForProduct(product);

                    return (
                        <li
                            key={product.id}
                            className="bg-white text-left px-6 border-b border-b-gray-200 justify-between ease-in-out my-1"
                        >
                            <div className="flex justify-between">
                                <h4 className="font-semibold text-2xl text-left text-gray-800">{product.name}</h4>
                                <div
                                    onClick={() => handleOpenForm(product)} // Editar Produto
                                    className="text-sm cursor-pointer text-blue-500 hover:underline"
                                >
                                    Editar
                                </div>
                                {onProductSelect && (
                                    <div
                                        onClick={() => handleAddProductClick(product)}
                                        className="mt-4 text-sm cursor-pointer text-blue-500 flex items-center hover:underline"
                                    >
                                        Adicionar Produto ao pedido
                                    </div>
                                )}
                            </div>
                            <p className="text-gray-600 mb-2">{product.description}</p>

                            {/* Tabela para exibir os estoques disponíveis */}
                            <div className="mt-4">
                                {stocks.length > 0 ? (
                                    <table className="w-full text-sm text-left text-gray-700">
                                        <thead className="bg-blue-500 text-white">
                                            <tr>
                                                <th className="px-4 py-2">Local</th>
                                                <th className="px-4 py-2">Quantidade</th>
                                                <th className="px-4 py-2">Total</th>
                                                <th className="px-4 py-2">Entrada</th>
                                                <th className="px-4 py-2">Validade</th>
                                                <th className="px-4 py-2">Preço de Custo</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {stocks.map((stock) => (
                                                <tr key={stock.id} className="border-t">
                                                    <td className="px-4 py-2">{stock.location || 'Não especificado'}</td>
                                                    <td className="px-4 py-2">
                                                        {stock.quantity} unidades de {product.quantities_per_unit}{' '}
                                                        {product.measuring_unit_of_unit}
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        {stock.quantity && product.quantities_per_unit
                                                            ? stock.quantity * product.quantities_per_unit
                                                            : 0}{' '}
                                                        {product.measuring_unit_of_unit || ''}
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        {new Date(stock.entry_date).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        {stock.expiration_date
                                                            ? new Date(stock.expiration_date).toLocaleDateString()
                                                            : 'Sem validade'}
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        {(Number(stock.cost_price) / 100).toLocaleString('pt-BR', {
                                                            style: 'currency',
                                                            currency: 'BRL',
                                                        })}
                                                    </td>
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

export default ProductList;
