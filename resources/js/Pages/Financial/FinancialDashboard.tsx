import React, { useState, useCallback, useMemo, lazy, Suspense } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import CategoriesManager from '@/Pages/Financial/Partials/CategoriesManager';
import AccountsManager from '@/Pages/Financial/Partials/AccountsManager';
import TransfersManager from '@/Pages/Financial/Partials/TransfersManager';
import { useForm } from '@inertiajs/react'; // Correção na importação do Inertia.js
import { CSSTransition } from 'react-transition-group'; // Importar CSSTransition
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import TransactionsManager from './Partials/TransactionsManager';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid'; // Importar ícones do Heroicons
import TransactionsAdd from './Partials/TransactionsAdd';

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
}

interface Account {
  id: number;
  name: string;
  balance: number;
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
}) => {
  // Memoize dados que não mudam com frequência para evitar re-renderizações desnecessárias
  const memoizedAccounts = useMemo(() => accounts, [accounts]);
  const memoizedCategories = useMemo(() => categories, [categories]);
  const memoizedTransfers = useMemo(() => transfers, [transfers]);

  // Estados para lidar com o popup
  const [popupParams, setPopupParams] = useState<{ clientX: number; clientY: number } | null>(null);
  const [isAddTransactionPopupOpen, setIsAddTransactionPopupOpen] = useState(false);
  const [ViewAccounts, setIsViewAccounts] = useState(false);

  // Formulário do Inertia.js
  const { data, setData, reset, post, processing, errors } = useForm({
    category_id: categories.length > 0 ? categories[0].id : '',
    account_id: accounts.length > 0 ? accounts[0].id : '',
  });


  

  const HandleViewAccounts = useCallback(() => {
    setIsViewAccounts((prev) => !prev);
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
      <div className="p-3 mx-auto pt-4 flex flex-wrap gap-3">
        <div className="flex justify-between w-full">
          <div>
            <button 
              onClick={handleOpenAddTransactionPopup} 
              className="bg-blue-500 text-white p-2 rounded"
            >
              Adicionar Transações
            </button>
          </div>
          
          {/* Gerenciador de Contas */}
          <div className="w-full md:w-1/3">
            <button
              onClick={HandleViewAccounts}
              className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
            >
              {/* Ícone alternado de olho para mostrar ou ocultar as contas */}
              {ViewAccounts ? (
                <EyeSlashIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              ) : (
                <EyeIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              )}
              <span>{ViewAccounts ? 'Ocultar Caixas' : 'Mostrar Caixas'}</span>
            </button>
          </div>
        </div>

        {/* Usar CSSTransition para animação de entrada/saída com max-height */}
        <CSSTransition
          in={ViewAccounts} // Animação de entrada/saída baseada no estado
          timeout={500} // Duração da animação
          classNames={{
            enter: 'max-h-0 overflow-hidden',
            enterActive: 'animate-slide-down-height',
            exit: 'max-h-0 overflow-hidden',
            exitActive: 'animate-slide-up-height',
          }}
          unmountOnExit // Desmontar quando não estiver visível
        >
          <div className="w-full">
            <AccountsManager accounts={memoizedAccounts} />
          </div>
        </CSSTransition>

        <div className="w-full">
          <TransactionsManager accounts={memoizedAccounts} categories={memoizedCategories} />
        </div>

        {/* Gerenciador de Categorias e Transferências */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          <CategoriesManager categories={memoizedCategories} />
          <TransfersManager 
            accounts={memoizedAccounts} 
            transfers={memoizedTransfers}
          />
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
            onClose={handleCloseAddTransactionPopup}
          >
            <div className="pt-6">
              {auth.user.company?.company_logo ? (
                <img
                  src={auth.user.company.company_logo}
                  alt="logo da empresa"
                  className="h-auto w-28 m-auto"
                />
              ) : (
                <div></div>
              )}
            </div>
            <TransactionsAdd
              data={data}
              setData={(field, value) => setData(field, value)}
              accounts={memoizedAccounts}
              categories={memoizedCategories}
              loading={processing}
              errors={errors}
            />
          </PopUpComponent>
        </Suspense>
      )}
    </AuthenticatedLayout>
  );
};

export default FinancialDashboard;
