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
            // Se 'contacts' já for um array, retorne-o diretamente
            if (Array.isArray(contacts)) {
                return contacts;
            }
    
            // Caso contrário, trate como uma string JSON e tente converter
            const parsedContacts = JSON.parse(contacts);
            return Array.isArray(parsedContacts)
                ? parsedContacts
                : Object.entries(parsedContacts).map(([key, value]) => ({
                    type: key,
                    value: value?.value ?? '', // Usa string vazia se value for null ou undefined
                    category: value?.category ?? '', // Usa string vazia se category for null ou undefined
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

            <div className="overflow-x-auto mt-20">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 border-b">Nome</th>
                            <th className="px-4 py-2 border-b">Categoria</th>
                            <th className="px-4 py-2 border-b">Endereço</th>
                            <th className="px-4 py-2 border-b">Estado</th>
                            <th className="px-4 py-2 border-b">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {suppliers.map((supplier, index) => (

                            <tr key={index} className="hover:bg-gray-100">
                                <td className="px-4 py-2 border-b">{supplier.name}</td>
                                <td className="px-4 py-2 border-b">{supplier.category}</td>
                                <td className="px-4 py-2 border-b">{supplier.address}</td>
                                <td className="px-4 py-2 border-b">{supplier.state}</td>
                                <td className="px-4 py-2 border-b">{supplier.status ? 'true' : 'false'}</td>
                                <td className="px-4 py-2 border-b">
                                    {convertContactsToArray(supplier.contacts).map((contact, index) => (
                                        <div key={index}>
                                            <strong>{contact.type}:</strong> {contact.value}
                                        </div>
                                    ))}
                                </td>

                                    

                                <td className="px-4 py-2 border-b text-center">
                                    <button
                                        onClick={() => handleEditSupplier(supplier)}
                                        className="text-yellow-500 hover:text-yellow-700"
                                        title="Editar Fornecedor"
                                    >
                                        <FaEdit />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Sidebar visible={isPopupVisible} position="right" className='xl:w-[90vw] md:w-[90vw] w-[96vw] h-screen overflow-hidden' onHide={handleClosePopup}>
                <NewSupplierForm
                    onClose={handleClosePopup}
                    setSaveSupplier={setSaveSupplier}
                    initialData={selectedSupplier} // Passa os dados do fornecedor selecionado para edição
                    categories={categories} // Passa as categorias únicas para o formulário de fornecedor
                />
            </Sidebar>
        </div>
    );
}
