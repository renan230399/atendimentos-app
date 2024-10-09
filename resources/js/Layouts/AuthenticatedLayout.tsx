import { useState, PropsWithChildren, ReactNode,useEffect } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link } from '@inertiajs/react';
import { User } from '@/types';
import moment from 'moment';
import 'moment/locale/pt-br';

import { Avatar } from 'primereact/avatar';
import { AvatarGroup } from 'primereact/avatargroup';   //Optional for grouping
import { Badge } from 'primereact/badge';

moment.updateLocale('pt-br', {
    weekdays: ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'],
    weekdaysShort: ['dom', 'seg', 'ter', 'qua', 'quinta-feira', 'sex', 'sáb'],
    months: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
    monthsShort: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
});
moment.locale('pt-br');

export default function Authenticated({ user, header, children }: PropsWithChildren<{ user: User, header?: ReactNode }>) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
  
    return (
        <div className="h-screen bg-gray-100 dark:bg-gray-900 z-1 overflow-hidden">
            <nav className="w-full bg-white  dark:bg-gray-800 shadow-lg border-b border-gray-300 dark:border-gray-700 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center w-full">
                            <div className="shrink-0">
                                <Link href="/dashboard">
                                    {user.company && user.company.company_logo ? (
                                        <img
                                            src={user.company.company_logo}
                                            alt={user.company.company_name}
                                            className="h-12 w-auto"
                                        />
                                    ) : (
                                        <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800 dark:text-gray-200" />
                                    )}
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                                <NavLink href={route('dashboard')} active={route().current('dashboard')}>
                                    Agenda
                                </NavLink>
                                <NavLink href={route('patients.index')} active={route().current('patients.index')}>
                                    Pacientes
                                </NavLink>
                                {user.role === 1 && user.company && (
                                    <>
                                        <NavLink className='hidden' href={route('forms.index')} active={route().current('forms.index')}>
                                            Fichas
                                        </NavLink>
                                        <NavLink href={route('employees.index')} active={route().current('employees.index')}>
                                            Funcionários
                                        </NavLink>
                                        <NavLink href={route('inventory.dashboard')} active={route().current('inventory.dashboard')}>
                                            Inventário
                                        </NavLink>

                                        <NavLink href={route('financial.dashboard')} active={route().current('financial.dashboard')}>
                                            Financeiro
                                        </NavLink>
          
                                    </>
                                )}
                            </div>
                        </div>
     
                        <div className="hidden sm:flex right-0 sm:items-center sm:w-auto sm:ml-6">
                            
                            <div className="ml-3 w-full relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        

                                        <span className="inline-flex rounded-md w-full zoom">
                                            <Avatar image="https://keyar-atendimentos.s3.amazonaws.com/patient_photos/mlAbH5Wsog0z8wsSDOTUHmU9sdM0RDJbty28kxkj.png" 
                                            shape="circle" size='large' className="my-auto p-0  p-overlay-badge" />

                                            <h1 className='my-auto text-gray-600 w-auto whitespace-nowrap'> {user.name}</h1>
                                            <button
                                                type="button"
                                                className="hidden inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none transition ease-in-out duration-150"
                                            >
                                                {user.name}
                                                <svg
                                                    className="ml-2 -mr-0.5 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('profile.edit')}>Editar informações</Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">
                                            Sair
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-mr-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-900 focus:text-gray-500 dark:focus:text-gray-400 transition duration-150 ease-in-out"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden relative bg-white right-0 w-[50vh] '}>
                    <div className="pt-0 pb-3 space-y-1">
                        <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>
                            Agenda 
                       </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('patients.index')} active={route().current('patients.index')}>
                            Pacientes
                        </ResponsiveNavLink>
                        {user.role === 1 && user.company && (
                            <>
                                <ResponsiveNavLink href={route('forms.index')} active={route().current('forms.index')}>
                                    Fichas
                                </ResponsiveNavLink>
                                <ResponsiveNavLink href={route('employees.index')} active={route().current('employees.index')}>
                                    Funcionários
                                </ResponsiveNavLink>
                                <ResponsiveNavLink href={route('reports.index')} active={route().current('reports.index')}>
                                    Relatórios
                                </ResponsiveNavLink>
                                <ResponsiveNavLink href={route('financial.dashboard')} active={route().current('reports.index')}>
                                    Inventário
                                </ResponsiveNavLink>
                                <ResponsiveNavLink href={route('financial.dashboard')} active={route().current('financial.dashboard')}>
                                    Financeiro
                                </ResponsiveNavLink>
                            </>
                        )}
                    </div>

                    <div className="pt-4 pb-1 border-t border-gray-200 dark:border-gray-600">
                        <div className="px-4">
                            <div className="font-medium text-base text-gray-800 dark:text-gray-200">
                                {user.name}
                            </div>
                            <div className="font-medium text-sm text-gray-500">{user.email}</div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>Profile</ResponsiveNavLink>
                            <ResponsiveNavLink method="post" href={route('logout')} as="button">
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Adjust padding to avoid content being behind the fixed header */}
            {header && (
                <header className="bg-white dark:bg-gray-800 shadow mt-16">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{header}</div>
                </header>
            )}

            {/* Add padding to main content to avoid overlap with fixed header */}
            <main className="">{children}</main>
        </div>
    );
}
