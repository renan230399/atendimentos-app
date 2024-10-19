export interface ContactDetail {
    type: number | null;
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
    complaints: Complaints[] | null;
    notes: string;
    profile_picture: string | null ;
    status: boolean;
    created_at?: string; // ou Date, se você estiver lidando com objetos Date
    updated_at?: string; // ou Date, se você estiver lidando com objetos Date

}
export interface PatientForm {
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
    complaints: Complaints[] | null;
    notes: string;
    profile_picture: File | null;
    status: boolean;
    created_at?: string; // ou Date, se você estiver lidando com objetos Date
    updated_at?: string; // ou Date, se você estiver lidando com objetos Date

}
export interface Complaints{
    name: string | null;
    tipo: string | null;
}
export interface WizardEstructure{
    order:number;
    name:string;
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
    wizard_structure: [] | WizardEstructure[]; // Você pode definir uma interface específica se souber o formato
    created_at: string; // ou Date
    updated_at: string; // ou Date
    fields:Field[];
}

export interface Employee {
    id: number;
    name: string;
    [key: string]: any;
}



// Definindo a tipagem dos objetos internos
// Definição das interfaces Option e OptGroup

/*export interface FormField {
    id: number;
    label: string;
    label_view: string;
    type: string;
    required: boolean;
    default_value: string;
    options?: string[]; // Supondo que esta propriedade já esteja correta
    class?: string;
    photo_select?: string | null; // Altere o tipo para string
}*/


export interface FormResponseDetail {
    id: number;
    form_field: Field;
    response: string;
}

export interface Field {
    id: number;
    label: string;
    label_view: string | null;
    default_value: string | null;
    type: string;
    step?:number;
    class?: string;
    required?: boolean;
    options?: (string | Option | OptGroup)[]; // Aceita strings, opções individuais ou grupos de opções
    photo_select?: string | null;
    order: number;
}
interface Option {
    value: string;
    label: string;
  }
  
 export interface OptGroup {
    label: string;
    options: Option[];
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
