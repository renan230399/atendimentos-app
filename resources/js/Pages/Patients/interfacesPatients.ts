export interface ContactDetail {
    type: string;
    value: string;
    category: 'phone' | 'link' | 'string'; // Definindo categorias como literais
}

export interface Contact {
    name: string;
    relation: string;
    contacts: ContactDetail[]; // Aqui você deve ter a lista de contatos
}

export interface Patient {
    id?: number;
    company_id?: number;
    patient_name: string;
    personal_contacts: ContactDetail[] | null;
    birth_date: string | null; // ou Date, se você estiver lidando com objetos Date
    gender: string | null;
    neighborhood: string;
    street: string;
    house_number: string;
    address_complement: string;
    city: string;
    state: string;
    cpf: string;
    contacts: Contact[] |  null; // Aqui você pode ajustar se sempre receberá um array ou uma string
    complaints: string | null;
    notes: string;
    profile_picture: string | null;
    status: boolean;
    created_at?: string; // ou Date, se você estiver lidando com objetos Date
    updated_at?: string; // ou Date, se você estiver lidando com objetos Date

}
export interface Form {
    id: number;
    company_id: number;
    category: number;
    name: string;
    description: string;
    active: boolean;
    icon: string;
    is_wizard: boolean;
    wizard_structure: null | any; // Você pode definir uma interface específica se souber o formato
    created_at: string; // ou Date
    updated_at: string; // ou Date
    fields:FormField[];
}

export interface Employee {
    id: number;
    name: string;
    [key: string]: any;
}



// Definindo a tipagem dos objetos internos
// Definição das interfaces Option e OptGroup
interface Option {
    value: string;
    label: string;
  }
  
 export interface OptGroup {
    label: string;
    options: Option[];
  }
  
  // Interface para os campos do formulário
  export interface FormField {
    label: string;
    label_view?: string;
    type: "number" | "text" | "textarea" | "select" | "select_with_optgroup" | "radio" | "checkbox" | "checkbox_group" | "date" | "multi_select" | "file" | "email"| "body_selector";
    required?: boolean;
    default_value?: string;
    options?: string[] | (OptGroup & { options: Option[] })[]; // Aceita tanto arrays de strings quanto OptGroups
    class?: string;
    photo_select?: File | null;
  }

export interface FormResponseDetail {
    id: number;
    form_field: FormField;
    response: string;
}

export interface Field{
    id: number; // Altere de string para number
    label: string;
    type: string;
    class?: string;
    required?: boolean;
    options?: string[] | FieldOption[] ;
    photo_select?: string;
    order?: number;
}
interface FieldOption {
    label: string;
    value: string;
}
export interface FormResponse {
    id: number;
    form: Form;
    form_response_details: FormResponseDetail[];
}