import React, { useState, useEffect, useRef,Suspense, lazy } from 'react';
import { useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import { Patient, Form, Field } from '../interfacesPatients';
import FormFieldRender from '@/Pages/Patients/Forms/FormFieldRender';
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { Button } from 'primereact/button';
import { string } from 'zod';

interface DynamicFormProps {
    form: Form;
    patient: Patient;
    onClose: () => void;
}
interface StepperRefAttributes {
    getElement: () => HTMLDivElement; // Alterado de HTMLElement | null para HTMLDivElement
    getActiveStep: () => number | undefined;
    setActiveStep: (step: number) => void;
    nextCallback: () => void;
    prevCallback: () => void;
}


const DynamicForm: React.FC<DynamicFormProps> = ({ form, patient, onClose }) => {
    const { post, setData, data, errors, processing } = useForm({
        patient_id: patient?.id || null,
        responses: {} as Record<number, any>,
    });
    const [fields, setFields] = useState<Field[]>([]);
    const [currentStep, setCurrentStep] = useState(1);
    const stepperRef = useRef<StepperRefAttributes>({
        getElement: () => document.querySelector('div') as HTMLDivElement,  // Substitua 'div' pelo seletor correto se necessário
        getActiveStep: () => currentStep,  // Retorna o passo atual
        setActiveStep: (step: number) => setCurrentStep(step),  // Define o passo atual
        nextCallback: () => {
            // Lógica para avançar para o próximo passo
        },
        prevCallback: () => {
            // Lógica para voltar ao passo anterior
        },
    });
    

    const wizardSteps = form?.wizard_structure || [];

    useEffect(() => {
        if (!form || !form.id) return;

        const fetchFormFields = async () => {
            try {
                const response = await fetch(`/forms/${form.id}/fields`);
                if (!response.ok) throw new Error('Erro ao buscar os campos do formulário');

                const result = await response.json();
                setFields(result.fields);
            } catch (error) {
                console.error('Error fetching form fields:', error instanceof Error ? error.message : error);
            }
        };

        fetchFormFields();
    }, [form]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
        field: Field
    ) => {
        if (!field || !field.id) return;

        let value: any;
        const target = e.target;

        if (target instanceof HTMLTextAreaElement) {
            value = target.value;
        } else if (target instanceof HTMLSelectElement) {
            value = field.type === 'multi_select' ? Array.from(target.selectedOptions, option => option.value) : target.value;
        } else if (target instanceof HTMLInputElement) {
            switch (field.type) {
                case 'checkbox_group':
                    const newValue = target.value;
                    const currentValues: string[] = Array.isArray(data.responses[field.id])
                        ? (data.responses[field.id] as string[])
                        : [];
                    value = target.checked ? [...currentValues, newValue] : currentValues.filter(val => val !== newValue);
                    break;
                case 'checkbox':
                    value = target.checked;
                    break;
                case 'file':
                    value = target.files ? target.files[0] : null;
                    break;
                default:
                    value = target.value;
                    break;
            }
        }

        setData('responses', {
            ...data.responses,
            [field.id]: value,
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        post(route('form.responses.store', form.id), {
            onSuccess: () => {
                onClose();
            }
        });
    };

    const handlePrevStep = () => {
        setCurrentStep(prevStep => Math.max(prevStep - 1, 1));
    };

    const handleNextStep = () => {
        setCurrentStep(prevStep => Math.min(prevStep + 1, wizardSteps.length));
    };

    return (
        <>
        <div className='w-[90%] top-0 flex-wrap absolute'>
            <div className='flex flex-wrap w-full'>
                    <img
                        src={form.icon}
                        alt={`Ícone de ${form.name}`}
                        className="w-[50%] md:w-20 md:h-20 top-0 left-[45%]"
                    />
                    <div>
                    {form && (
                            <>
                                <h2 className="text-2xl font-bold text-center mb-4">{form.name}</h2>
                                <p className="text-gray-600 text-center mb-6">{form.description}</p>
                            </>
                        )}
                    </div>
            </div>

        </div>

            <div className="p-8 shadow rounded-lg relative pb-20">


                {form.is_wizard ? (
                    <Stepper 
  ref={stepperRef as any}
  activeStep={currentStep - 1}  // Corrigido de activeIndex para activeStep
  pt={{ root: { style: { flexBasis: '50rem' } } }}
>             
{wizardSteps.map((stepTitle, index) => (
                                <StepperPanel header={String(stepTitle)} key={index}>
<div className="grid grid-cols">
{fields.length > 0 ? (
                                            fields
                                                .filter(field => field.step === index)
                                                .sort((a, b) => a.order - b.order)
                                                .map((field, idx) => (
                                                    <FormFieldRender
                                                        key={field.id ? `field-${field.id}` : `index-${idx}`}
                                                        field={field}
                                                        data={data.responses}
                                                        handleChange={handleChange}
                                                        errors={errors}
                                                    />
                                                ))
                                        ) : (
                                            <p>Nenhum campo disponível para este formulário.</p>
                                        )}
                                    </div>
                                </StepperPanel>
                            ))}
                        </Stepper>
                ) : (
                    <div className="flex flex-wrap">

                        {fields.length > 0 ? (
                            fields
                                .sort((a, b) => a.order - b.order)
                                .map((field, index) => (
                                        <FormFieldRender
                                            key={field.id ? `field-${field.id}` : `index-${index}`}
                                            field={field}
                                            data={data.responses}
                                            handleChange={handleChange}
                                            errors={errors}
                                        />
                                ))
                        ) : (
                            <div>Nenhum campo disponível para este formulário.</div>
                        )}
                                              </div>

                )}
            </div>
<div className='absolute bottom-0 w-full'>
    <div className="flex  justify-between items-center w-full bottom-0 left-0 px-6 py-4 bg-white shadow-lg z-50">
                {form.is_wizard && currentStep > 1 && (
                    <PrimaryButton
                        type="button"
                        onClick={handlePrevStep}
                        className="bg-gray-500">
                        Voltar
                    </PrimaryButton>
                )}
                {form.is_wizard && currentStep < wizardSteps.length ? (
                    <PrimaryButton
                        type="button"
                        onClick={handleNextStep}
                        className="bg-blue-500">
                        Próxima Etapa
                    </PrimaryButton>
                ) : (
                    <form onSubmit={handleSubmit} className="w-full" encType="multipart/form-data">
                        <div className="w-full">
                            <PrimaryButton
                                type="submit"
                                className="bg-green-600"
                                disabled={processing}>
                                {processing ? 'Enviando...' : 'Enviar Respostas'}
                            </PrimaryButton>
                        </div>
                    </form>
                )}
            </div>
</div>

        </>
    );
};

export default DynamicForm;
