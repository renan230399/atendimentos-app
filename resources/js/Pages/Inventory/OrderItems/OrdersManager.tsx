import React, { useState, useEffect } from 'react';
import PopupHeader from '@/Layouts/PopupHeader';
import OrdersList from './OrdersList';
import { Sidebar } from 'primereact/sidebar';
import NewOrderForm from './NewOrderForm';
import IconButton from '@/Components/Utils/IconButton';
import { MdAddShoppingCart } from "react-icons/md";
import { Product, Supplier, Category, stockLocals, OrderItem, Order} from '../interfaces'; // Ajuste o caminho conforme necessário

// Definindo a interface para as propriedades do OrdersManager
interface OrdersManagerProps {
    categories: Category[];
    products: Product[];
    suppliers: Supplier[];
    stockLocals:stockLocals[];
}

export default function OrdersManager({ categories, products, suppliers, stockLocals }: OrdersManagerProps) {
    const [orders, setOrders] = useState<any[]>([]); // Para armazenar os pedidos; ajustar o tipo conforme necessário
    const [totalRecords, setTotalRecords] = useState(0); // Total de registros
    const [rows, setRows] = useState(10); // Número de registros por página
    const [first, setFirst] = useState(0); // Posição da primeira linha
    const [loading, setLoading] = useState(true); // Controle de carregamento
    const [error, setError] = useState<string | null>(null); // Para armazenar erros
    const [newOrderSideBar, setNewOrderSideBar] = useState(false); // Controle do popup
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [saveForm, setSaveForm] = useState(false); // Controle para recarregar os dados ao salvar

    useEffect(() => {
        fetchOrders(first / rows + 1); // Calcula a página atual com base em 'first' e 'rows'
    }, [first, rows, saveForm]);

    const fetchOrders = async (currentPage: number, sortOrder = 'desc') => {
        setLoading(true);
        setSaveForm(false);

        try {
            const response = await fetch(`/orders-index?page=${currentPage}&sort=${sortOrder}`);
            const data = await response.json();
            setOrders(data.data); // Define os pedidos
            setTotalRecords(data.total); // Define o total de registros
        } catch (error) {
            setError('Erro ao carregar pedidos');
        } finally {
            setLoading(false); // Encerra o carregamento
        }
    };

    const onPageChange = (event: any) => {
        setFirst(event.first);
        setRows(event.rows);
    };

    // Função para editar o pedido
    const handleEditOrder = (order: Order) => {
        setSelectedOrder(order);
        setNewOrderSideBar(true);
    };
    

    return (
        <>
            <PopupHeader title="Gerenciamento de Pedidos" />

            <IconButton
                icon={<MdAddShoppingCart size={30} className="text-white" />}
                title="Categorias de Itens"
                onClick={() => {
                    setSelectedOrder(null); // Limpa o pedido selecionado para abrir no modo de cadastro
                    setNewOrderSideBar(true);
                }}
                width='w-56'
                text='Novo pedido'
            />
            <div className="orders-manager bg-gray-100 p-1 rounded-lg shadow-lg">
                {error && (
                    <div className="text-red-500 font-bold mb-4">Erro: {error}</div>
                )}

                <OrdersList
                    orders={orders}
                    suppliers={suppliers}
                    products={products}
                    first={first}
                    rows={rows}
                    totalRecords={totalRecords}
                    loading={loading}
                    onPageChange={onPageChange}
                    onEditOrder={handleEditOrder} // Passa a função de edição para o OrdersList
                />
            </div>
            <Sidebar 
                visible={newOrderSideBar}
                position="right" 
                className='pt-0 xl:w-[96vw] md:w-[96vw] w-[96vw] h-screen overflow-auto bg-white' 
                onHide={() => setNewOrderSideBar(false)}>
                <NewOrderForm  
                    products={products} 
                    suppliers={suppliers} 
                    categories={categories}
                    stockLocals={stockLocals}
                    initialData={selectedOrder} // Passa os dados do pedido selecionado
                    setNewOrderSideBar={setNewOrderSideBar} // Passa a função para fechar o Sidebar
                    setSelectedOrder={setSelectedOrder} // Reseta o pedido selecionado
                    setSaveForm={setSaveForm} // Atualiza a lista de pedidos após salvar
                />
            </Sidebar>
        </>
    );
}
