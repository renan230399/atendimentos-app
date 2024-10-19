import React, { useState, useRef } from 'react';
import { FaPlus } from 'react-icons/fa';
import ProductFilter from './ProductFilter';
import { Sidebar } from 'primereact/sidebar';
import ProductForm from './ProductForm/ProductForm';
import { Supplier, Category, Product, ProductFormData } from '../interfaces';
import ProductList from './ProductList';
import { TreeSelectSelectionKeysType } from 'primereact/treeselect';
import useProducts from '../Hooks/Products/useProducts';
import ReactPaginate from 'react-paginate';
import { Toast } from 'primereact/toast';
interface ProductWithStockProps {
    suppliers: Supplier[];
    categories: Category[];
    onProductSelect?: (productId: number, quantity: number) => void;
    stockLocals: {
        id: number;
        company_id: number;
        parent_id: number | null;
        name: string;
        description: string;
    }[];
}

const ProductWithStock: React.FC<ProductWithStockProps> = ({
    suppliers,
    categories,
    onProductSelect,
    stockLocals,
}) => {
    const [page, setPage] = useState(1); // Página atual
    const limit = 10; // Itens por página

    // Estados para os filtros controlados pelo usuário
    const productNameFilterRef = useRef(''); // Usando useRef para o filtro de nome
    const selectedCategoryRef = useRef<TreeSelectSelectionKeysType | TreeSelectSelectionKeysType[] | null>(null); // Usando useRef para o filtro de categoria
    const includeStocksRef = useRef(false); // Usando useRef para o filtro de estoques ativos
    
// Estado para armazenar os filtros que serão aplicados na busca
const [searchFilters, setSearchFilters] = useState<{
    productNameFilter: string;
    selectedCategory: TreeSelectSelectionKeysType | TreeSelectSelectionKeysType[] | null | undefined;
    includeStocks: boolean; // Adicionado para o novo filtro
}>({
    productNameFilter: '',
    selectedCategory: undefined,
    includeStocks: false, // Inicializado como false
});

    // Chamando o hook `useProducts` com os filtros convertidos
    const { data: productsData, isLoading, error } = useProducts(page, limit, searchFilters);
    const toast = useRef<Toast>(null);

    const [formAddProduct, setFormAddProduct] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    // Função para atualizar os filtros de pesquisa e acionar a busca
    const handleSearch = () => {
        setSearchFilters({
            productNameFilter: productNameFilterRef.current, // Usando o valor do ref
            selectedCategory: selectedCategoryRef.current, // Usando o valor do ref
            includeStocks: includeStocksRef.current, // Usando o valor do ref
        });
    };
    if (isLoading) {
        return <p>Carregando produtos...</p>;
    }

    if (error) {
        return <p>Erro ao carregar produtos: {error.message}</p>;
    }

    const handleAddProductClick = (product: Product) => {
        setSelectedProduct(product);
        setShowModal(true);
    };

    const handleOpenForm = (product?: Product) => {
        console.log('produto escolhido:', product);
        console.log(product?.name);
        setEditingProduct(product || null);
        setFormAddProduct(true);
    };

    const handleConfirmAddProduct = () => {
        if (selectedProduct) {
            if (onProductSelect) {
                onProductSelect(selectedProduct.id, 1);
            }
            setShowModal(false);
            toast.current?.show({severity:'success', summary: 'Successo!', detail:'Produto adicionado ao seu pedido', life: 3000});

           // setSuccessMessage(`Produto "${selectedProduct.name}" adicionado com sucesso!`);

            setTimeout(() => setSuccessMessage(''), 2000);
        }
    };

    return (
        <div className="w-full h-full md:w-full flex flex-col">
            {/* Filtro de Produtos */}
            <div className="h-[12%] flex-shrink-0">
            <ProductFilter
                productNameFilterRef={productNameFilterRef} // Passando o ref
                selectedCategoryRef={selectedCategoryRef} // Passando o ref
                includeStocksRef={includeStocksRef} // Passando o ref
                categories={categories}
                stockLocals={stockLocals}
                handleSearch={handleSearch}
            />
                {/* Botão para acionar a busca */}
            </div>

            {/* Lista de Produtos */}
            <div className="h-[67vh] flex-shrink-0">
            <ProductList
                products={productsData?.data || []}  // Aqui acessamos os produtos dentro de "data"
                filteredProducts={productsData?.data || []}  // Usamos "data" para garantir o array correto
                handleAddProductClick={handleAddProductClick}
                handleOpenForm={handleOpenForm}
                onProductSelect={onProductSelect}
            />

            </div>

            {/* Paginação */}
            <div className='flex justify-between'>
                <div
                    onClick={() =>{
                        setFormAddProduct(true);
                        setEditingProduct(null);
                    } }
                    className="mt-4 text-sm cursor-pointer text-blue-500 flex items-center hover:underline"
                >
                    <FaPlus className="mr-1" />
                    Cadastrar Novo produto
                </div>
                <ReactPaginate
                    previousLabel={'Anterior'}
                    nextLabel={'Próxima'}
                    breakLabel={'...'}
                    breakClassName={'break-me'}
                    pageCount={Math.ceil(productsData.length / limit)} // Total de páginas com base no número de produtos e limite por página
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={(data) => setPage(data.selected + 1)} // Atualiza a página ao clicar
                    containerClassName={'pagination flex justify-center mt-4'}
                    activeClassName={'active bg-blue-500 text-white px-3 py-1 rounded'}
                    previousClassName={'px-3 py-1 bg-gray-300 rounded mr-2'}
                    nextClassName={'px-3 py-1 bg-gray-300 rounded ml-2'}
                    disabledClassName={'bg-gray-200 text-gray-500'}
                    pageClassName={'px-3 py-1 bg-gray-100 rounded mx-1'}
                    />

                </div>

    
 
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
<Toast ref={toast} />
            {/* Mensagem de sucesso */}
            {successMessage && (
                <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded shadow-lg">
                    {successMessage}
                </div>
            )}

            <Sidebar
                visible={formAddProduct}
                position="left"
                className="pt-0 xl:w-[90vw] md:w-[90vw] w-[96vw] h-screen overflow-auto bg-white"
                onHide={() => setFormAddProduct(false)}
            >
                <ProductForm
                    categories={categories}
                    initialData={editingProduct || undefined}
                    onHide={() =>{
                        setFormAddProduct(false);
                        setEditingProduct(null);
                    } }
                />
            </Sidebar>
        </div>
    );
};

export default ProductWithStock;
