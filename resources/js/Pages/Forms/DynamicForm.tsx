import React, { useState, useEffect, FormEvent, FormState } from 'react';
import { useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import FormField from '@/Pages/Forms/FormField';
// Tipos para o formulário e campos
interface FormFieldOption {
    label: string;
    value: string;
}

interface FormFieldData {
    id: number;
    form_id: number;
    label: string;
    type: string;
    required: boolean;
    options?: FormFieldOption[] | null;
    class?: string;
    order: number;
    step: number;
}

// Define a estrutura do formulário
interface Form {
    id: number;
    name: string;
    description: string;
    fields: FormFieldData[];
}

interface DynamicFormProps {
    form: Form;
    patient: { id: number | null; name: string };
}


const DynamicForm: React.FC<DynamicFormProps> = ({ form, patient }) => {
    const { post, setData, data, errors, processing } = useForm<FormState>({
        patient_id: patient?.id || null,
        responses: {},
    });

    const [fields, setFields] = useState<FormFieldData[]>([]);
    const [currentStep, setCurrentStep] = useState(1);

    // Inicializa wizardSteps a partir da estrutura do form
    const wizardSteps = form?.wizard_structure || []; // Verifica se form existe e inicializa wizardSteps

    useEffect(() => {
        if (!form || !form.id) return;

        const fetchFormFields = async () => {
            try {
                const response = await fetch(`/forms/${form.id}/fields`);
                if (!response.ok) throw new Error('Erro ao buscar os campos do formulário');

                const result = await response.json();
                setFields(result.fields);
            } catch (error) {
                if (error instanceof Error) {
                    console.error('Error fetching form fields:', error.message);
                } else {
                    console.error('Error fetching form fields:', error); 
                }
            }
        };

        fetchFormFields();
    }, [form]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, field: FormFieldData) => {
        if (!field || !field.id) return;

        let value;
        const target = e.target;

        switch (field.type) {
            case 'multi_select':
                if (target instanceof HTMLSelectElement) {
                    value = Array.from(target.selectedOptions, option => option.value);
                }
                break;
            case 'checkbox_group':
                const newValue = target.value;
                const currentValues: string[] = Array.isArray(data.responses[field.id])
                    ? (data.responses[field.id] as string[])
                    : [];

                if (target instanceof HTMLInputElement) {
                    value = target.checked
                        ? [...currentValues, newValue]
                        : currentValues.filter(val => val !== newValue);
                }
                break;
            case 'checkbox':
                if (target instanceof HTMLInputElement) {
                    value = target.checked;
                }
                break;
            case 'file':
                if (target instanceof HTMLInputElement) {
                    value = target.files ? target.files[0] : null;
                }
                break;
            default:
                value = (target as HTMLInputElement).value;
        }

        setData('responses', {
            ...data.responses,
            [field.id]: value,
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        const payload: PostPayload = {
            patient_id: data.patient_id ?? 0,
            responses: data.responses,
            // Adicione quaisquer propriedades adicionais necessárias pela função post
        };
    
        post(route('form.responses.store', form.id), payload);
    };

    return (
        <>
            <img
                src={form.icon}
                alt={`Ícone de ${form.name}`}
                className="w-[50%] md:w-20 md:h-20 absolute top-0 left-[45%]"
            />
            {/*                        <img
                            src={auth.user.company.company_logo}
                            alt={`Ícone de ${form.name}`}
                            className="w-[50%] md:w-28 md:h-28"
                        />*/}
        <div className="p-8 shadow rounded-lg relative pb-20">
            {form &&  (
                <>
                    
                    <h2 className="text-2xl font-bold text-center mb-4">{form.name}</h2>
                    <p className="text-gray-600 text-center mb-6">{form.description}</p>
                    {form.is_wizard === true ? (
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">

                        <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{
                                width: `${(currentStep / wizardSteps.length) * 100}%`,
                            }}
                        />
                    </div>
                    ) : null }




                    <h3 className="text-xl font-semibold text-center mb-4">
                        {wizardSteps[currentStep - 1]}
                    </h3>
                </>
            )}

<div className="flex flex-wrap h-[90%] overflow-y-auto space-y-3">
            {fields.length > 0 ? (
                fields
                    .filter((field) => field.step === currentStep - 1)
                    .sort((a, b) => a.order - b.order) // Ordenando corretamente
                    .map((field, index) => (
                        <FormField
                            key={field.id ? `field-${field.id}` : `index-${index}`}
                            field={field}
                            data={data.responses}
                            handleChange={handleChange} // Certifique-se de que isso está correto
                            errors={errors}
                        />
                    ))
            ) : (
                <p>Nenhum campo disponível para este formulário.</p>
            )}
        </div>




        </div>
        <div className="flex justify-between items-center w-full bottom-0 left-0 px-6 py-4 bg-white shadow-lg z-50">
                {currentStep > 1 && (
                    <PrimaryButton
                        type="button"
                        onClick={handlePrevStep}
                        className="bg-gray-500">
                        Voltar
                    </PrimaryButton>
                )}
                {currentStep < wizardSteps.length ? (
                    <PrimaryButton
                        type="button"
                        onClick={handleNextStep}
                        className="bg-blue-500">
                        Próxima Etapa
                    </PrimaryButton>
                ) : (
                    <form onSubmit={handleSubmit} className="w-full" encType="multipart/form-data">
                        <PrimaryButton
                            type="submit"
                            className="bg-green-600 left-0"
                            disabled={processing}>
                            {processing ? 'Enviando...' : 'Enviar Respostas'}
                        </PrimaryButton>
                    </form>
                )}
            </div>
        </>

    );
};

export default DynamicForm;
