
export interface Company {
    id: number;
    company_name: string;
    company_logo?: string;
    suppliers?: string; // ou o tipo que você espera aqui
}

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    company: Company; // Adicione a propriedade company
}