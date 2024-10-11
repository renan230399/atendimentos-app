import React, { useEffect, useRef, useState } from 'react';
import { AutoComplete } from "primereact/autocomplete";

import { FaPlusCircle, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { useForm } from '@inertiajs/react';
import { Dropdown } from 'primereact/dropdown';
import TextInput from '@/Components/TextInput';
import TextArea from '@/Components/TextArea';
import { FaTrashAlt } from 'react-icons/fa';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { Toast } from 'primereact/toast';
import ContactInput from './ContactInput'; // Importa o componente ContactInput
import { MdContactPhone } from "react-icons/md";
const siglasEstados = [
    'AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 
    'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 
    'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO'
];
const statusOptions = [
    { value: true, label: 'Ativo', icon: <FaCheckCircle className='text-green-500'/> },
    { value: false, label: 'Inativo', icon: <FaExclamationTriangle className='text-red-500' /> },
];

const statusOptionTemplate = (option) => (
    <div className="flex items-center">
        {option.icon}
        <span className="ml-2">{option.label}</span>
    </div>
);

const selectedStatusTemplate = (option) => {
    if (option) {
        return (
            <div className="flex items-center">
                {option.icon}
                <span className="ml-2">{option.label}</span>
            </div>
        );
    }
    return <span>Selecione um status</span>;
};

const SupplierForm = ({ onClose, setSaveSupplier, initialData, categories }) => {
    const { data, setData, post,put, processing, errors, reset } = useForm({
        name: '',
        category: '',
        contacts: [{ type: 'Telefone Principal',  value: '',category: 'phone' }],
        address: '',
        state: '',
        notes: '',
        status: true,
        ...initialData,
    });
    const toast = useRef(null);
    const buttonEl = useRef(null);

    const [visible, setVisible] = useState(false);
    const [filterCategories, setFilterCategories] = useState([categories]);
    const accept = () => {
        // Lógica para deletar o fornecedor
        toast.current.show({ severity: 'info', summary: 'Fornecedor deletado', detail: 'O fornecedor foi excluído com sucesso.', life: 3000 });
    };
    const reject = () => {
        toast.current.show({ severity: 'warn', summary: 'Ação Cancelada', detail: 'A exclusão foi cancelada.', life: 3000 });
    };
    
    useEffect(() => {
        if (initialData) {
            setData({
                ...initialData,
                contacts: Array.isArray(initialData.contacts) ? initialData.contacts : convertContactsToArray(initialData.contacts),
            });
        }
    }, [initialData]);

    const handleContactChange = (index, field, value) => {
        const updatedContacts = [...data.contacts];
        updatedContacts[index][field] = value;
        setData('contacts', updatedContacts);
    };

    const handleAddContact = () => {
        setData('contacts', [...data.contacts, { type: '', value: '', category: 'phone' }]);
    };

    const handleRemoveContact = (index) => {
        const updatedContacts = data.contacts.filter((_, i) => i !== index);
        setData('contacts', updatedContacts);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
    
        // Remove contatos que tenham 'type' ou 'value' vazios
        const filteredContacts = data.contacts.filter(
            (contact) => contact.type.trim() !== '' || contact.value.trim() !== ''
        );
    
        // Atualiza os dados a serem enviados com a lista de contatos filtrada
        const updatedData = {
            ...data,
            contacts: filteredContacts,
        };
    
        //console.log(updatedData);
    
        if (initialData && initialData.id) {
            // Modo de edição - use a rota para atualizar um fornecedor existente
            put(route('suppliers.update', initialData.id), {
                data: updatedData,
                onSuccess: () => {
                    reset();
                    onClose();
                    setSaveSupplier(true);
                    console.log('data enviada', updatedData);

                },
            });
            
        } else {
            // Modo de cadastro - use a rota para criar um novo fornecedor
            post(route('suppliers.store'), {
                data: updatedData,
                onSuccess: () => {
                    reset();
                    onClose();
                    setSaveSupplier(true);
                },
            });
        }
    };

    return (
        <div className="p-4 h-[100%]">
            <div className="flex flex-wrap fixed top-0 border-b">
                <div className="m-auto">
                    <img src="/images/icons/suppliers.png" className="md:w-20 md:h-20 w-16 h-16" alt="Suppliers Icon" />
                </div>
                <div className="m-auto">
                    <h3 className="md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 ">
                        {initialData ? 'Editar Fornecedor' : 'Novo Fornecedor'}
                    </h3>
                </div>
            </div>            
            <form onSubmit={handleSubmit} className='flex flex-wrap'>
                <div className="mb-3 w-[65%] m-auto">
                    <label className="block font-medium">Nome</label>
                    <TextInput
                        id="name"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3 w-[34%] m-auto text-black ">
                    <label className="block font-medium">Categoria</label>
                    <AutoComplete 
                        className='bg-black border-3'
                        value={data.category || ''} 
                        suggestions={filterCategories || []} // Verifica se as sugestões estão sendo passadas
                        completeMethod={(e) => {
                            const filteredCategories = categories.filter((category) =>
                                category.toLowerCase().includes(e.query.toLowerCase())
                            );
                            setFilterCategories(filteredCategories); // Atualiza as sugestões com base no filtro
                        }}
                        onChange={(e) => setData('category', e.target.value)} 
                        placeholder="Selecione ou digite uma categoria"
                    />


                </div>
                <div className="mb-3 w-[80%] m-auto">
                    <label className="block font-medium">Endereço</label>
                    <TextInput
                        id="address"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.address || ''} // Garante que nunca seja null
                        onChange={(e) => setData('address', e.target.value)}
                        
                    />
                </div>
                <div className='mb-3 w-[19%] m-auto'>
                <label className="block font-medium">Estado</label>

                    <select value={data.state} onChange={(e) => setData('state', e.target.value)}  className="mt-1 block">
                        <option value="">Selecione um estado</option>
                        {siglasEstados.map((sigla) => (
                            <option key={sigla} value={sigla}>
                                {sigla}
                            </option>
                        ))}
                    </select>
                </div>
                <div className='flex'>
                        <MdContactPhone className='h-10 w-10 my-auto text-sky-700 mr-3'/>
                        <label className="block text-xl font-bold mb-2 my-auto">Contatos</label>
                    </div>
                <div className="w-full max-h-[20vh] overflow-y-auto shadow px-3 border rounded">

                    {data.contacts.map((contact, index) => (
                        <ContactInput
                            key={index}
                            contact={contact}
                            index={index}
                            onChange={handleContactChange}
                            onRemove={handleRemoveContact}
                        />
                    ))}
                </div>

                <div className='w-full mb-3'>
                    <button
                        type="button"
                        onClick={handleAddContact}
                        className="flex items-center text-white bg-sky-500 rounded px-3 py-1 hover:bg-sky-600 shadow-md mt-2"
                    >
                        <FaPlusCircle className="mr-1" />
                        Adicionar Contato
                    </button>
                </div>


                <div className="mb-3 w-[70%] m-auto">
                    <label className="block font-medium">Notas</label>
                    <TextArea
                        id="notes"
                        className="mt-1 block w-full resize-none"
                        value={data.notes || ''}
                        onChange={(e) => setData('notes', e.target.value)}
                    />
                </div>
                <div className="mb-3 w-[29%]">
                    <label className="block font-medium">Status</label>
                    <Dropdown
                        value={data.status !== undefined ? data.status : true} // Garante que nunca seja null
                        onChange={(e) => setData('status', e.value)}
                        options={statusOptions}
                        required
                        
                        placeholder="Selecione o status"
                        valueTemplate={selectedStatusTemplate}
                        itemTemplate={statusOptionTemplate}
                        className="w-full border border-gray-400 rounded px-2 py-1"
                    />
                </div>
                <div className='flex justify-between w-full'>
                {initialData && (
                    <div className='my-auto'>
                        <Toast ref={toast} />
                        <ConfirmPopup 
                            target={buttonEl.current} 
                            visible={visible} 
                            onHide={() => setVisible(false)} 
                            message="Tem certeza de que deseja deletar este fornecedor?" 
                            icon="pi pi-exclamation-triangle" 
                            acceptLabel="Sim, deletar Fornecedor" // Texto personalizado para o botão de aceite
                            rejectLabel="Cancelar" // Texto personalizado para o botão de rejeição
                            acceptClassName="p-button-success bg-red-500 text-white p-1 m-auto" // Classe para estilizar o botão de aceite
                            rejectClassName="p-button-success bg-green-500 text-white p-1 mx-5" // Classe para estilizar o botão de rejeição
                            accept={accept} 
                            reject={reject} 
                        />

                        <div
                            ref={buttonEl}
                            className="px-4 flex items-center gap-2 py-2 bg-red-500 text-white rounded cursor-pointer"
                            onClick={() => setVisible(true)}
                        >
                            <FaTrashAlt /> Deletar
                        </div>
                    </div>
                )}
                    <div className="flex justify-end gap-2 mt-4 w-full">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-500 text-white rounded"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-500 text-white rounded"
                            disabled={processing}
                        >
                            {initialData ? 'Atualizar Fornecedor' : 'Cadastrar Fornecedor'}
                        </button>
                    </div>
                </div>

            </form>
        </div>
    );
};

export default SupplierForm;
