
export interface Account {
    id: number;
    name: string;
    balance: number;
    type:string;
}
export interface PaymentMethod {
    id: number;
    account_id: number;
    name: string;
    type: string;
}
export interface PaymentMethodsFee {
    id: number;
    payment_method_id: number;
    installments: number;
    fixed_fee: number; // Em centavos
    percentage_fee: number;
    status:boolean;
}
export interface Category {
    id: number;
    name: string;
    type: string | null;
}
  
export interface Transfer {
    id: number;
    name: string;
}

export interface Transfer {
  id: number;
  from_account_id: number;
  to_account_id: number;
  amount: number;
  transfer_date: string;
  description: string;
}

  
export  interface Transaction {
    id: number;
    account_id: number;
    category_id: number;
    type: 'income' | 'expense' | 'transfer';
    amount: number;
    description: string;
    transaction_date: string;
    expected_date:string;
    related?: {
      name?: string;
      description?: string;
    };
    status: boolean;
  }