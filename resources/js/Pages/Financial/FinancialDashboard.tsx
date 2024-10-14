import React, { useState, useCallback, useMemo, lazy, Suspense } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import CategoriesManager from '@/Pages/Financial/Partials/CategoriesManager';
import AccountsManager from '@/Pages/Financial/Partials/AccountsManager';
import TransfersManager from '@/Pages/Financial/Partials/TransfersManager';
import { useForm } from '@inertiajs/react'; // Correção na importação do Inertia.js
import TransactionsManager from './Partials/TransactionsManager';
import TransactionsAdd from './Partials/TransactionsAdd';
import PaymentMethodsManager from '../Companies/PaymentMethod/PaymentMethodsManager';
import { MdAddShoppingCart } from "react-icons/md";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { FaSitemap, FaExclamationTriangle } from "react-icons/fa";
import PictureInPictureComponent from '@/Layouts/PictureInPictureComponent';
import { Sidebar } from 'primereact/sidebar';
// Lazy load do PopupComponent para carregar apenas quando necessário
const PopUpComponent = lazy(() => import('@/Layouts/PopupComponent'));

interface FinancialDashboardProps {
  auth: {
    user: {
      name: string;
      email: string;
      company?: {
        company_logo?: string;
      };
    };
  };
  accounts: Account[];
  categories: Category[];
  transfers: Transfer[];
  paymentMethods:PaymentMethod[];
  paymentMethodsFees:PaymentMethodsFee[];
}

interface Account {
  id: number;
  name: string;
  balance: number;
}
interface PaymentMethod {
  id: number;
  account_id: number;
  name: string;
  type: string;
}
interface PaymentMethodsFee {
  id: number;
  payment_method_id: number;
  installments: number;
  fixed_fee: number;
  percentage_fee: number;
}
interface Category {
  id: number;
  name: string;
}

interface Transfer {
  id: number;
  name: string;
}

const FinancialDashboard: React.FC<FinancialDashboardProps> = ({
  auth,
  accounts,
  categories,
  transfers,
  paymentMethods,
  paymentMethodsFees,
}) => {
  // Memoize dados que não mudam com frequência para evitar re-renderizações desnecessárias
  const memoizedAccounts = useMemo(() => accounts, [accounts]);
  const memoizedCategories = useMemo(() => categories, [categories]);
  const memoizedTransfers = useMemo(() => transfers, [transfers]);
  const memoizedPaymentMethods = useMemo(() => paymentMethods, [paymentMethods]);
  const memoizedPaymentMethodsFees = useMemo(() => paymentMethodsFees, [paymentMethodsFees]);
  // Estados para lidar com o popup
  const [popupParams, setPopupParams] = useState<{ clientX: number; clientY: number } | null>(null);
  const [isAddTransactionPopupOpen, setIsAddTransactionPopupOpen] = useState(false);
  const [isViewAccounts, setIsViewAccounts] = useState(false); // Estado para controlar a visualização de contas

  

  // Função para alternar a exibição das contas
  const handleToggleViewAccounts = useCallback(() => {
    setIsViewAccounts(prevState => !prevState);
  }, []);

  const handleOpenAddTransactionPopup = useCallback((e: React.MouseEvent) => {
    setPopupParams({ clientX: e.clientX, clientY: e.clientY });
    setIsAddTransactionPopupOpen(true);
  }, []);
  const handleCloseAddTransactionPopup = useCallback(() => {
    setIsAddTransactionPopupOpen(false);
  }, []);


  return (
    <AuthenticatedLayout user={auth.user}>
      <div className="fixed right-0 pl-2 justify-items-end text-right ml-5 h-screen w-[5vw] ">
        <div
          className="hover:bg-blue-900 text-center bg-blue-500 right-0 w-[5vw] cursor-pointer mt-6 p-2 shadow-xl rounded-l-md"
          title="Adicionar nova transação"
          onClick={handleOpenAddTransactionPopup}
        >
          <MdAddShoppingCart size={30} className="text-white" />
        </div>
        <div
          className="bg-red-500 w-[5vw] cursor-pointer mt-2 p-2 shadow-xl rounded-l-md"
          title="Adicionar nova compra"
        >
          <FaExclamationTriangle size={30} className="m-auto text-white" />
        </div>
        <div
          className="bg-blue-500 w-[5vw] cursor-pointer mt-2 p-2 shadow-xl rounded-l-md"
          title="Mostrar/Ocultar Contas"
          onClick={handleToggleViewAccounts} // Alterna entre mostrar e ocultar as contas
        >
          <FaSitemap size={30} className="m-auto text-white" />
        </div>
      </div>
 

      <div className="p-2  pt-4 flex flex-wrap gap-3 bg-white shadow-xl w-[95vw] overflow-hidden">
 

        <div className="w-full p-0">
          <TransactionsManager 
            accounts={memoizedAccounts} 
            categories={memoizedCategories} 
            auth={auth}
            paymentMethods={memoizedPaymentMethods} 
            paymentMethodsFees={memoizedPaymentMethodsFees} 
            />
        </div>

        {/* Gerenciador de Categorias e Transferências */}
        <div className="hidden w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          <CategoriesManager categories={memoizedCategories} />
          <TransfersManager accounts={memoizedAccounts} transfers={memoizedTransfers} />
        </div>
      </div>

      {/* Lazy loading do popup */}
      {isAddTransactionPopupOpen && (
        <Suspense fallback={<div>Carregando popup...</div>}>
          <PopUpComponent
            id="add_form_popup"
            width="80vw"
            height="90vh"
            zindex="120"
            paddingTop="100px"
            paddingLeft="100px"
            params={popupParams}
            classPopup='bg-white w-[80vw] h-[90vh]'
            onClose={handleCloseAddTransactionPopup}
            
          >
            <TransactionsAdd
             
              accounts={memoizedAccounts}
              categories={memoizedCategories}
              logo={auth.user.company?.company_logo ? (auth.user.company.company_logo):('')}

            />
          </PopUpComponent>
        </Suspense>
      )}
              <Sidebar visible={isViewAccounts} position="left" className='pt-0 xl:w-[30vw] md:w-[45vw] sm:w-[75vw] overflow-auto bg-white' onHide={() => setIsViewAccounts(false)}>
              <AccountsManager 
                accounts={memoizedAccounts} 
                company_logo={auth.user.company?.company_logo} 
                paymentMethods={memoizedPaymentMethods} 
                paymentMethodsFees={memoizedPaymentMethodsFees} 
              />

              </Sidebar>


    </AuthenticatedLayout>
  );
};

export default FinancialDashboard;
