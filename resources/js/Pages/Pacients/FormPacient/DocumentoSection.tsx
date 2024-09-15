import React from 'react';
import MaskedInput from 'react-text-mask';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import DateOfBirthInput from '@/Components/DateOfBirthInput';
import TextInput from '@/Components/TextInput';
import CpfInput from '@/Components/CpfInput';

const DocumentoSection = ({ data, setData, errors, nome_paciente, foto_perfil, handleFileChange }) => {


    const rgMask = [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/];

    return (
        <>
            <div className="w-[100%] md:w-[20%] m-auto bg-white">
                {/* Exibe a foto de perfil */}
                <img
                    src={foto_perfil ? URL.createObjectURL(foto_perfil) : 'https://keyar-atendimentos.s3.amazonaws.com/icones/documentos.png'}
                    className="m-auto w-20 h-20 md:w-40 md:h-40"
                    alt="Foto de Perfil"
                />
            </div>

            <div className="w-[100%] md:w-[78%] md:m-auto flex flex-wrap gap-1">
                <div className="w-[100%] md:w-[100%]">
                    <h1 className="text-2xl font-bold mb-6">Informações de documentos</h1>
                </div>

                {/* Campo de nome */}
                <div className="w-[100%] md:w-[100%]">
                    <InputLabel htmlFor="nome_paciente" value="Nome do Paciente" />
                    <TextInput
                        id="nome_paciente"
                        value={nome_paciente}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('nome_paciente', e.target.value)}
                        required
                    />
                    <InputError message={errors.nome_paciente} className="mt-2" />
                </div>

                <div className="w-[100%] md:w-[32%]">
                    <DateOfBirthInput
                        value={data.data_nascimento}
                        onChange={(value) => setData('data_nascimento', value)}
                        errors={errors}
                    />
                </div>
                <div className="w-[100%] md:w-[32%]">
                    <CpfInput
                        value={data.cpf}
                        onChange={(e) => setData('cpf', e.target.value)}
                        errors={errors.cpf}
                    />
                </div>
              {/*  <div className="w-[100%] md:w-[32%]">
                    <InputLabel htmlFor="cpf" value="CPF" />
                    <MaskedInput
                        mask={cpfMask}
                        value={data.cpf}
                        onChange={handleCPFChange}
                        className="mt-1 block w-full border-gray-300 rounded-md"
                        placeholder="000.000.000-00"
                    />
                    <InputError message={errors.cpf} className="mt-2" />
                </div>*/}

                <div className="w-[100%] md:w-[32%]">
                    <InputLabel htmlFor="rg" value="RG" />
                    <MaskedInput
                        mask={rgMask}
                        value={data.rg}
                        onChange={(e) => setData('rg', e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md"
                        placeholder="00.000.000-0"
                    />
                    <InputError message={errors.rg} className="mt-2" />
                </div>

                {/* Campo para alterar a foto de perfil */}
                <div className="w-[100%]">
                    <InputLabel htmlFor="foto_perfil" value="Atualizar Foto de Perfil" />
                    <input
                        type="file"
                        id="foto_perfil"
                        className="block w-full text-sm text-slate-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:bg-violet-50 file:text-violet-700
                        hover:file:bg-violet-100"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                    <InputError message={errors.foto_perfil} className="mt-2" />
                </div>
            </div>

        </>
    );
};

export default DocumentoSection;
