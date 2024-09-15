import React, { useState, useEffect } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextArea from '@/Components/TextArea';
import InputLabel from '@/Components/InputLabel'; // Certifique-se de importar InputLabel corretamente
import EnderecoSection from '@/Pages/Pacients/FormPacient/EnderecoSection';
import DocumentoSection from '@/Pages/Pacients/FormPacient/DocumentoSection';
import ContatoSection from '@/Pages/Pacients/FormPacient/ContatoSection';

const CreatePacient = ({ pacient, onSubmit }) => {
    const { errors } = usePage().props;
    const { data, setData, post, put, reset } = useForm({
        nome_paciente: pacient?.nome_paciente || '',
        telefone: pacient?.telefone || '',
        data_nascimento: pacient?.data_nascimento || '',
        bairro: pacient?.bairro || '',
        rua: pacient?.rua || '',
        numero: pacient?.numero || '',
        complemento: pacient?.complemento || '',
        cidade: pacient?.cidade || '',
        estado: pacient?.estado || '',
        cep: pacient?.cep || '',
        cpf: pacient?.cpf || '',
        rg: pacient?.rg || '',
        responsaveis: Array.isArray(pacient?.responsaveis) ? pacient.responsaveis : [],
        observacoes: pacient?.observacoes || '',
        foto_perfil: null,
    });

    useEffect(() => {
        if (pacient) {
            setData({
                ...data,
                nome_paciente: pacient.nome_paciente,
                telefone: pacient.telefone,
                data_nascimento: pacient.data_nascimento,
                bairro: pacient.bairro,
                rua: pacient.rua,
                numero: pacient.numero,
                complemento: pacient.complemento,
                cidade: pacient.cidade,
                estado: pacient.estado,
                cep: pacient.cep,
                cpf: pacient.cpf,
                rg: pacient.rg,
                responsaveis: Array.isArray(pacient.responsaveis) ? pacient.responsaveis : [],
                observacoes: pacient.observacoes,
            });
        }
    }, [pacient]);

    const handleResponsavelChange = (index, field, value) => {
        const updatedResponsaveis = [...data.responsaveis];
        updatedResponsaveis[index][field] = value;
        setData('responsaveis', updatedResponsaveis);
    };

    const handleFileChange = (e) => {
        setData('foto_perfil', e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            if (Array.isArray(data[key])) {
                formData.append(key, JSON.stringify(data[key]));
            } else {
                formData.append(key, data[key]);
            }
        });

        if (pacient) {
            put(route('pacients.update', pacient.id), {
                data: formData,
                onSuccess: () => reset(),
                onError: (error) => console.log('Erro ao editar', error),
            });
        } else {
            post(route('pacients.store'), {
                data: formData,
                onSuccess: () => reset(),
                onError: (error) => console.log('Erro ao cadastrar', error),
            });
        }
    };

    const addResponsavel = () => {
        setData('responsaveis', [
            ...data.responsaveis,
            { nome: '', telefone: '', relacao: '' },
        ]);
    };

    const removeResponsavel = (index) => {
        setData(
            'responsaveis',
            data.responsaveis.filter((_, i) => i !== index)
        );
    };

    return (
        <div className="w-[90%] mx-auto py-12">
            <h1 className="text-2xl font-bold mb-6">
                {pacient ? 'Editar Paciente' : 'Cadastrar Novo Paciente'}
            </h1>
            
            <form onSubmit={handleSubmit} className="space-y-6 flex flex-wrap gap-1">
                <div className='w-[100%] z-10 rounded p-5 border-b-2 flex flex-wrap gap-1 shadow-2xl'>
                    <DocumentoSection 
                        data={data} 
                        setData={setData} 
                        errors={errors} 
                        nome_paciente={data.nome_paciente}
                        foto_perfil={data.foto_perfil}
                        handleFileChange={handleFileChange}
                    />
                </div>
                <div className='w-[100%] z-20 rounded p-5 border-2 border-black-200 flex flex-wrap gap-1 shadow-2xl'>
                    <EnderecoSection data={data} setData={setData} errors={errors} />
                </div>
                <div className='w-[100%] z-30 rounded p-5 border-2 border-black-200 flex flex-wrap gap-1 shadow-2xl'>
                    <ContatoSection 
                        data={data} 
                        setData={setData} 
                        errors={errors} 
                        handleResponsavelChange={handleResponsavelChange} 
                        removeResponsavel={removeResponsavel} 
                        addResponsavel={addResponsavel} 
                    />
                </div>
           
                <div className='w-[100%] md:w-[50%] pt-5'>
                    <InputLabel htmlFor="observacoes" value="Observações" />
                    <TextArea
                        id="observacoes"
                        value={data.observacoes}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('observacoes', e.target.value)}
                    />
                    <InputError message={errors.observacoes} className="mt-2" />
                </div>

                <div className="m-auto pt-20">
                    <PrimaryButton>
                        {pacient ? 'Salvar Alterações' : 'Cadastrar Paciente'}
                    </PrimaryButton>
                </div>
            </form>
        </div>
    );
};

export default CreatePacient;
