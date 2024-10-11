import React, { useState, useCallback } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { FaPlusCircle } from 'react-icons/fa';
import ProductWithStock from './Products/ProductWithStock';
import PopUpComponent from '@/Layouts/PopupComponent';
import SuppliersManager from './Suppliers/SuppliersManager';
import NewOrderForm from './OrderItems/NewOrderForm'; // Importação do NewOrderForm
import { MdAddShoppingCart } from "react-icons/md";
import { FaSitemap } from "react-icons/fa";
import { TbTruckDelivery } from "react-icons/tb";
import { Sidebar } from 'primereact/sidebar';
import CategoriesManager from './Categories/CategoriesManager';
import IconButton from '@/Components/Utils/IconButton';
import { FaMagnifyingGlassLocation } from "react-icons/fa6";
import StockLocalsManager from './StockLocals/StockLocalsManager';
interface InventoryDashboardProps {
    auth: {
        user: {
            name: string;
            company: {
                suppliers: string; // Supondo que suppliers é um JSON string
            };
        };
    };
    categories: {
        id: number;
        name: string;
    }[];
    products: {
        id: number;
        name: string;
        description: string;
        measuring_unit: string;
        company_id: number;
        category_id: number;
    }[];
    stocks: {
        id: number;
        product_id: number;
        quantity: number;
        entry_date: string;
        expiration_date?: string;
        location: string;
        cost_price?: number;
    }[];
    stockLocals:{
        id: number;
        company_id: number;
        parent_id: number | null;
        name: string;
        description: string;
    }[];
    suppliers:{
        name:string;
        category:string;
        contacts:string;
        address:string;
        state:string;
        notes:string;
        status:boolean;
    }[];
}

export default function InventoryDashboard({ auth, categories, products, stocks, suppliers,stockLocals }: InventoryDashboardProps) {
    const [isOrderPopupOpen, setIsOrderPopupOpen] = useState(false); // Controle do popup
    const [popupParams, setPopupParams] = useState({});
    const [categoriesSideBar, setCategoriesSideBar] = useState(false); // Controle do popup
    const [suppliersPopupOpen, setSuppliersPopupOpen] = useState(false); // Controle do popup
    const [stockLocalsSideBar, setStockLocalsSideBar] = useState(false); // Controle do popup

    const handleOpenOrderPopup = useCallback((e: React.MouseEvent) => {
        setPopupParams({ clientX: e.clientX, clientY: e.clientY });
        setIsOrderPopupOpen(true);
    }, []);

    const handleCloseOrderPopup = useCallback(() => {
        setIsOrderPopupOpen(false);
    }, []);

    const handleOpenSuppliersPopup = useCallback((e: React.MouseEvent) => {
        setSuppliersPopupOpen(true);
    }, []);
    const handleCloseSuppliersPopup = useCallback(() => {
        setSuppliersPopupOpen(false);
    }, []);

    return (
        <AuthenticatedLayout user={auth.user}>
        <div className="fixed right-0 pl-2 ml-5 h-screen w-[5vw] ">
            <IconButton
                icon={<MdAddShoppingCart size={30} className="text-white" />}
                title="Adicionar nova transação"
                onClick={handleOpenOrderPopup}
            />
            <IconButton
                icon={<FaSitemap size={30} className="text-white" />}
                title="Categorias de Itens"
                onClick={() => setCategoriesSideBar(true)}
            />
            <IconButton
                icon={<TbTruckDelivery size={30} className="text-white" />}
                title="Fornecedores"
                onClick={handleOpenSuppliersPopup}
            />
            <IconButton
                icon={<FaMagnifyingGlassLocation  size={30} className="text-white" />}
                title="Locais do estoque"
                onClick={() => setStockLocalsSideBar(true)}
                />
        </div>
            <Head title="Inventário" />
            <div className="p-6  sm:px-6 lg:px-8 bg-white space-y-10 flex flex-wrap gap-6 h-screen w-[95vw]">
                {/* Produtos Section */}
                <ProductWithStock 
                        products={products} 
                        stocks={stocks} 
                        suppliers={suppliers} 
                        categories={categories} // Adiciona as categorias como props para o filtro
                        stockLocals={stockLocals}
                    />
                {/* Categorias Section */}
                <div className="w-full md:w-[60%] bg-white shadow-lg rounded-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-bold text-gray-800">Categorias</h2>
                        <button className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center shadow hover:bg-green-600 hover:shadow-lg transition duration-300 ease-in-out">
                            <FaPlusCircle className="mr-2" />
                            Adicionar Categoria
                        </button>
                    </div>
                    <div className="space-y-4">
                        {categories.map((category) => (
                            <div key={category.id} className="bg-gray-50 p-4 rounded-lg shadow-sm flex justify-between items-center transition hover:shadow-md hover:scale-105 duration-300 ease-in-out">
                                <h4 className="font-semibold text-lg text-gray-800">{category.name}</h4>
                                <button className="text-sm text-blue-500 flex items-center hover:underline">
                                    <FaPlusCircle className="mr-1" /> Editar Categoria
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>          

                {/* Popup para nova compra */}
                {isOrderPopupOpen && (
                <PopUpComponent 
                classPopup='w-[96vw] h-[94vh] bg-white'

                zindex="100"
                id="new_order_popup" 
                params={popupParams}
                onClose={handleCloseOrderPopup}
                >
                    <NewOrderForm  
                        products={products} 
                        stocks={stocks} 
                        suppliers={suppliers} 
                        categories={categories}
                        /> {/* Passando suppliers e products */}
                </PopUpComponent>
            )}
            <Sidebar 
                visible={suppliersPopupOpen}
                position="left" 
                className='pt-0 xl:w-[90vw] md:w-[90vw] w-[96vw] overflow-auto bg-white' 
                onHide={() => setSuppliersPopupOpen(false)}>
                    <SuppliersManager 
                        suppliers={suppliers}
                    />
             </Sidebar>
             <Sidebar 
                visible={categoriesSideBar}
                position="bottom" 
                className='pt-0 xl:w-[90vw] md:w-[90vw] w-[96vw] h-screen overflow-auto bg-white' 
                onHide={() => setCategoriesSideBar(false)}>
                    <CategoriesManager 
                        categories={categories}
                    />
             </Sidebar>
             <Sidebar 
                visible={stockLocalsSideBar}
                position="bottom" 
                className='pt-0 xl:w-[90vw] md:w-[90vw] w-[96vw] h-screen overflow-auto bg-white' 
                onHide={() => setStockLocalsSideBar(false)}>
                    <StockLocalsManager 
                        stockLocals={stockLocals}
                    />
             </Sidebar>
             
        </AuthenticatedLayout>
    );
}
