import './bootstrap';
import '../css/app.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { addLocale, locale } from 'primereact/api';
import React, { useState, useEffect } from 'react';
import SplashScreen from './Layouts/SplashScreen'; // Importa o SplashScreen
import { CompanyProvider } from './Contexts/CompanyProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // Importa QueryClient e QueryClientProvider
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Configurações de localidade para o PrimeReact
addLocale('pt', {
    firstDayOfWeek: 0,
    dayNames: ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
    dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
    monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    today: 'Hoje',
    clear: 'Limpar',
});

locale('pt');

const appName = import.meta.env.VITE_APP_NAME || 'Keyar';

// Crie o cliente do React Query
const queryClient = new QueryClient();

// Defina o componente com SplashScreen
const InertiaAppWithSplashScreen: React.FC<{ App: any; props: any }> = ({ App, props }) => {
    const [isSplashVisible, setIsSplashVisible] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsSplashVisible(false);
        }, 1000); // Ajuste o tempo de exibição do splash screen

        return () => clearTimeout(timeout);
    }, []);

    return (
        <QueryClientProvider client={queryClient}> {/* Envolve o app com QueryClientProvider */}
            <CompanyProvider initialLogo="" initialCompanyName="Minha Empresa" initialTheme="light">
                {isSplashVisible ? <SplashScreen /> : <App {...props} />}
                <ReactQueryDevtools initialIsOpen={false} />

            </CompanyProvider>
        </QueryClientProvider>
    );
};

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.tsx`, import.meta.glob('./Pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<InertiaAppWithSplashScreen App={App} props={props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
