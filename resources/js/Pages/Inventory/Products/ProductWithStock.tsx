import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import ProductFilter from './ProductFilter';
import { Sidebar } from 'primereact/sidebar';
import ProductForm from './ProductForm/ProductForm';
import { Product, Supplier, Category } from '../interfaces'; // Ajuste o caminho conforme necessário
import ProductList from './ProductList';
import { TreeSelectSelectionKeysType } from 'primereact/treeselect';

interface ProductWithStockProps {
    products: Product[];
    suppliers: Supplier[];
    categories: Category[]; // Lista de categorias
    onProductSelect?: (productId: number, quantity: number) => void; // Função de adicionar produto
    stockLocals:{
        id: number;
        company_id: number;
        parent_id: number | null;
        name: string;
        description: string;
    }[];
}

const ProductWithStock: React.FC<ProductWithStockProps> = ({ products, suppliers, categories, onProductSelect,stockLocals }) => {
    const [productNameFilter, setProductNameFilter] = useState('');
    const [minStockFilter, setMinStockFilter] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState<TreeSelectSelectionKeysType | TreeSelectSelectionKeysType[] | null>(null);
    const [selectedStockLocal, setSelectedStockLocal] = useState<TreeSelectSelectionKeysType | TreeSelectSelectionKeysType[] | null>(null);

    const [formAddProduct, setFormAddProduct] = useState(false); // Form produto
    const [showModal, setShowModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null); // Produto selecionado
    const [successMessage, setSuccessMessage] = useState(''); // Mensagem de sucesso
    const [editingProduct, setEditingProduct] = useState<Product | null>(null); // Produto que está sendo editado

// Ordena e filtra os produtos por nome e categoria
const filteredProducts = products
    .sort((a, b) => a.name.localeCompare(b.name)) // Ordena os produtos em ordem alfabética
    .filter((product) => {
        const matchesName = product.name.toLowerCase().includes(productNameFilter.toLowerCase());

        // Verifica se a categoria do produto está marcada no TreeSelect
        const matchesCategory =
            selectedCategory && selectedCategory !== null
                ? Array.isArray(selectedCategory)
                    ? selectedCategory.some(
                        (category) => typeof category === 'string' && parseInt(category, 10) === product.category_id
                      ) // Verifica se a categoria está incluída, convertendo para número
                    : typeof selectedCategory === 'string' &&
                      parseInt(selectedCategory, 10) === product.category_id // Se não for array, converte para número e compara
                : true;

        return matchesName && matchesCategory;
    });

    // Lógica para lidar com o estoque dentro do próprio produto
    const stockForProduct = (product: Product) => {
        return product.stocks.filter((stock) => {
            const matchesStockQuantity = stock.quantity >= minStockFilter;

            // Verifica se o local de estoque do produto está marcado no TreeSelect
            const matchesStockLocal =
                selectedStockLocal !== null
                    ? Array.isArray(selectedStockLocal)
                        ? selectedStockLocal.some(
                            (local) => typeof local === 'string' && parseInt(local, 10) === stock.id
                        ) // Verifica se o local está incluído, convertendo para número
                        : typeof selectedStockLocal === 'string' &&
                        parseInt(selectedStockLocal, 10) === stock.id // Se não for array, converte para número e compara
                    : true;

            return matchesStockQuantity && matchesStockLocal;
        });
    };


    // Função para abrir o modal e definir o produto selecionado
    const handleAddProductClick = (product: Product) => {
        setSelectedProduct(product);
        setShowModal(true);
    };
   // Função para abrir o formulário para adicionar ou editar produto
   const handleOpenForm = (product?: Product) => {
    setEditingProduct(product || null); // Se houver um produto, significa que estamos editando
    setFormAddProduct(true); // Abre o formulário
};
    // Função para confirmar a adição do produto
    const handleConfirmAddProduct = () => {
        if (selectedProduct) {
            // Verifica se onProductSelect é definido antes de chamá-lo
            if (onProductSelect) {
                onProductSelect(selectedProduct.id, 1); // Exemplo: adicionando 1 item ao pedido
            }
            setShowModal(false);
            setSuccessMessage(`Produto "${selectedProduct.name}" adicionado com sucesso!`);
    
            // Limpa a mensagem de sucesso após 3 segundos
            setTimeout(() => setSuccessMessage(''), 3000);
        }
    };
    
    return (
        <div className="w-full h-full md:w-full flex flex-col">
            {/* Filtro de Produtos - Parte fixa */}
            <div className="h-[12%] flex-shrink-0">
                <ProductFilter
                    productNameFilter={productNameFilter}
                    setProductNameFilter={setProductNameFilter}
                    minStockFilter={minStockFilter}
                    setMinStockFilter={setMinStockFilter}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    selectedStockLocal={selectedStockLocal}
                    setSelectedStockLocal={setSelectedStockLocal}
                    categories={categories}
                    stockLocals={stockLocals}
                />
            </div>
            {onProductSelect && (
    <div
        onClick={() => setFormAddProduct(true)}
        className="mt-4 text-sm cursor-pointer text-blue-500 flex items-center hover:underline"
    >
        <FaPlus className="mr-1" />
        Cadastrar Novo produto 
    </div>
)}

            {/* Lista de Produtos - Parte rolável */}
            <ProductList
                products={products}
                filteredProducts={filteredProducts}
                stockForProduct={stockForProduct}
                handleAddProductClick={handleAddProductClick}
                handleOpenForm={handleOpenForm}
                onProductSelect={onProductSelect}
            />

    
            {/* Modal de confirmação */}
            {showModal && selectedProduct && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-lg font-semibold mb-4">Confirmar Adição</h2>
                        <p>Tem certeza que deseja adicionar o produto "{selectedProduct.name}" ao pedido?</p>
                        <div className="mt-4 flex justify-end space-x-4">
                            <button
                                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                                onClick={() => setShowModal(false)}
                            >
                                Cancelar
                            </button>
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                onClick={handleConfirmAddProduct}
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
    
            {/* Mensagem de sucesso */}
            {successMessage && (
                <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded shadow-lg">
                    {successMessage}
                </div>
            )}
<Sidebar 
    visible={formAddProduct}
    position="left" 
    className='pt-0 xl:w-[90vw] md:w-[90vw] w-[96vw] h-screen overflow-auto bg-white'  
    onHide={() => setFormAddProduct(false)}
>
    <ProductForm 
        categories={categories} 
        initialData={editingProduct || undefined} 
        onHide={() => setFormAddProduct(false)} 
    />
</Sidebar>

        </div>
    );
    
};

export default ProductWithStock;
