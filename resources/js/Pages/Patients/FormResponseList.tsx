import React from 'react';
import FormResponseField from './FormResponseField';

const FormResponseList = ({ formResponses, loadingFormResponses }) => {
    // Verificar se está carregando as respostas
    if (loadingFormResponses) {
        return <p>Carregando respostas...</p>;
    }

    // Garantir que `formResponses` é um array válido
    if (!Array.isArray(formResponses) || formResponses.length === 0) {
        return <p>Nenhuma resposta de formulário encontrada para este paciente.</p>;
    }

    // Agrupar respostas pelo form.id
    const groupedResponses = formResponses.reduce((groups, response) => {
        const formId = response.form.id;
        if (!groups[formId]) {
            groups[formId] = [];
        }
        groups[formId].push(response);
        return groups;
    }, {});

    return (
        <div className="mt-8">
            <h3 className="text-2xl font-bold mb-4">Respostas de Formulários</h3>
            <div className="space-y-4">
                {Object.keys(groupedResponses).map((formId) => {
                    const responses = groupedResponses[formId];
                    const form = responses[0].form; // Como todos têm o mesmo form.id, podemos usar o primeiro

                    return (
                        <div key={formId} className="bg-gray-100 p-4 rounded-lg shadow">
                            <div className="flex flex-wrap">
                                <div className="w-[100%] m-auto">
                                    <img
                                        src={form.icon}
                                        alt={`Ícone de ${form.name}`}
                                        className="w-[20%] md:w-20 md:h-20 m-auto"
                                    />
                                </div>
                                <div className="w-[100%] flex flex-wrap gap-3">
                                    <h4 className="text-lg font-semibold mb-2 w-[100%]">{form.name}</h4>
                                    {responses.map((response) => (
                                        <div key={response.id} className="p-5 border border-black m-auto shadow-xl rounded-xl">
                                            <h4 className="text-lg font-semibold mb-2">
                                                Preenchido em: {new Date(response.form.created_at).toLocaleDateString('pt-BR')}
                                            </h4>
                                            <div>
                                                {response.form_response_details.map((detail) => (
                                                    <FormResponseField
                                                        key={detail.id}
                                                        field={detail.form_field}
                                                        response={detail.response}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default FormResponseList;
