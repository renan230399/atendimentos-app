import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator } from 'primereact/paginator';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button'; // Importa o botão de PrimeReact
import { Dialog } from 'primereact/dialog'; // Importa o Dialog de PrimeReact
import { format, parseISO } from 'date-fns'; // Certifique-se de importar corretamente
import { Product, Supplier, Category, stockLocals, Order, OrderItem } from '../interfaces'; // Ajuste o caminho conforme necessário

interface OrdersListProps {
    orders: Order[];
    suppliers: Supplier[];
    products: Product[]; // Adiciona os produtos como prop
    first: number;
    rows: number;
    totalRecords: number;
    loading: boolean;
    onPageChange: (event: any) => void;
    onEditOrder: (order: Order) => void; // Função para editar o pedido
}

// Função para encontrar o nome do fornecedor pelo supplier_id
const getSupplierName = (supplier_id: number, suppliers: Supplier[]) => {
    const supplier = suppliers.find((sup) => sup.id === supplier_id);
    return supplier ? supplier.name : 'Fornecedor não encontrado';
};

// Função para encontrar o nome do produto pelo product_id
const getProductName = (product_id: number, products: Product[]) => {
    const product = products.find((prod) => prod.id === product_id);
    return product ? product.name : 'Produto não encontrado';
};

const OrdersList: React.FC<OrdersListProps> = ({ orders, suppliers, products, first, rows, totalRecords, loading, onPageChange, onEditOrder }) => {
    const [selectedOrderItems, setSelectedOrderItems] = useState<Order['order_items']>([]); // Armazena os itens do pedido
    const [showItemsDialog, setShowItemsDialog] = useState(false); // Controla a visibilidade do pop-up

    // Função para abrir o pop-up e mostrar os itens
    const handleViewItems = (items: Order['order_items']) => {
        setSelectedOrderItems(items); // Define os itens selecionados
        setShowItemsDialog(true); // Exibe o pop-up
    };

    // Renderiza o conteúdo do pop-up
    const renderItemsDialog = () => (
        <Dialog
            header="Itens do Pedido"
            visible={showItemsDialog}
            style={{ width: '50vw' }}
            onHide={() => setShowItemsDialog(false)}
        >
            {selectedOrderItems.length > 0 ? (
                <ul className="list-disc pl-5">
                    {selectedOrderItems.map((item: OrderItem) => (  // Adicione a tipagem aqui
                        <li key={item.id}>
                            Produto: {getProductName(item.product_id, products)}, Quantidade: {item.quantity}, Total: R$ {item.total_price.toLocaleString()}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Nenhum item encontrado</p>
            )}
        </Dialog>
    );
    

    return (
        <>
            <DataTable
                value={orders}
                paginator={false}
                loading={loading}
                className="p-datatable-sm rounded-lg shadow-md"
                style={{ backgroundColor: '#fff', borderRadius: '8px' }}
            >
                <Column
                    field="supplier_id"
                    header="Fornecedor"
                    body={(rowData) => (
                        <span className="text-sm">{getSupplierName(rowData.supplier_id, suppliers)}</span>
                    )}
                />
                <Column
                    field="order_date"
                    header="Data do Pedido"
                    body={(rowData) => (
                        <span className="text-sm">
                            {rowData.order_date 
                                ? format(parseISO(rowData.order_date), 'dd/MM/yyyy')
                                : 'Data não disponível'}
                        </span>
                    )}
                />
                <Column
                    field="total_amount"
                    header="Valor Total"
                    body={(rowData) => (
                        <span className="p-text-bold text-green-500">R$ {rowData.total_amount.toLocaleString()}</span>
                    )}
                />
                {/* Coluna de Ações (Ver Itens) */}
                <Column
                    header="Ações"
                    body={(rowData) => (
                        <>
                        <div className='flex'>
                            <Button
                                label="Ver Itens"
                                icon="pi pi-eye"
                                className="m-auto bg-blue-500 text-white p-2 p-button-rounded p-button-info p-button-lg"
                                onClick={() => handleViewItems(rowData.order_items)} // Abre o pop-up com os itens
                                tooltip="Clique para visualizar os itens do pedido"
                                tooltipOptions={{ position: 'top' }}
                            />
                            <Button
                                label="Editar Pedido"
                                icon="pi pi-pencil"
                                className="m-auto bg-blue-500 text-white p-2 p-button-rounded p-button-info p-button-lg"
                                onClick={() => onEditOrder(rowData)} // Chama a função de editar com o pedido atual
                                tooltip="Clique para editar o pedido"
                                tooltipOptions={{ position: 'top' }}
                            />
                        </div>

                        </>
                    )}
                />
                <Column
                    field="delivery_status"
                    header="Status de Entrega"
                    body={(rowData) => (
                        <Badge
                            value={rowData.delivery_status ? 'Entregue' : 'Pendente'}
                            severity={rowData.delivery_status ? 'success' : 'warning'}
                        />
                    )}
                />
            </DataTable>

            {/* Exibe o pop-up com os itens do pedido */}
            {renderItemsDialog()}

            <Paginator
                first={first}
                rows={rows}
                totalRecords={totalRecords}
                onPageChange={onPageChange}
                className="mt-6 bg-white p-4 rounded-lg shadow-md"
            />
        </>
    );
};

export default OrdersList;
