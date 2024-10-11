import React from 'react';
import { FaTrash } from 'react-icons/fa';
import PriceInput from '@/Components/PriceInput'; // Importando o componente de preço

interface Item {
    product_id: number;
    quantity: number;
    unit_price: number;
    total_price: number;
}

interface Product {
    id: number;
    name: string;
}

interface OrderItemsTableProps {
    items: Item[];
    products: Product[];
    handleRemoveItem: (index: number) => void;
    handleUpdateItem: (index: number, field: string, value: number) => void; // Prop para atualizar o item
}

const OrderItemsTable: React.FC<OrderItemsTableProps> = ({ items, products, handleRemoveItem, handleUpdateItem }) => {
    // Calcula o total do carrinho somando todos os itens
    const cartTotal = items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);

    return (
        <div className="w-[90%] mx-auto shadow-xl h-auto overflow-y-auto resize-y border-b border-black">
            <h3 className="text-lg font-semibold">Itens do Pedido</h3>
            {items.length > 0 ? (
                <>
                    <div className="w-full overflow-x-auto">
                        <table className="min-w-full table-fixed divide-y divide-gray-200 h-[200px]">
                            {/* Cabeçalho fixo */}
                            <thead className="bg-blue-500 text-white sticky top-0 z-10">
                                <tr>
                                    <th className="px-4 py-2 w-[40%] text-left">Produto</th>
                                    <th className="px-4 py-2 w-[15%] text-center">Quantidade</th>
                                    <th className="px-4 py-2 w-[20%] text-left">Preço Unitário</th>
                                    <th className="px-4 py-2 w-[20%] text-left">Total</th>
                                    <th className="px-4 py-2 w-[5%] text-left">Ação</th>
                                </tr>
                            </thead>
                            {/* Corpo com rolagem */}
                            <tbody className="divide-y divide-gray-200 overflow-y-auto h-[150px]">
                                {items.map((item, index) => {
                                    const product = products.find(p => p.id === item.product_id);
                                    return (
                                        <tr key={index}>
                                            <td className="px-4 py-2 w-[40%] text-left">{product?.name || 'Produto não encontrado'}</td>
                                            {/* Campo editável para quantidade */}
                                            <td className="px-4 py-2 w-[15%] text-center">
                                                <input
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => handleUpdateItem(index, 'quantity', Number(e.target.value))}
                                                    className="w-full border-gray-300 rounded-md text-center"
                                                    min={1}
                                                />
                                            </td>
                                            {/* Campo editável para preço unitário usando o PriceInput */}
                                            <td className="px-4 py-2 w-[20%] text-left">
                                                <PriceInput
                                                    id={`unit_price_${index}`}
                                                    value={item.unit_price.toString()}
                                                    onChange={(value) => handleUpdateItem(index, 'unit_price', Number(value))}
                                                    label=""
                                                    required
                                                />
                                            </td>
                                            {/* Total calculado */}
                                            <td className="px-4 py-2 w-[20%] text-left">
                                                R${((item.quantity * item.unit_price)/100).toFixed(2)}
                                            </td>
                                            {/* Botão para remover o item */}
                                            <td className="px-4 py-2 w-[5%]">
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveItem(index)}
                                                    className="text-red-500 hover:underline"
                                                >
                                                    <FaTrash className="inline-block" /> Remover
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Seção do total do carrinho */}
                    <div className="flex justify-end mt-4">
                        <h3 className="text-xl font-semibold">Total do Carrinho: R${(cartTotal / 100).toFixed(2)}</h3>
                    </div>
                </>
            ) : (
                <p className="text-gray-500">Nenhum item adicionado ao pedido ainda.</p>
            )}
        </div>
    );
};

export default OrderItemsTable;
