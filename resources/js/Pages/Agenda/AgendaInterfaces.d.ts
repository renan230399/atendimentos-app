import { Patient } from "../Patients/interfacesPatients";
export interface EventPatient {
    id: number;
    title: string;
    start: Date;
    end: Date;
    price:number;
    notes:string;
    patient?:Patient;
  }
  export interface EventDefault {
      id: number;
      title: string;
      start: Date;
      end: Date;
    }
  