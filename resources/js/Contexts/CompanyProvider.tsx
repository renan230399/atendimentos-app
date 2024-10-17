import React, { createContext, useContext, useState, ReactNode } from 'react';

// Definindo o tipo do contexto com múltiplos dados
interface CompanyContextType {
    logo: string;
    setLogo: (newLogo: string) => void;
    companyName: string;
    setCompanyName: (newName: string) => void;
    theme: 'light' | 'dark';
    setTheme: (newTheme: 'light' | 'dark') => void;
}

// Criando o contexto
const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

// Custom hook para acessar o contexto
export const useCompany = () => {
    const context = useContext(CompanyContext);
    if (!context) {
        throw new Error('useCompany must be used within a CompanyProvider');
    }
    return context;
};

// Definindo o Provider com múltiplos dados
interface CompanyProviderProps {
    children: ReactNode;
    initialLogo: string;
    initialCompanyName: string;
    initialTheme: 'light' | 'dark';
}

export const CompanyProvider: React.FC<CompanyProviderProps> = ({ children, initialLogo, initialCompanyName, initialTheme }) => {
    const [logo, setLogo] = useState(initialLogo);
    const [companyName, setCompanyName] = useState(initialCompanyName);
    const [theme, setTheme] = useState<'light' | 'dark'>(initialTheme);

    return (
        <CompanyContext.Provider value={{ logo, setLogo, companyName, setCompanyName, theme, setTheme }}>
            {children}
        </CompanyContext.Provider>
    );
};
