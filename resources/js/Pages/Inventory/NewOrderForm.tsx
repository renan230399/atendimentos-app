import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { FaPlusCircle, FaTrash } from 'react-icons/fa';
import ProductWithStock from './Partials/ProductWithStock';

interface Product {
    id: number;
    name: string;
}

interface Supplier {
    id: number;
    name: string;
}

interface Stock {
    id: number;
    product_id: number;
    quantity: number;
    cost_price?: number;
}

interface NewOrderFormProps {
    products: Product[];
    suppliers: Supplier[];
    stocks: Stock[];
}

const NewOrderForm: React.FC<NewOrderFormProps> = ({ products = [], suppliers = [], stocks = [] , categories = [] }) => {
    const { data, setData, post, errors, processing } = useForm({
        order_number: '',
        order_date: '',
        supplier_id: '',
        total_amount: 0,
        delivery_date: '',
        items: [] as { product_id: number; quantity: number; unit_price: number; total_price: number }[],
    });

    const DEFAULT_PRODUCT_ID = 0;
    const [newItem, setNewItem] = useState({
        product_id: DEFAULT_PRODUCT_ID,
        quantity: 1,
        unit_price: 0,
    });

    const handleAddItem = () => {
        const existingItem = data.items.find(item => item.product_id === newItem.product_id);
        
        if (existingItem) {
            alert('Este produto já foi adicionado ao pedido.');
            return;
        }
    
        if (newItem.product_id === DEFAULT_PRODUCT_ID || newItem.unit_price <= 0) {
            alert("Por favor, selecione um produto e insira um preço válido.");
            return;
        }
    
        const total_price = newItem.quantity * newItem.unit_price;
        const item = {
            product_id: newItem.product_id,
            quantity: newItem.quantity,
            unit_price: newItem.unit_price,
            total_price: total_price,
        };
    
        setData('items', [...data.items, item]);
        setNewItem({ product_id: DEFAULT_PRODUCT_ID, quantity: 1, unit_price: 0 });
    };
    

    const handleRemoveItem = (index: number) => {
        setData('items', data.items.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const total = data.items.reduce((sum, item) => sum + item.total_price, 0);
        setData('total_amount', total);
        post(route('orders.store'));
    };

    const handleProductSelect = (productId: number, unitPrice: number) => {
        setNewItem({ product_id: productId, quantity: 1, unit_price: unitPrice });
    };

    const renderError = (field: string) => errors[field] ? <p className="text-red-500">{errors[field]}</p> : null;

    return (
        <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-md flex flex-wrap gap-6">
            <h2 className="w-full text-xl font-bold mb-4">Cadastrar Nova Compra</h2>

            {/* Informações do Pedido */}
            <div className="mb-4 w-[20%]">
                <label className="block font-medium text-gray-700">Número do Pedido</label>
                <input
                    type="text"
                    value={data.order_number}
                    onChange={(e) => setData('order_number', e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    required
                />
                {renderError('order_number')}
            </div>

            <div className="mb-4 w-[15%]">
                <label className="block font-medium text-gray-700">Data do Pedido</label>
                <input
                    type="date"
                    value={data.order_date}
                    onChange={(e) => setData('order_date', e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    required
                />
                {renderError('order_date')}
            </div>

            <div className="mb-4">
                <label className="block font-medium text-gray-700">Fornecedor</label>
                <select
                    value={data.supplier_id}
                    onChange={(e) => setData('supplier_id', e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    required
                >
                    <option value="">Selecione um fornecedor</option>
                    {suppliers.map((supplier) => (
                        <option key={supplier.id} value={supplier.id}>
                            {supplier.name}
                        </option>
                    ))}
                </select>
                {renderError('supplier_id')}
            </div>

            <div className="mb-4">
                <label className="block font-medium text-gray-700">Data de Entrega</label>
                <input
                    type="date"
                    value={data.delivery_date}
                    onChange={(e) => setData('delivery_date', e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
                {renderError('delivery_date')}
            </div>
            {/* Itens adicionados */}
            <div className="mb-4 w-full">
                <h3 className="text-lg font-semibold mb-2">Itens do Pedido</h3>
                {data.items.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="w-full mt-4 table-auto text-left">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2">Produto</th>
                                    <th className="px-4 py-2">Quantidade</th>
                                    <th className="px-4 py-2">Preço Unitário</th>
                                    <th className="px-4 py-2">Total</th>
                                    <th className="px-4 py-2">Ação</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.items.map((item, index) => {
                                    const product = products.find(p => p.id === item.product_id);
                                    return (
                                        <tr key={index}>
                                            <td className="px-4 py-2">{product?.name || 'Produto não encontrado'}</td>
                                            <td className="px-4 py-2">{item.quantity}</td>
                                            <td className="px-4 py-2">R${item.unit_price.toFixed(2)}</td>
                                            <td className="px-4 py-2">R${item.total_price.toFixed(2)}</td>
                                            <td className="px-4 py-2">
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
                )}
            </div>

            <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition duration-200"
                disabled={processing}
            >
                {processing ? 'Salvando...' : 'Salvar Pedido'}
            </button>
            {/* Componente de seleção de produtos */}
            <ProductWithStock
                products={products || []}  // Certifique-se de que products é um array
                stocks={stocks || []}      // Certifique-se de que stocks é um array
                suppliers={suppliers || []}
                categories={categories || []}
                onProductSelect={handleProductSelect}
            />


        </form>
    );
};

export default NewOrderForm;
