import React, { useState, useCallback } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { FaPlusCircle } from 'react-icons/fa';
import ProductWithStock from './Partials/ProductWithStock';
import PopUpComponent from '@/Layouts/PopupComponent';
import NewOrderForm from './NewOrderForm'; // Importação do NewOrderForm
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
}

export default function InventoryDashboard({ auth, categories, products, stocks }: InventoryDashboardProps) {
    const suppliers = auth.user.company.suppliers ? JSON.parse(auth.user.company.suppliers) : [];
    const [isOrderPopupOpen, setIsOrderPopupOpen] = useState(false); // Controle do popup
    const [popupParams, setPopupParams] = useState({});

    const handleOpenOrderPopup = useCallback((e: React.MouseEvent) => {
        setPopupParams({ clientX: e.clientX, clientY: e.clientY });
        setIsOrderPopupOpen(true);
    }, []);

    const handleCloseOrderPopup = useCallback(() => {
        setIsOrderPopupOpen(false);
    }, []);
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Inventário" />
  {/* Produtos Section */}
  <div className="flex justify-between items-center mb-6 mt-4">
                <h3 className="text-2xl font-bold text-gray-700">Produtos</h3>
                <button
                    onClick={handleOpenOrderPopup}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center shadow hover:bg-blue-600 hover:shadow-lg transition duration-300 ease-in-out"
                >
                    <FaPlusCircle className="mr-2" />
                    Cadastrar Nova Compra
                </button>
            </div>
            <div className="p-6 max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-10 flex flex-wrap gap-6">
                {/* Produtos Section */}
                <div className="w-full">
                    <ProductWithStock 
                        products={products} 
                        stocks={stocks} 
                        suppliers={suppliers} 
                        categories={categories} // Adiciona as categorias como props para o filtro
                    />
                </div>

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
                <PopUpComponent id="new_order_popup" params={popupParams} onClose={handleCloseOrderPopup}>
                    <NewOrderForm  
                        products={products} 
                        stocks={stocks} 
                        suppliers={suppliers} 
                        categories={categories}
                        /> {/* Passando suppliers e products */}
                </PopUpComponent>
            )}
        </AuthenticatedLayout>
    );
}
