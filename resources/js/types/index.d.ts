export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    role:number;
    avatarUrl:string | '';
    company: Company; // Adicione a propriedade company
}
export interface Company {
    id: number;
    company_name: string;
    company_logo?: string;
    suppliers?: string; // ou o tipo que você espera aqui
}
export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
    };
};
