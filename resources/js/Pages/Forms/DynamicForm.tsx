import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import FormField from '@/Pages/Forms/FormField';

const DynamicForm = ({auth, form, patient }) => {
    const { post, setData, data, errors, processing } = useForm({
        patient_id: patient?.id || null,
        responses: {},
    });
    
    const [fields, setFields] = useState([]);
    const [currentStep, setCurrentStep] = useState(1);

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
                console.error('Error fetching form fields:', error.message);
            }
        };

        fetchFormFields();
    }, [form]);

    const handleChange = (e, field) => {
        if (!field || !field.id) return;

        let value;
        switch (field.type) {
            case 'multi_select':
                value = Array.from(e.target.selectedOptions, option => option.value);
                break;
            case 'checkbox_group':
                const newValue = e.target.value;
                const currentValues = data.responses[field.id] || [];
                value = e.target.checked
                    ? [...currentValues, newValue]
                    : currentValues.filter(value => value !== newValue);
                break;
            case 'checkbox':
                value = e.target.checked;
                break;
            case 'file':
                value = e.target.files[0];
                break;
            default:
                value = e.target.value;
        }

        setData('responses', {
            ...data.responses,
            [field.id]: value,
        });
    };

    // Função para submeter o formulário
    const handleSubmit = (e) => {
        e.preventDefault();

        // Submete as respostas apenas na última etapa
        post(route('form.responses.store', form.id), {
            patient_id: data.patient_id,
            responses: data.responses,
        });

    };

    // Avança para a próxima etapa
    const handleNextStep = () => {
        if (currentStep < wizardSteps.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    // Retorna para a etapa anterior
    const handlePrevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <div className="bg-white p-8 shadow rounded-lg relative pb-20">
            {form &&  (
                <>
                    <div className="flex justify-between mb-6">
                        <img
                            src={auth.user.company.company_logo}
                            alt={`Ícone de ${form.name}`}
                            className="w-[50%] md:w-28 md:h-28"
                        />
                        <img
                            src={form.icon}
                            alt={`Ícone de ${form.name}`}
                            className="w-[50%] md:w-20 md:h-20 absolute left-[45%]"
                        />

                    </div>
                    
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-20 h-[90%] overflow-y-auto">
                {fields.length > 0 ? (
                    fields
                        .filter((field) => field.step === currentStep - 1)
                        .map((field, index) => (
                            <FormField
                                key={field.id ? `field-${field.id}` : `index-${index}`}
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
                    <form onSubmit={handleSubmit} className="w-full">
                        <PrimaryButton
                            type="submit"
                            className="bg-green-600 left-0 w-full"
                            disabled={processing}>
                            {processing ? 'Enviando...' : 'Enviar Respostas'}
                        </PrimaryButton>
                    </form>
                )}
            </div>
        </div>
    );
};

export default DynamicForm;
