import React, { useState, useEffect } from 'react';
import { Sidebar } from 'primereact/sidebar';
import NewSupplierForm from './SupplierForm';
import { FaPlusCircle, FaEdit } from "react-icons/fa";
import ContactsInput from '@/Components/ContactsInput';

interface Supplier {
    name: string;
    category: string;
    contacts: string;
    address: string;
    state: string;
    notes: string;
    status: boolean;
}

interface SuppliersManagerProps {
    suppliers: Supplier[];
}

export default function SuppliersManager({ suppliers }: SuppliersManagerProps) {
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
    const [categories, setCategories] = useState<string[]>([]);
    const [saveSupplier, setSaveSupplier] = useState(false);

    useEffect(() => {
        // Extrair categorias únicas dos fornecedores
        const uniqueCategories = Array.from(new Set(suppliers.map(supplier => supplier.category)));
        setCategories(uniqueCategories);
    }, [suppliers]);

    // Função para agrupar os fornecedores por categoria
    const groupedSuppliers = suppliers.reduce((acc, supplier) => {
        if (!acc[supplier.category]) {
            acc[supplier.category] = [];
        }
        acc[supplier.category].push(supplier);
        return acc;
    }, {} as Record<string, Supplier[]>);

    const handleOpenPopup = () => {
        setSelectedSupplier(null); // Resetamos o supplier para null quando estamos criando um novo
        setIsPopupVisible(true);
    };

    const handleEditSupplier = (supplier: Supplier) => {
        const formattedSupplier = {
            ...supplier,
            contacts: convertContactsToArray(supplier.contacts),
        };
        setSelectedSupplier(formattedSupplier); // Carrega os dados do fornecedor selecionado com contatos formatados
        setIsPopupVisible(true);
    };

    const handleClosePopup = () => {
        setIsPopupVisible(false);
        setSelectedSupplier(null); // Limpa o supplier selecionado ao fechar o popup
    };

    const handleSaveSupplier = (supplierData: any) => {
        if (selectedSupplier) {
            console.log('Fornecedor editado:', supplierData);
            // Lógica para atualizar o fornecedor existente
        } else {
            console.log('Novo fornecedor salvo:', supplierData);
            // Lógica para salvar o novo fornecedor
        }
        handleClosePopup();
    };

    // Função para converter a string JSON de contatos em um array de objetos
    const convertContactsToArray = (contacts: any) => {
        try {
            if (Array.isArray(contacts)) {
                return contacts;
            }

            const parsedContacts = JSON.parse(contacts);
            return Array.isArray(parsedContacts)
                ? parsedContacts
                : Object.entries(parsedContacts).map(([key, value]) => ({
                    type: key,
                    value: value?.value ?? '',
                    category: value?.category ?? '',
                }));
        } catch (error) {
            console.error('Erro ao converter contatos:', error);
            return [{ type: 'Telefone Principal', value: '' }];
        }
    };

    return (
        <div className="w-full px-3">
            <div className="flex flex-wrap md:fixed top-0 gap-5">
                <div className="m-auto">
                    <img src="/images/icons/suppliers.png" className="w-20 h-20" alt="Suppliers Icon" />
                </div>
                <div className="m-auto">
                    <h2 className="text-2xl font-bold mb-4">Lista de Fornecedores</h2>
                </div>
                <div className="m-auto">
                    <button
                        onClick={handleOpenPopup}
                        className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
                    >
                        <FaPlusCircle className="mr-2" />
                        Novo Fornecedor
                    </button>
                </div>
            </div>

            <div className="mt-20">
                {Object.entries(groupedSuppliers).map(([category, suppliers]) => (
                    <div key={category} className="mb-6">
                        <h3 className="text-xl font-semibold mb-4 bg-blue-100 p-2 rounded">{category}</h3>
                        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                            {suppliers.map((supplier, index) => (
                                <div key={index} className="bg-white shadow-md rounded p-4 hover:shadow-lg transition-shadow border border-gray-200">
                                    <h4 className="text-lg font-bold mb-2">{supplier.name}</h4>
                                    <p><strong>Endereço:</strong> {supplier.address}</p>
                                    <p><strong>Estado:</strong> {supplier.state}</p>
                                    <p><strong>Status:</strong> {supplier.status ? 'Ativo' : 'Inativo'}</p>
                                    <div className="mt-2">
                                        {convertContactsToArray(supplier.contacts).map((contact, index) => (
                                            <p key={index}>
                                                <strong>{contact.type}:</strong> {contact.value}
                                            </p>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => handleEditSupplier(supplier)}
                                        className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded flex items-center justify-center hover:bg-yellow-600 transition"
                                        title="Editar Fornecedor"
                                    >
                                        <FaEdit className="mr-2" /> Editar
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <Sidebar visible={isPopupVisible} position="right" className='xl:w-[90vw] md:w-[90vw] w-[96vw] h-screen overflow-hidden' onHide={handleClosePopup}>
                <NewSupplierForm
                    onClose={handleClosePopup}
                    setSaveSupplier={setSaveSupplier}
                    initialData={selectedSupplier}
                    categories={categories}
                />
            </Sidebar>
        </div>
    );
}
