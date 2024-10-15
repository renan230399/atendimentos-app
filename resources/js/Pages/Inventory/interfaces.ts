// src/interfaces.ts

export interface Contact {
    type: string;
    value: string;
    category: 'phone' | 'link' | 'string';
}

export interface Supplier {
    id?: number;
    name: string;
    category: string;
    contacts: Contact[];
    address: string;
    state: string;
    notes: string;
    status: boolean;
}

export interface Category {
    id: number;
    name: string;
    parent_id: number | null;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    measuring_unit: 'unidade' | 'peso' | 'volume' | null; // Modificado aqui
    company_id: number;
    category_id: number;
    quantities_per_unit: number;
    measuring_unit_of_unit: string;
    status: boolean;
    photo: string[];
    stocks: {
        id: number;
        local_id: number;
        quantity: number;
        entry_date: string;
        expiration_date?: string;
        location: string;
        cost_price?: number;
    }[];
}

export interface stockLocals{
    id: number;
    company_id: number;
    parent_id: number | null;
    name: string;
    description: string;
}
// Defina a interface TreeNode na parte superior do seu componente
export interface CustomTreeNode {
    key: number; // Deve ser number e não undefined
    label: string;
    children?: CustomTreeNode[];
}

export interface OrderItem {
    id:number;
    product_id: number;
    quantity: number;
    unit_price: number;
    total_price: number;
}

export interface Order {
    id?: number;
    order_date: string;
    supplier_id: number;
    total_amount: number;
    delivery_date: string;
    notes: string;
    delivery_status: boolean;
    file: File | null;
    order_items: OrderItem[];
}

export interface Account {
    id: number;
    name: string;
    type: string;
    balance:number;
  }
// Adicione outras interfaces conforme necessário
export interface ProductFormData {
    id: number | null;
    category_id: number | null;
    name: string;
    description: string;
    measuring_unit: 'unidade' | 'peso' | 'volume' | null;
    quantities_per_unit: number | null;
    measuring_unit_of_unit: string | null;
    status: boolean;
}
