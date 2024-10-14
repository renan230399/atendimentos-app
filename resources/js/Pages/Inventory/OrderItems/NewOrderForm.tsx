import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import ProductWithStock from '../Products/ProductWithStock';
import OrderItemsTable from './OrderItemsTable';
import { Sidebar } from 'primereact/sidebar';
import PaymentForm from './PaymentForm';
import PriceInput from '@/Components/PriceInput'
import { Product, Supplier, Category, stockLocals, OrderItem, Order} from '../interfaces'; // Ajuste o caminho conforme necessário

interface Errors {
    file?: string;
    order_date?: string;
    supplier_id?: string;
    total_amount?: string;
    delivery_date?: string;
    notes?: string;
    delivery_status?: string;
    order_items?: string;
}


interface NewOrderFormProps {
    products: Product[];
    suppliers: Supplier[];
    categories: Category[];
    initialData?: Order | null; // Permite que `initialData` seja nulo ou indefinido

    stockLocals:stockLocals[];
    setNewOrderSideBar: (value: boolean) => void; // Define o tipo booleano corretamente
    setSelectedOrder: (order: Order | null) => void; // Define o tipo Order ou null
    setSaveForm: (value: boolean) => void; // Define o tipo booleano

}
const NewOrderForm: React.FC<NewOrderFormProps> = ({ 
    products = [], 
    suppliers = [], 
    categories = [], 
    initialData = null,  
    stockLocals,
    setNewOrderSideBar,
    setSelectedOrder,
    setSaveForm,
}) => {
    const { data, setData, post, put, errors, processing } = useForm({
        order_date: initialData?.order_date || '',
        supplier_id: typeof initialData?.supplier_id === 'number' ? initialData.supplier_id : 0, // Garantindo que é um número
        total_amount: initialData?.total_amount || 0,
        delivery_date: initialData?.delivery_date || '',
        notes: initialData?.notes || '',
        delivery_status: initialData?.delivery_status || false,
        file: initialData?.file || null,
        order_items: initialData?.order_items ? [...initialData.order_items] : [] as OrderItem[], // Renomeado para order_items
    });

    const [selectItemsPopup, setSelectItemsPopup] = useState(false);
    const [receiveOrderForm , setReceiveOrderForm] = useState(false);

    const DEFAULT_PRODUCT_ID = 0;

    const handleUpdateItem = (index: number, field: string, value: number) => {
        const updatedItems = [...data.order_items];
        updatedItems[index] = {
            ...updatedItems[index],
            [field]: value,
            total_price: updatedItems[index].quantity * updatedItems[index].unit_price,
        };
        setData('order_items', updatedItems);
    };

    const groupedSuppliers = suppliers.reduce((acc: { [key: string]: Supplier[] }, supplier) => {
        if (!acc[supplier.category]) {
            acc[supplier.category] = [];
        }
        acc[supplier.category].push(supplier);
        return acc;
    }, {});
    const handleAddItem = (productId: number, unitPrice: number) => {
        const existingItem = data.order_items.find(item => item.product_id === productId); // Verifica se o item já existe
        if (existingItem) {
            alert('Este produto já foi adicionado ao pedido.');
            return;
        }
        if (productId === DEFAULT_PRODUCT_ID || unitPrice < 0) {
            alert("Por favor, selecione um produto e insira um preço válido.");
            return;
        }
    
        const total_price = 1 * unitPrice;
    
        // Gera um ID único para o novo item
        const newId = data.order_items.length ? Math.max(...data.order_items.map(item => item.id)) + 1 : 1; 
    
        const item: OrderItem = {
            id: newId,
            product_id: productId,
            quantity: 1,
            unit_price: unitPrice,
            total_price: total_price,
        };
    
        setData('order_items', [...data.order_items, item]); // Atualiza order_items
    };
    
    

    const handleRemoveItem = (index: number) => {
        setData('order_items', data.order_items.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const total = data.order_items.reduce((sum, item) => sum + item.total_price, 0);
        setData('total_amount', total);
    
        const routeName = initialData && initialData.id ? 'orders.update' : 'orders.store';
        const method = initialData && initialData.id ? put : post;
        console.log(data);
        method(route(routeName, initialData ? initialData.id : undefined), {
            onSuccess: () => {
                console.log('Pedido salvo com sucesso:', data);
                setNewOrderSideBar(false);
                setSelectedOrder(null);
                setSaveForm(true);
                // Aqui você pode adicionar qualquer ação após o sucesso, como fechar o modal ou redirecionar.
            },
        });
    };
    
    const renderError = (field: keyof Errors) => errors[field] ? <p className="text-red-500">{errors[field]}</p> : null;

    return (
        <form onSubmit={handleSubmit} className=" bg-white rounded-lg flex flex-wrap ">
            <div className="w-full flex pb-6 mb-2 flex-wrap border-b">
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
                        onChange={(e) => setData('supplier_id', Number(e.target.value))} // Converte para número
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
                <PriceInput
                    id="total_amount"
                    label="Valor (R$)"
                    value={data.total_amount.toString()} // Mantenha a conversão para string
                    onChange={(newValue) => setData('total_amount', parseInt(newValue, 10) || 0)} // Converte a string para número em centavos
                    required={true}
                    error={errors.total_amount}
                />


                    {renderError('total_amount')}
                </div>

                {/* Campo de Status de Entrega */}
                <div className="w-[20%] m-auto">
                    <label className="block font-medium text-gray-700">Status de Entrega</label>
                    <select
                        value={data.delivery_status ? 'true' : 'false'}
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
                <div className="w-[40%] mx-auto">
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
                <div className="w-[35%] mx-auto">
                    <label className="block font-medium text-gray-700">Anexo (Foto ou PDF)</label>
                    <input
                        type="file"
                        onChange={(e) => setData('file', e.target.files ? e.target.files[0] : null)}
                        className="mt-1 w-full border-gray-300 rounded-md shadow-sm"
                    />
                    {renderError('file')}
                </div>
            </div>

            {/* Tabela de Itens Adicionados */}
            <OrderItemsTable 
                items={data.order_items} 
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
                    {processing ? 'Salvando...' : initialData ? 'Atualizar Pedido' : 'Salvar Pedido'}
                </button>
                {initialData &&(
                    <button 
                    type="button" 
                    onClick={() => setReceiveOrderForm(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition duration-200"
                    >
                        Receber Pedido
                    </button>
                )

                }
                <button 
                    type="button" 
                    onClick={() => setSelectItemsPopup(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition duration-200"
                >
                    Adicionar produtos
                </button>
            </div>
            <Sidebar 
                visible={selectItemsPopup}
                position="left" 
                className='pt-0 xl:w-[90vw] md:w-[90vw] w-[96vw] h-screen overflow-auto bg-white'  
                onHide={() => setSelectItemsPopup(false)}
            >
                <ProductWithStock
                    products={products || []}
                    suppliers={suppliers}
                    categories={categories || []}
                    stockLocals={stockLocals || []}
                    onProductSelect={handleAddItem}
                />
            </Sidebar>
            <Sidebar 
                visible={receiveOrderForm}
                position="top" 
                className='pt-0 xl:w-[90vw] md:w-[90vw] w-[96vw] h-[96vh] overflow-auto bg-white'  
                onHide={() => setReceiveOrderForm(false)}
            ><div className=''>
                <PaymentForm
                    order={{ 
                        ...data, 
                        order_items: data.order_items // Renomeia 'items' para 'order_items'
                    }}
                    logo=''
                />

            </div>
                  
            </Sidebar>
        </form>
    );
};

export default NewOrderForm;
