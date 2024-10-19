import React from 'react';
import { Product } from '../interfaces'; // Ajuste o caminho conforme necessário

interface ProductListProps {
    products: Product[];
    filteredProducts: Product[];
    handleAddProductClick: (product: Product) => void;
    handleOpenForm: (product?: Product) => void;
    onProductSelect?: (productId: number, quantity: number) => void;
}

const ProductList: React.FC<ProductListProps> = ({
    products,
    filteredProducts = [], // Garantimos que `filteredProducts` tenha um valor padrão
    handleAddProductClick,
    handleOpenForm,
    onProductSelect,
}) => {
    // Usamos `products` como fallback caso `filteredProducts` esteja vazio
    const displayedProducts = filteredProducts.length > 0 ? filteredProducts : products; 
    
    // Console para verificar o array
    console.log(displayedProducts);
    console.log(displayedProducts.length > 0);
    
    return (
        <div className="mb-14 overflow-y-auto border h-[100%] border-gray-300 rounded-xl flex-grow">
            <ul className="h-auto shadow-lg px-6">
                {displayedProducts.length > 0 ? (
                    displayedProducts.map((product) => (
                        <li
                            key={product.id}
                            className="bg-white text-left px-6 border-b border-b-gray-200 ease-in-out my-1 flex flex-wrap w-full"
                        >
                            <div className="flex flex-col w-[40%] border-r border-gray-300 m-1">
                                <h4 className="font-semibold text-2xl text-left text-gray-800">{product.name}</h4>

                                <p className="text-sm text-left text-gray-600">
                                    {product.description || 'Descrição indisponível'}
                                </p>

                                <strong className="text-xs text-left text-gray-800">
                                    Unidade de Medida: {product.measuring_unit || 'Indisponível'}
                                </strong>

                                <strong className="text-xs text-left text-gray-800">
                                    Quantidade por Unidade: {product.quantities_per_unit} {product.measuring_unit_of_unit}
                                </strong>
                            </div>

                            <div className="mt-4 w-[40%]">
                                <p className="text-gray-600">
                                    {product.status ? 'Produto ativo' : 'Produto inativo'}
                                </p>
                            </div>

                            <div className="w-[18%]">
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
                        </li>
                    ))
                ) : (
                    <p className="text-gray-600">Nenhum produto encontrado</p>
                )}
            </ul>
        </div>
    );
};

export default ProductList;
