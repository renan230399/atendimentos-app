import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from '@inertiajs/react';
import { FaPlusCircle, FaTrash } from 'react-icons/fa';
import ProductWithStock from '../Products/ProductWithStock';
import OrderItemsTable from './OrderItemsTable';
import PopupComponent from '@/Layouts/PopupComponent';

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
    suppliers:{
        name:string;
        category:string;
        contacts:string;
        address:string;
        state:string;
        notes:string;
        status:boolean;
    }[];
    stocks: Stock[];
}

const NewOrderForm: React.FC<NewOrderFormProps> = ({ products = [], suppliers = [], stocks = [] , categories = [] }) => {
    const { data, setData, post, errors, processing } = useForm({
        order_date: '',
        supplier_id: '',
        total_amount: 0,
        delivery_date: '',
        notes:'',
        delivery_status: false, // Adicionando o status de entrega
        file: null, // Para armazenar o arquivo associado ao pedido
        items: [] as { product_id: number; quantity: number; unit_price: number; total_price: number }[],
    });
    

    const [selectItemsPopup, setSelectItemsPopup] = useState(false);
    const [popupParams, setPopupParams] = useState({});


    const DEFAULT_PRODUCT_ID = 0;
    // Função para atualizar a quantidade ou o preço unitário
    const handleUpdateItem = (index: number, field: string, value: number) => {
        const updatedItems = [...data.items];
        updatedItems[index] = {
            ...updatedItems[index],
            [field]: value,
            total_price: updatedItems[index].quantity * updatedItems[index].unit_price, // Atualiza o total
        };
        setData('items', updatedItems);
    };
   // Função para organizar os fornecedores por categoria
    const groupedSuppliers = suppliers.reduce((acc: { [key: string]: Supplier[] }, supplier) => {
        if (!acc[supplier.category]) {
            acc[supplier.category] = [];
        }
        acc[supplier.category].push(supplier);
        return acc;
    }, {});
    // Função para adicionar o produto ao pedido
    const handleAddItem = (productId: number, unitPrice: number) => {
        const existingItem = data.items.find(item => item.product_id === productId);
        if (existingItem) {
            alert('Este produto já foi adicionado ao pedido.');
            return;
        }
        if (productId === DEFAULT_PRODUCT_ID || unitPrice < 0) {
            alert("Por favor, selecione um produto e insira um preço válido.");
            return;
        }
        const total_price = 1 * unitPrice;
        const item = {
            product_id: productId,
            quantity: 1,
            unit_price: unitPrice,
            total_price: total_price,
        };
        setData('items', [...data.items, item]);
    };
    
    // Remover item da tabela de pedidos
    const handleRemoveItem = (index: number) => {
        setData('items', data.items.filter((_, i) => i !== index));
    };

    // Submissão do formulário
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const total = data.items.reduce((sum, item) => sum + item.total_price, 0);
        setData('total_amount', total);
       console.log(data);
        // post(route('orders.store'));
    };

    // Abrir e fechar o popup
    const handleCloseSelectedItemsPopup = useCallback(() => setSelectItemsPopup(false), []);
    const handleOpenSelectItemsPopup = useCallback((e) => {
        setPopupParams({
            clientX: e.clientX,
            clientY: e.clientY,
            paddingBottom: '0px',
            classPopup:'p-6'
        });
        setSelectItemsPopup(true);
    }, []);

    // Renderização de erros
    const renderError = (field: string) => errors[field] ? <p className="text-red-500">{errors[field]}</p> : null;

    return (
        <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg flex flex-wrap gap-6 h-[100%] ">
            <h2 className="w-full text-xl font-bold">Cadastrar Nova Compra</h2>

            {/* Informações do Pedido */}
            <div className="w-full flex flex-wrap gap-2 border-b pb-4">
    {/* Campo de Data do Pedido */}
    <div className="w-[20%] m-auto">
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

    {/* Campo de Fornecedor */}
    <div className="w-[20%] m-auto">
        <label className="block font-medium text-gray-700">Fornecedor</label>
        <select
            value={data.supplier_id}
            onChange={(e) => setData('supplier_id', e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            required
        >
            <option value="">Selecione um fornecedor</option>
            {Object.entries(groupedSuppliers).map(([category, suppliers]) => (
                <optgroup key={category} label={category}>
                    {suppliers.map((supplier) => (
                        <option key={supplier.id} value={supplier.id}>
                            {supplier.name}
                        </option>
                    ))}
                </optgroup>
            ))}
        </select>
        {renderError('supplier_id')}
    </div>

    {/* Campo de Data de Entrega */}
    <div className="w-[20%] m-auto">
        <label className="block font-medium text-gray-700">Data de Entrega</label>
        <input
            type="date"
            value={data.delivery_date}
            onChange={(e) => setData('delivery_date', e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        />
        {renderError('delivery_date')}
    </div>

    {/* Campo de Valor Total */}
    <div className="w-[20%] m-auto">
        <label className="block font-medium text-gray-700">Valor Total</label>
        <input
            type="number"
            step="0.01"
            value={data.total_amount}
            onChange={(e) => setData('total_amount', e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            placeholder="Ex: 1500,00"
            required
            
        />
        {renderError('total_amount')}
    </div>

    {/* Campo de Status de Entrega */}
    <div className="w-[20%] m-auto">
        <label className="block font-medium text-gray-700">Status de Entrega</label>
        <select
            value={data.delivery_status}
            onChange={(e) => setData('delivery_status', e.target.value === 'true')}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            required
        >
            <option value="">Selecione o status</option>
            <option value="true">Entregue</option>
            <option value="false">Pendente</option>
        </select>
        {renderError('delivery_status')}
    </div>

    {/* Campo de Observações */}
    <div className="w-[40%] m-auto">
        <label className="block font-medium text-gray-700">Observações</label>
        <textarea
            value={data.notes}
            onChange={(e) => setData('notes', e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            placeholder="Adicione quaisquer observações relevantes para o pedido"
        />
        {renderError('notes')}
    </div>

    {/* Campo para Upload de Arquivos */}
    <div className="w-[35%] m-auto">
        <label className="block font-medium text-gray-700">Anexo (Foto ou PDF)</label>
        <input
            type="file"
            onChange={(e) => setData('file', e.target.files ? e.target.files[0] : null)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        />
        {renderError('file')}
    </div>
</div>



            {/* Tabela de Itens Adicionados */}
            <OrderItemsTable 
                items={data.items} 
                products={products} 
                handleRemoveItem={handleRemoveItem}
                handleUpdateItem={handleUpdateItem} 
            />

            {/* Botões */}
            <div className="w-full flex justify-between mt-4">
                <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition duration-200"
                    disabled={processing}
                >
                    {processing ? 'Salvando...' : 'Salvar Pedido'}
                </button>

                <button 
                    type="button" 
                    onClick={handleOpenSelectItemsPopup}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition duration-200"
                >
                    Adicionar produtos
                </button>
            </div>

            {/* Popup para selecionar produtos */}
            {selectItemsPopup && (
                <PopupComponent
                    id="select_items_popup"

                    zindex="101"
                    classPopup="p-6 bg-white w-[90vw] h-[96vh]"
                    params={popupParams}
                    onClose={handleCloseSelectedItemsPopup}
                >
                    <ProductWithStock
                        products={products || []}
                        stocks={stocks || []}
                        suppliers={suppliers}
                        categories={categories || []}
                        onProductSelect={handleAddItem}
                    />
                </PopupComponent>
            )}
        </form>
    );
};

export default NewOrderForm;
