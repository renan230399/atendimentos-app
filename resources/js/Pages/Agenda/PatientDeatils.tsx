import React from 'react';
import PrimaryButton from '@/Components/PrimaryButton';

const PatientDetails = ({ selectedEvent, forms, logo, handleOpenAddFormPopup, formResponses, loadingFormResponses }) => {
    return (
        <>
            <div className='h-[90%] overflow-y-auto'>
                <div className='flex flex-wrap px-10 py-5'>
                    <div className='w-[15%]'>
                        {logo ? (
                            <img
                                src={logo}
                                alt='logo da empresa'
                                className="h-auto w-full m-auto"
                            />
                        ) : (
                            <div className="w-30 h-30 bg-gray-300 m-auto rounded-full flex items-center justify-center text-gray-600 shadow-lg">
                                N/A
                            </div>
                        )}
                    </div>
                    <div className='text-center flex w-[85%]'>
                        <div className="w-[20%] flex justify-center md:justify-start">
                            {selectedEvent.patient.profile_picture ? (
                                <img
                                    src={selectedEvent.patient.profile_picture}
                                    alt={`Foto de ${selectedEvent.patient.patient_name}`}
                                    className="w-30 h-0 md:w-40 md:h-40 rounded-full m-auto shadow-lg object-cover"
                                />
                            ) : (
                                <div className="w-30 h-30 md:w-40 md:h-40 bg-gray-300 m-auto rounded-full flex items-center justify-center text-gray-600 shadow-lg">
                                    N/A
                                </div>
                            )}
                        </div>
                        <div className='my-auto'>
                            <h2 className='text-4xl font-bold mb-4'>{selectedEvent.patient.patient_name}</h2>
                        </div>
                    </div>
                </div>

                {forms.length > 0 ? (
                    <div className="flex flex-wrap w-[40%]">
                        {forms.map((form) => (
                            <div key={form.id} className="md:w-[100%] flex p-4 m-auto bg-gray-100 rounded-lg shadow border-b border-black">
                                <img
                                    src={form.icon}
                                    alt={`Ícone  de ${form.name}`}
                                    className="md:w-16 md:h-16 m-auto"
                                />
                                <h2 className="font-semibold w-[50%] m-auto text-left">{form.name}</h2>
                                <div className="flex space-x-4">
                                    <PrimaryButton
                                        onClick={(e) => handleOpenAddFormPopup(e, form)}
                                        className="mt-1 ml-1 bg-green-500"
                                    >
                                        Preencher Formulário
                                    </PrimaryButton>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>Nenhum formulário encontrado.</p>
                )}

                {/* Exibição das respostas dos formulários */}
                <div className="mt-8">
                    <h3 className="text-2xl font-bold mb-4">Respostas de Formulários</h3>
                    {loadingFormResponses ? (
                        <p>Carregando respostas...</p>
                    ) : formResponses.length > 0 ? (
                        <div className="space-y-4">
                            {formResponses.map((response) => (
                                <div key={response.id} className="bg-gray-100 p-4 rounded-lg shadow">
                                    <img
                                        src={response.form.icon}
                                        alt={`Ícone de ${response.form.name}`}
                                        className="w-[20%] md:w-10 md:h-10 m-auto"
                                    />
                                    <h4 className="text-lg font-semibold mb-2">{response.form.name}</h4>
                                    <h4 className="text-lg font-semibold mb-2">
                                        Preenchido em: {new Date(response.form.created_at).toLocaleDateString('pt-BR')}
                                    </h4>
                                    <ul className="list-disc pl-5">
                                        {response.form_response_details.map((detail) => (
                                            <li key={detail.id}>
                                                <strong>{detail.form_field.label}:</strong> {detail.response}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>Nenhuma resposta de formulário encontrada para este paciente.</p>
                    )}
                </div>
            </div>

            <div className='fixed b-0 h-[10%] w-full bg-white shadow-lg border-t border-black-500'>
                <PrimaryButton className="mt-1 ml-1 bg-green-500 text-3x1">
                    Finalizar Consulta
                </PrimaryButton>
            </div>
        </>
    );
};

export default PatientDetails;
