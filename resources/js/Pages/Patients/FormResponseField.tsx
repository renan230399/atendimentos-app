import React from 'react';
import {FormResponse, Field, FormResponseDetail, Form} from './interfacesPatients'

// Tipando as props do componente
interface FormResponseFieldProps {
    field: Field;
    response: string | boolean | string[] | null | undefined;
}

const FormResponseField: React.FC<FormResponseFieldProps> = ({ field, response }) => {
    if (!field || !field.type || !field.label) return null;

    switch (field.type) {
        case 'text':
        case 'email':
        case 'number':
        case 'textarea':
        case 'select':
        case 'radio':
            return (
                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold">{field.label}:</label>
                    <p>{response || 'N/A'}</p>
                </div>
            );
            case 'date':
                return (
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold">{field.label}:</label>
                        <p>
                            {typeof response === 'string' || typeof response === 'number' 
                                ? new Date(response).toLocaleDateString('pt-BR') 
                                : 'N/A'}
                        </p>
                    </div>
                );
            
        case 'checkbox_group':
        case 'multi_select':
            return (
                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold">{field.label}:</label>
                    <ul className="list-disc pl-5">
                        {Array.isArray(response) && response.length > 0 ? (
                            response.map((item, index) => <li key={index}>{item}</li>)
                        ) : (
                            <p>N/A</p>
                        )}
                    </ul>
                </div>
            );
        case 'checkbox':
            return (
                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold">{field.label}:</label>
                    <p>{response ? 'Sim' : 'Não'}</p>
                </div>
            );
            case 'file':
                return (
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold">{field.label}:</label>
                        {typeof response === 'string' ? (
                            <a href={response} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                                Ver arquivo
                            </a>
                        ) : (
                            <p>Nenhum arquivo enviado</p>
                        )}
                    </div>
                );
            
        case 'body_selector':
            return (
                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold">{field.label}:</label>
                    {response ? <p>Área selecionada: {response}</p> : <p>Nenhuma área selecionada</p>}
                </div>
            );
        default:
            return null;
    }
};

export default FormResponseField;
